import React, { useState } from "react"
import Image from 'next/image'
import Link from 'next/link'

import ResponsiveImage from '@/components/ResponsiveImage'

import "swiper/css"
import BookmarkIcon from '@/svgs/bookmark.svg'
import classes from './RecipeArticleCard.module.scss'

const RecipeArticleCard = ({ article, responsiveImage = false }) => {
    const { desktopBackgroundImage, activeTime, cookTime } = article.fields ? article.fields.hero : article.hero

    const articleHandle = article.handle?.current ? article.handle.current : article.handle;
    const blog = article.fields ? article.fields.blog : article.blog

    let url = `/${articleHandle}`

    if (blog) {
        const blogType = blog.blogType
        const blogCategory = blog.handle?.current ? blog.handle.current : blog.handle
        url = `/blogs/${blogType}/${blogCategory}/${articleHandle}`
    }

    return (
        <Link href={url} passHref>
            <div className={`${classes['article__card']} ${!responsiveImage ? classes['fixed'] : ''}`}>
                    {desktopBackgroundImage.asset.url && !desktopBackgroundImage?.crop && <div className={classes['article__card-img']}>

                    {responsiveImage && <ResponsiveImage
                        src={desktopBackgroundImage.asset.url}
                        alt={article.title}
                    />}

                    {responsiveImage && desktopBackgroundImage?.crop && <ResponsiveImage alt={article.title} src={urlFor(desktopBackgroundImage.asset.url).width(345).height(384).focalPoint(desktopBackgroundImage.hotspot.x, desktopBackgroundImage.hotspot.y).crop('focalpoint').fit('crop').url()} />}
                    
                    {desktopBackgroundImage.asset.url && !responsive && <Image
                        src={desktopBackgroundImage.asset.url}
                        alt={article.title}
                        layout="fill"
                        objectFit="cover"
                    />}
                    {/* <div className={classes['bookmark']}>
                        <BookmarkIcon />
                    </div> */}
                </div>}

                <div className={classes['article__card-content']}>
                    {activeTime && <span className="recipe--time">{activeTime} active time &#8226; {cookTime} cook time</span>}
                    {article.title && <h4 className='heading--article'>{article.title}</h4>}
                </div>
            </div>
        </Link>
    )
}

export default RecipeArticleCard