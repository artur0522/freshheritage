import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import IconBullet from '@/svgs/list-item.svg'
import ArrowIcon from '@/svgs/long-arrow-right.svg'
import PlayIcon from '@/svgs/play.svg'
import IconPlayButton from '@/svgs/play-button.svg'

import imageUrlBuilder from '@sanity/image-url'
import sanityClient from 'services/sanityClient'
import ResponsiveImage from '@/components/ResponsiveImage'

import classes from "./ArticleCard.module.scss"

const ArticleCard = ({ article, reverse, responsiveImage = false, fromSearch = false }) => {
    const tags = article.fields ? article.fields?.hero?.articleTags : article.hero?.articleTags
    const foundTag = tags?.find(tag => tag.value === 'video' || tag.value === 'live cooking class')
    const { desktopBackgroundImage } = article.fields ? article.fields.hero : article.hero
    const { articleCardCtaText } = article.fields ? article.fields : {}

    const builder = imageUrlBuilder(sanityClient)

    function urlFor(source) {
        return builder.image(source)
    }

    const articleHandle = article.handle?.current ? article.handle.current : article.handle;
    const blog = article.fields ? article.fields.blog : article.blog

    let url = `/${articleHandle}`

    let hasVideo = false;

    if (blog) {
        const blogType = blog.blogType
        const blogCategory = blog.handle?.current ? blog.handle.current : blog.handle
        url = `/blogs/${blogType}/${blogCategory}/${articleHandle}`

        if (blogCategory === 'video-series' || blogCategory === 'live-cooking-class') {
            hasVideo = true
        }
    }

    return (
        <Link href={url}>
            <a className={`${classes['article-card']} ${!responsiveImage ? classes['fixed'] : ''}`}>
                <div className={`${classes['slider__slide']} ${reverse ? classes['row'] : ''}`}>
                    {desktopBackgroundImage?.asset?.url && <div className={classes['image-wrap']}>
                        {responsiveImage &&  !desktopBackgroundImage?.crop && <ResponsiveImage alt={article.title} src={desktopBackgroundImage.asset.url} />}
                        {responsiveImage && desktopBackgroundImage?.crop && <ResponsiveImage alt={article.title} src={urlFor(desktopBackgroundImage.asset.url).width(345).height(384).focalPoint(desktopBackgroundImage.hotspot.x, desktopBackgroundImage.hotspot.y).crop('focalpoint').fit('crop').url()} />}
                        {!responsiveImage && <Image src={desktopBackgroundImage?.asset.url} alt={article.title} layout="fill" objectFit="cover" />}

                        {hasVideo && <div className={classes['play']}>
                            <IconPlayButton />
                        </div>}
                    </div>}

                    <div className={classes['text']}>
                        {article.title && <h4 className='heading--article'>{article.title}</h4>}
                        {articleCardCtaText && !fromSearch && <p className="recipe--time">
                            <span>
                                {articleCardCtaText}
                            </span>
                            <span className={classes['icon']}>
                                <IconBullet />
                            </span>
                        </p>}
                        {fromSearch &&
                        <Link href={`/blogs/${article.blog.blogType}/${article.blog.handle.current}/${article.handle.current}`}>
                            <a className={`${classes['search-cta']} secondary--body`}>
                                Read Article
                                <IconBullet />
                            </a>
                        </Link>}
                    </div>
                </div>
            </a>
        </Link>
    )
}

export default ArticleCard