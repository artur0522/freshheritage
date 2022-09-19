import React, { useState, useEffect } from 'react'
import ResponsiveImage from '@/components/ResponsiveImage'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import DynamicArticleCard from '@/components/Cards/DynamicArticleCard'
import IconArrow from '@/svgs/arrow-right.svg'
import { nacelleClient } from 'services'

import classes from "./ArticleRow.module.scss"
import "swiper/css"

const ArticleRow = ({ fields, enableSlider = true }) => {

  const {header, featuredArticles, ctaText, ctaUrl, articles: articleHandles, _key, reverseCard, illustration, illustrationAlt, illustration2, illustration2Alt, greenBackground,  topMargin, bottomMargin} = fields
  const [mounted, setMounted] = useState(false)
  const [articles, setArticles] = useState([])
    useEffect(() => {
        setMounted(true)
    }, [fields])

    useEffect(() => {

        const getArticles = async () => {
            const articles = await nacelleClient.content({
                handles: articleHandles
            })
            return articles.filter(article => article.fields.published)
        }

        if (articleHandles?.length > 0) {
            getArticles()
                .then(res => {
                    setArticles(res)
                })
        }

    }, [])

    if (!articles.length) {
        return ''
    }

  return (
    <div className={`article-row ${classes['articles']} ${reverseCard ? classes['reverse'] : ''} ${featuredArticles ? 'featured-articles' : ''} ${greenBackground ? classes['green-bg'] : ""} ${topMargin ? classes['top-margin'] : ''} ${bottomMargin ? classes['bottom-margin'] : ''}`}>
        {illustration && <div className={classes['illustration-1']}>
            <ResponsiveImage
                src={illustration.asset.url}
                alt={illustrationAlt || "illustration"}
            />
        </div>}
        {illustration2 && <div className={classes['illustration-2']}>
            <ResponsiveImage
                src={illustration2.asset.url}
                alt={illustration2Alt || "illustration"}
            />
        </div>}

        <div className={classes['article-row-content']}>
            <div className={`${classes['header']} container ${featuredArticles ? 'container--no-max-width' : ''}`}>
                {header && <h1>{header}</h1>}
                {ctaUrl && <div className={`${classes['header-link']} secondary--body`}>
                    <Link href={ctaUrl}>
                        <a>{ctaText}</a>
                    </Link>
                    <IconArrow />
                </div>}
            </div>
            {articles?.length > 0 && mounted && enableSlider &&
                <div className={`${classes['slider']} ${featuredArticles ? '' : 'container'}`}>
                    <Swiper
                        slidesPerView={'auto'}
                        spaceBetween={15}
                        threshold={15}
                        breakpoints={{
                            1074: {
                                spaceBetween: 36
                            }
                        }}
                        >
                        {articles.map((article, index) => {
                            // if handle doesn't exist, you're probably on the same page of the article you are referencing
                            if (!article.handle) {
                                return ''
                            }

                            return (
                                <SwiperSlide className={classes['article-slide']} key={`${article._id}-${_key}-${index}`}>
                                    <DynamicArticleCard article={article} reverse={reverseCard} />
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>
            }
            {articles?.length > 0 && mounted && !enableSlider &&
                <div className={`${classes['article-list']} ${featuredArticles ? '' : 'container'}`}>
                    {articles.map((article, index) => {
                        // if handle doesn't exist, you're probably on the same page of the article you are referencing
                        if (!article.handle) {
                            return ''
                        }

                        return (
                            <li className={classes['article-slide']} key={`${article._id}-${_key}-${index}`}>
                                <DynamicArticleCard article={article} reverse={reverseCard} />
                            </li>
                        )
                    })}
                </div>
            }
        </div>


    </div>
  )
}

export default ArticleRow