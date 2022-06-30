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

    useEffect(() => {
        setMounted(true)
    }, [fields])

  return (
    <div className={`${classes['articles']} ${greenBackground ? classes['green-bg'] : ""} ${topMargin ? classes['top-margin'] : ''} ${bottomMargin ? classes['bottom-margin'] : ''}`}>
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
                        slidesPerView={reverseCard ? 1.25 : 1.5}
                        spaceBetween={18}
                        breakpoints={{
                            768: {
                                slidesPerView: reverseCard ? 2.25 : 2.75
                            },
                            1074: {
                                slidesPerView: reverseCard ? 2.25 : 3.75
                            }
                        }}
                        >
                        {articles.map((article, index) => {
                            return (
                                <SwiperSlide key={`${article._id}-${_key}-${index}`}>
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