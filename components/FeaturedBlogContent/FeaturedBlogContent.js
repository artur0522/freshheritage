import React from 'react';
import Image from 'next/image';
import BgImage from "./blog-content-bg.png";

import classes from './FeaturedBlogContent.module.scss';

const FeaturedBlogContent = ({ fields }) => {
  return (
    <div className={`${classes['articles']}`}>
        <div className={classes['articles__image']}>
            <Image
                alt="Mountains"
                src={BgImage}
                layout="fill"
                objectFit="cover"
                quality={100}
            />
        </div>
        
        <div className={classes['articles__content']}>
            <div className={classes['articles__header']}>
                <h1>FRESH NEW recipes</h1>
                <h2>Explore delicious, seasonal recipes curated by our Culinary Director Grace Parisi, for this month’s seafood boxes</h2>
            </div>
            <div className={`${classes['articles__row']}`}>
            
            </div>
        </div>
    </div>
  );
};

export default FeaturedBlogContent;
