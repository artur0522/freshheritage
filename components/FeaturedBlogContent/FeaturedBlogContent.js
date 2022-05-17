import React, { useRef, useState } from "react";
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image';
import Link from 'next/link';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

import "swiper/css";
import classes from './FeaturedBlogContent.module.scss';

const FeaturedBlogContent = ({ fields }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [selectedSwiper, setSelectedSwiper] = useState(fields.tabs[0]);

  const filterArticles = (tabName) => {
    const foundTab = fields.tabs.find((tab) => {
        return tab.tabName === tabName
    })
    setSelectedSwiper(foundTab);
  }
  
  return (
    <div className={`${classes['articles']}`}>
        <div className={`${classes['articles__content']} container`}>
            <div className={`${classes['articles__header']}`}>
                {fields.header && <h1>{fields.header}</h1>}
                {fields.subheader && <h2>{fields.subheader}</h2>}
            </div>

            {isMobile ? 
                <Swiper
                    loop={true}
                    slidesPerView={'auto'}
                    className={`${classes['articles__tabs--swiper']}`}
                    >
                    {fields.tabs.map((tab) => {
                        return (
                            <SwiperSlide className={classes['tab-slide']} key={tab.tabName}>
                                <a className={`${tab.tabName ===  selectedSwiper.tabName ? classes['active'] : ""}`} onClick={() => filterArticles(tab.tabName)}>
                                    <span>{tab.tabName}</span>
                                </a>
                            </SwiperSlide>
                        )
                    })}
                </Swiper> : 
                <div className={`${classes['articles__tabs--swiper']}`}>
                    {fields.tabs.map((tab) => {
                        return (
                            <div className={classes['tab-slide']} key={tab.tabName}>
                                <a className={`${tab.tabName ===  selectedSwiper.tabName ? classes['active'] : ""}`} onClick={() => filterArticles(tab.tabName)}>
                                    <span>{tab.tabName}</span>
                                </a>
                            </div>
                        )
                    })}
                </div>
            }

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
                        <SwiperSlide>
                            <div className={classes['article__card']}>
                                {article.heroImage.asset.url && <div className={classes['article__card--img']}>
                                    <Image
                                        src={article.heroImage.asset.url}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>}
                                <div className={classes['article__card--content']}>
                                    {article.heroSubheader && <span className="recipe--time">{article.heroSubheader}</span>}
                                    {article.heroHeader && <h1 className='heading--article'>{article.heroHeader}</h1>}
                                </div>
                            </div>
                        </SwiperSlide>
                    )
                })}
            </Swiper>

            {fields.ctaUrl && <Link href={`${fields.ctaUrl}`}>
                    <a className={`${classes['articles__btn']} btn text-align--center no-underline`}>
                    {fields.ctaText}
                    </a>
            </Link>}
        </div>
    </div>
  );
};

export default FeaturedBlogContent;
