import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'

import RecipeArticleCard from '../RecipeArticleCard'
import IconLongArrow from '@/svgs/long-arrow-right.svg'
import IconArrow from '@/svgs/arrow-right.svg'


import "swiper/css"
import classes from './HalfHeroHalfSlider.module.scss'

const HalfHeroHalfSlider = ({ fields }) => {
  const {header, ctaUrl, ctaText, desktopImage, mobileImage, imageAlt, imageHeader, imageCtaText, imageCtaUrl, mobileButtonText, articles} = fields
  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 1073px)' })
  const isDesktop = useMediaQuery({ query: '(min-width: 1074px)' })

  useEffect(() => {
    setMounted(true)
  }, [mounted])

  return (
    <div className={classes['wrapper']}>
        <div className="">
            <div className={`${classes['header']} container`}>
                {header && <h1>{header}</h1>}

                {ctaUrl && <div className={classes['header-link']}>
                    <Link href={ctaUrl}>
                        <a>{ctaText}</a>
                    </Link>
                    <IconArrow />
                </div>}
            </div>

            <div className={classes['row']}>
                <div className={classes['hero-wrap']}>
                    <div className={classes['hero']}>
                        {isMobile && mounted && mobileImage && <div>
                            <Image
                                src={mobileImage.asset.url}
                                layout="fill"
                                alt={imageAlt}
                                objectFit="cover"
                            />
                        </div>}
                        {isDesktop && mounted && desktopImage && <div>
                            <Image
                                src={desktopImage.asset.url}
                                layout="fill"
                                alt={imageAlt}
                                objectFit="cover"
                            />
                        </div>}
                    
                        <div className={classes['hero-wrap__text']}>
                            {imageHeader && <h1>{imageHeader}</h1>}
                            {imageCtaUrl && <Link href={imageCtaUrl}>
                                <a className={classes['subheader-link']}>
                                    <span>{imageCtaText}</span>
                                    {isDesktop && mounted && <span>
                                        <IconLongArrow />
                                    </span>}
                                </a>
                            </Link>}
                            {imageCtaUrl && isMobile && mounted && <div className={classes['mbl-btn']}>
                                <Link href={imageCtaUrl}>
                                    <a className="btn sitkablue">
                                        {mobileButtonText}
                                    </a>
                                </Link>
                            </div>}
                        </div>
                    </div>
                </div>

               
                    {isMobile && mounted && articles.length > 0 &&
                        <div className={classes['slider']}>
                            <Swiper
                                loop={true}
                                slidesPerView={"auto"}
                                spaceBetween={18}
                                centeredSlides={true}
                            >
                            {articles.map((article) => {
                                return (
                                    <SwiperSlide className={classes['slider__slide']} key={`${article._type}-${article._id}`}>
                                        <RecipeArticleCard article={article} />
                                    </SwiperSlide>
                                )
                            })}
                            </Swiper>
                        </div>}

                    {isDesktop && mounted && articles.length > 0 &&
                        <div className={classes['slider']}>
                            {articles.map((article) => {
                                return (
                                    <div className={classes['slider__slide']} key={`${article._type}-${article._id}`}>
                                        <RecipeArticleCard article={article} />
                                    </div>
                                )
                            })}
                        </div>
                    }
            </div>
        </div>
       
    </div>
  )
}

export default HalfHeroHalfSlider