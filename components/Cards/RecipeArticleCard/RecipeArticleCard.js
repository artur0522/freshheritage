import React, { useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';

import "swiper/css";
import BookmarkIcon from '@/svgs/bookmark.svg'
import classes from './RecipeArticleCard.module.scss';

const RecipeArticleCard = ({ article }) => {
  console.log("article", article)

    return (
        <Link href={`${article.handle.current}`} passHref>
            <div className={classes['article__card']}>
                {article.fields.hero?.desktopBackgroundImage.asset.url && <div className={classes['article__card-img']}>
                    <Image
                        src={article.fields.hero?.desktopBackgroundImage.asset.url}
                        layout="fill"
                        objectFit="cover"
                        alt={article.title}
                    />
                    <div className={classes['bookmark']}>
                        <BookmarkIcon />
                    </div>
                </div>}

                {article.hero?.desktopBackgroundImage.asset.url && <div className={classes['article__card-img']}>
                    <Image
                        src={article.hero?.desktopBackgroundImage.asset.url}
                        layout="fill"
                        objectFit="cover"
                        alt={article.title}
                    />
                    <div className={classes['bookmark']}>
                        <BookmarkIcon />
                    </div>
                </div>}

                <div className={classes['article__card-content']}>
                    {article.fields.hero?.prepTime && <span className="recipe--time">{article.fields.hero?.prepTime} &#8226; {article.fields.hero?.cookTime}</span>}
                    {article.hero?.prepTime && <span className="recipe--time">{article.hero?.prepTime} &#8226; {article.hero?.cookTime}</span>}
                    
                    {article.title && <h4 className='heading--article'>{article.title}</h4>}
                </div>
            </div>
        </Link>
    );
};

export default RecipeArticleCard;
