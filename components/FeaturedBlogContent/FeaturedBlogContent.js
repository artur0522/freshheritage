import React, { useState } from "react"
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'

import RecipeArticleCard  from "../RecipeArticleCard/RecipeArticleCard"

import "swiper/css"
import classes from './FeaturedBlogContent.module.scss'

const FeaturedBlogContent = ({ fields }) => {
  const { tabs, header, subheader, ctaUrl, ctaText } = fields
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' })
  const [selectedSwiper, setSelectedSwiper] = useState(tabs[0])

  const filterArticles = (tabName) => {
    const foundTab = tabs.find((tab) => { 
        return tab.tabName === tabName
    })
    setSelectedSwiper(foundTab)
  }

  return (
    <div className={`${classes['articles']}`}>
        <div className={`${classes['articles__content']}`}>
            <div className={`${classes['articles__header']}`}>
                {header && <h1>{header}</h1>}
                {subheader && <h2>{subheader}</h2>}
            </div>

            <div className={`${classes['articles__tabs-swiper']} ${classes['swiper-none']}`}>
                {tabs.map((tab) => {
                    return (
                        <div className={classes['tab-slide']} key={tab._key}>
                            <a className={`${tab.tabName ===  selectedSwiper.tabName ? classes['active'] : ""}`} onClick={() => filterArticles(tab.tabName)}>
                                <span>{tab.tabName}</span>
                            </a>
                        </div>
                    )
                })}
            </div>

            <Swiper
                loop={true}
                slidesPerView={"auto"}
                spaceBetween={10}
                className={`${classes['articles__tabs-swiper']} ${classes['has-swiper']}`}
                >
                {tabs.map((tab) => {
                    return (
                        <SwiperSlide className={classes['tab-slide']} key={tab.tabName}>
                            <a className={`${tab.tabName ===  selectedSwiper.tabName ? classes['active'] : ""}`} onClick={() => filterArticles(tab.tabName)}>
                                <span>{tab.tabName}</span>
                            </a>
                        </SwiperSlide>
                    )
                })}
            </Swiper> 
            
            <Swiper
                loop={true}
                slidesPerView={1.5}
                spaceBetween={18}
                breakpoints={{
                    768: {
                        slidesPerView: 4
                    }
                }}
                navigation={true}
                className={classes['articles__swiper']}
            >
                {selectedSwiper.tabList.map((article) => {
                    return (
                        <SwiperSlide key={article._id}>
                            <RecipeArticleCard article={article} />
                        </SwiperSlide>
                    )
                })}
            </Swiper>

            {ctaUrl && <Link href={`${ctaUrl}`}>
                    <a className={`${classes['articles__btn']} btn text-align--center no-underline`}>
                        {ctaText}
                    </a>
            </Link>}
        </div>
    </div>
  )
}

export default FeaturedBlogContent
