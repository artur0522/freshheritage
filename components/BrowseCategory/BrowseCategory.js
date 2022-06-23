import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import IconArrow from '@/svgs/arrow-right.svg'

import classes from "./BrowseCategory.module.scss"
import "swiper/css"

const BrowseCategory = ({fields}) => {
  const {header, mobileCta, mobileUrl, categoriesList} = fields
  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 1073px)' })
  const isDesktop = useMediaQuery({ query: '(min-width: 1074px)' })

    useEffect(() => {
        setMounted(true)
    }, [])

  return (
    <div className={classes['browse']}>
        <div className="container">
            <div className={classes['header']}>
                {header && <h1>{header}</h1>}

                {mobileUrl && isMobile && <div className={classes['header-link']}>
                    <Link href={mobileUrl}>
                        <a>{mobileCta}</a>
                    </Link>
                    <IconArrow />
                </div>}

                {isDesktop && <div className={classes['header-search']}>
                    <button>
                        
                    </button>
                   <input type="text" />
                </div>}
            </div>
            {categoriesList.length > 0 && mounted &&
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
                        {categoriesList.map((category) => {
                            return (
                                <SwiperSlide className={classes['slider__slide']}>
                                    <div className={classes['image-wrap']}>
                                        <Image width={438} height={600} alt={category.alt} src={category.image.asset.url} />
                                    </div>
                                    <div className={classes['text']}>
                                        <h1>{category.header}</h1>
                                        <div className={classes['btn-wrap']}>
                                            <Link href={category.ctaUrl}>
                                                <a className="btn alabaster">{category.ctaText}</a>
                                            </Link>
                                        </div>
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

export default BrowseCategory
