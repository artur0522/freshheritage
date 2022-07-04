import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import DynamicArticleCard from '../DynamicArticleCard'
import IconArrow from '@/svgs/arrow-right.svg'

import classes from "./ArticleRow.module.scss"
import "swiper/css"

const ArticleRow = ({ fields }) => {
  const {header, ctaText, ctaUrl, articles, _key, reverseCard, illustration, illustrationAlt, illustration2, illustration2Alt, greenBackground,  topMargin, bottomMargin} = fields
  const [mounted, setMounted] = useState(false)
    console.log(articles)
    useEffect(() => {
        setMounted(true)
    }, [fields])

  return (
    <div className={`${classes['articles']} ${reverseCard ? classes['reverse'] : ''} ${greenBackground ? classes['green-bg'] : ""} ${topMargin ? classes['top-margin'] : ''} ${bottomMargin ? classes['bottom-margin'] : ''}`}>
        {illustration && <div className={classes['illustration-1']}>
            <Image
                src={illustration.asset.url}
                alt={illustrationAlt}
                width={420}
                height={388}
            />
        </div>}
        {illustration2 && <div className={classes['illustration-2']}>
            <Image 
                src={illustration2.asset.url}
                alt={illustration2Alt}
                width={370}
                height={354}
            />
        </div>}
        <div className="container">
            <div className={classes['header']}>
                {header && <h1>{header}</h1>}
                {ctaUrl && <div className={classes['header-link']}>
                    <Link href={ctaUrl}>
                        <a>{ctaText}</a>
                    </Link>
                    <IconArrow />
                </div>}
            </div>
            {articles.length > 0 && mounted &&
                <div className={classes['slider']}>
                    <Swiper
                        loop={true}
                        slidesPerView={'auto'}
                        spaceBetween={15}
                        breakpoints={{
                            1074: {
                                spaceBetween: 40
                            }
                        }}
                        >
                        {articles.map((article, index) => {
                            return (
                                <SwiperSlide className={classes['article-slide']} key={`${article._id}-${_key}-${index}`}>
                                    <DynamicArticleCard article={article} reverse={reverseCard} />
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>
            }
        </div>
    </div>
  )
}

export default ArticleRow