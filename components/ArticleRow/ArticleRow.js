import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import IconArrow from '@/svgs/arrow-right.svg'
import IconBullet from '@/svgs/list-item.svg'

import classes from "./ArticleRow.module.scss"
import "swiper/css"

const ArticleRow = ({fields}) => {
  const {header, ctaText, ctaUrl, articles} = fields
  console.log(articles)
  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 1073px)' })
  const isDesktop = useMediaQuery({ query: '(min-width: 1074px)' })

    useEffect(() => {
        setMounted(true)
    }, [])

  return (
    <div className={classes['articles']}>
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
                        slidesPerView={1.5}
                        spaceBetween={18}
                        breakpoints={{
                            768: {
                                slidesPerView: 2.75
                            },
                            1074: {
                                slidesPerView: 3.75
                            }
                        }}
                        >
                        {articles.map((article) => {
                            return (
                                <SwiperSlide className={classes['slider__slide']}>
                                    <div className={classes['image-wrap']}>
                                        <Image width={438} height={600} alt={article.alt} src={article.heroImage.asset.url} />
                                    </div>
                                    <div className={classes['text']}>
                                        <h4>{article.heroHeader}</h4>
                                        <p>
                                            <span>
                                                {article.heroSubheader}
                                            </span>
                                            <span>
                                                <IconBullet />
                                            </span>
                                        </p>
                                    </div>
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