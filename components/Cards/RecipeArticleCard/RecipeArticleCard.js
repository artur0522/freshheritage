import React, { useState } from "react";
import Image from 'next/image';
import Link from 'next/link';

import "swiper/css";
import BookmarkIcon from '@/svgs/bookmark.svg'
import classes from './RecipeArticleCard.module.scss';

const RecipeArticleCard = ({ article }) => {
    const { desktopBackgroundImage, prepTime, cookTime } = article.fields ? article.fields.hero : article.hero

    return (
        <Link href={`${article.handle.current}`} passHref>
            <div className={classes['article__card']}>
                {desktopBackgroundImage.asset.url && <div className={classes['article__card-img']}>
                    <Image
                        src={desktopBackgroundImage.asset.url}
                        layout="fill"
                        objectFit="cover"
                        alt={article.title}
                    />
                    <div className={classes['bookmark']}>
                        <BookmarkIcon />
                    </div>
                </div>}

                <div className={classes['article__card-content']}>
                    {prepTime && <span className="recipe--time">{prepTime} &#8226; {cookTime}</span>}
                    {article.title && <h4 className='heading--article'>{article.title}</h4>}
                </div>
            </div>
        </Link>
    );
};

export default RecipeArticleCard;
