import React, { useState } from "react"
import Image from 'next/image'
import Link from 'next/link'

import ResponsiveImage from '@/components/ResponsiveImage'

import "swiper/css"
import BookmarkIcon from '@/svgs/bookmark.svg'
import classes from './RecipeArticleCard.module.scss'

const RecipeArticleCard = ({ article, responsiveImage = false }) => {
    const { desktopBackgroundImage, prepTime, cookTime } = article.fields ? article.fields.hero : article.hero

    return (
        <Link href={`${article.handle.current}`} passHref>
            <div className={`${classes['article__card']} ${!responsiveImage ? classes['fixed'] : ''}`}>
                {desktopBackgroundImage.asset.url && <div className={classes['article__card-img']}>
                    {responsiveImage ? <ResponsiveImage
                        src={desktopBackgroundImage.asset.url}
                        alt={article.title}
                    /> : 
                    <Image
                        src={desktopBackgroundImage.asset.url}
                        alt={article.title}
                        layout="fill" 
                        objectFit="cover"
                    />
                    }
                    <div className={classes['bookmark']}>
                        <BookmarkIcon />
                    </div>
                </div>}

                <div className={classes['article__card-content']}>
                    {prepTime && <span className="recipe--time">{prepTime} prep time &#8226; {cookTime} cook time</span>}
                    {article.title && <h4 className='heading--article'>{article.title}</h4>}
                </div>
            </div>
        </Link>
    )
}

export default RecipeArticleCard