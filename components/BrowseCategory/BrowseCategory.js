import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import Link from 'next/link'
import CategoryCard from '../CategoryCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import IconArrow from '@/svgs/arrow-right.svg'
import IconSearch from '@/svgs/search.svg'

import classes from "./BrowseCategory.module.scss"
import "swiper/css"

const BrowseCategory = ({fields}) => {
  const {header, mobileCta, mobileUrl, categoriesList} = fields
  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 1073px)' })
  const isDesktop = useMediaQuery({ query: '(min-width: 1074px)' })

    useEffect(() => {
        setMounted(true)
    }, [fields])

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

                {isDesktop && mounted && <div className={classes['header-search']}>
                    <form>
                        <button type="button">
                            <IconSearch />
                        </button>
                    <input type="text" placeholder='Search' className="secondary--body" />
                   </form>
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
                                <SwiperSlide key={category._key}>
                                    <CategoryCard category={category} />
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
