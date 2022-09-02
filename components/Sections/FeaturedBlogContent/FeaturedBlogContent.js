import React, { useEffect, useState } from 'react'
import { nacelleClient } from 'services'
import Image from 'next/image'
import ResponsiveImage from '@/components/ResponsiveImage'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from "swiper"
import { GET_RECENT_ARTICLES } from '@/gql/index.js'

import DynamicArticleCard from '@/components/Cards/DynamicArticleCard'

import 'swiper/css'
import classes from './FeaturedBlogContent.module.scss'

const FeaturedBlogContent = ({ fields }) => {
  const { tabs, header, subheader, ctaUrl, ctaText, illustration, illustration2, illustrationAlt, illustration2Alt, method, blog, tagList, articleType } = fields
  const [selectedSwiper, setSelectedSwiper] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [validArticles, setValidArticles] = useState([])

  const getArticles = async ({fieldTags = [], articleHandles, forceTagBased = false}) => {
    if (method === 'tagBased' || forceTagBased || method === 'mostRecent') {
      // const articles = await nacelleClient.content({
      //   type: `${articleType}`,
      //   maxReturnedEntries: 50
      // })

      const articles = await nacelleClient.query({
        query: GET_RECENT_ARTICLES,
        variables: {
          "type": articleType,
          "first": 200
        }
      })

      console.log("articles:", articles)

      // console.log("articles:", articles)
      // const filteredArr = articles.filter(article => article.fields.published)
      //   .filter((article) => {
      //     if (fieldTags.length && method !== 'mostRecent') {
      //       return (
      //         article.fields?.blog?.blogType === blog?.blogType &&
      //         article.fields?.articleTags?.find((tag) => fieldTags.includes(tag.value))
      //       )
      //     }
      //     return article.fields?.blog?.blogType === blog?.blogType
      //   })
      //   .slice(0, 4)

      // return filteredArr
    } else {

      if (!articleHandles) {
        return []
      }

      const articles = await nacelleClient.content({
        handles: articleHandles
      })

      return articles.filter(article => article.fields.published)
    }
  }

  useEffect(() => {
    setMounted(true)
    if (method === 'tagBased' || method === 'mostRecent') {
      getArticles({fieldTags: tagList})
        .then(articles => {
          setValidArticles(articles)
        })
    } else {

      const options = {
        articleHandles: tabs[0].tabList,
        fieldTags: tabs[0].tagList
      }

      if (tabs[0].tagList?.length) {
        options.forceTagBased = true
      }

      getArticles(options)
        .then(articles => {
          setSelectedSwiper({
            ...tabs[0],
            tabList: articles
          })
        })
    }
  }, [])

  const filterArticles = (tabName) => {
    const foundTab = tabs.find((tab) => {
      return tab.tabName === tabName
    })

    const options = {
      articleHandles: foundTab.tabList,
      fieldTags: foundTab.tagList
    }

    if (foundTab.tagList?.length) {
      options.forceTagBased = true
    }

    getArticles(options)
      .then(articles => {
        setSelectedSwiper({
          ...foundTab,
          tabList: articles
        })
      })

  }

  return (
    <div className={`${classes['articles']}`}>
      {illustration && (
        <div className={classes['illustration-1']}>
          <ResponsiveImage
            src={illustration.asset.url}
            alt={illustrationAlt}
          />
        </div>
      )}
      {illustration2 && (
        <div className={classes['illustration-2']}>
          <ResponsiveImage
            src={illustration2.asset.url}
            alt={illustration2Alt}
          />
        </div>
      )}
      <div className={`${classes['articles__content']}`}>
        <div className={`${classes['articles__header']}`}>
          {header && <h1>{header}</h1>}
          {subheader && <h2>{subheader}</h2>}
        </div>

        {!!selectedSwiper && tabs.length > 1 && method !== 'tagBased' && (
          <Swiper
            slidesPerView={'auto'}
            spaceBetween={40}
            threshold={15}
            modules={[FreeMode]}
            className={`${classes['articles__tabs-swiper']} ${classes['has-swiper']}`}
          >
            {tabs.map((tab) => {
              return (
                <SwiperSlide className={classes['tab-slide']} key={tab.tabName}>
                  <a
                    className={`${
                      tab.tabName === selectedSwiper.tabName
                        ? classes['active']
                        : ''
                    }`}
                    onClick={() => filterArticles(tab.tabName)}
                  >
                    <span>{tab.tabName}</span>
                  </a>
                </SwiperSlide>
              )
            })}
          </Swiper>
        )}

        {mounted && (method === 'tagBased' || method === 'mostRecent') && (
          <Swiper
            slidesPerView={'auto'}
            spaceBetween={18}
            threshold={15}
            navigation={false}
            className={`${classes['articles__swiper']}`}
            breakpoints={{
              1920: {
                slidesPerView: 4,
              },
            }}
          >
            {validArticles.map((article) => {
              return (
                <SwiperSlide
                  className={classes['article-slide']}
                  key={`${article._type}-${article._id}`}
                >
                  <DynamicArticleCard article={article} />
                </SwiperSlide>
              )
            })}
          </Swiper>
        )}

        {!!selectedSwiper && mounted && method !== 'tagBased' && (
          <Swiper
            slidesPerView={'auto'}
            spaceBetween={18}
            threshold={15}
            navigation={false}
            className={`${classes['articles__swiper']} ${
              classes[tabs.length > 1 ? 'border-top' : '']
            }`}
            breakpoints={{
              1920: {
                slidesPerView: 4,
              },
            }}
          >
            {selectedSwiper.tabList.map((article) => {
              return (
                <SwiperSlide
                  className={classes['article-slide']}
                  key={`${article._type}-${article._id}`}
                >
                  <DynamicArticleCard article={article} />
                </SwiperSlide>
              )
            })}
          </Swiper>
        )}

        {ctaUrl && (
          <Link href={`${ctaUrl}`}>
            <a
              className={`${classes['articles__btn']} btn text-align--center no-underline`}
            >
              {ctaText}
            </a>
          </Link>
        )}
      </div>
    </div>
  )
}

export default FeaturedBlogContent
