import React, { useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';

import "swiper/css";
import BookmarkIcon from '@/svgs/bookmark.svg'
import classes from './RecipeArticleCard.module.scss';

const RecipeArticleCard = ({ article }) => {
  return (
    <Link href={`${article.handle.current}`} passHref>
        <div className={classes['article__card']}>
            {article.heroImage.asset.url && <div className={classes['article__card-img']}>
                {/* TODO: Add image alt */}
                <Image
                    src={article.heroImage.asset.url}
                    layout="fill"
                    objectFit="cover"
                    alt=""
                />
                <div className={classes['bookmark']}>
                    <BookmarkIcon />
                </div>
            </div>}
            <div className={classes['article__card-content']}>
                {article.heroSubheader && <span className="recipe--time">{article.heroSubheader}</span>}
                {article.heroHeader && <h1 className='heading--article'>{article.heroHeader}</h1>}
            </div>
        </div>
    </Link>
  );
};

export default RecipeArticleCard;
