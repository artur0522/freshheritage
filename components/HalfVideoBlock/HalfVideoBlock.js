import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import Link from 'next/link'
import IconArrow from '@/svgs/arrow-right.svg'

import classes from "./HalfVideoBlock.module.scss"

const HalfVideoBlock = ({fields}) => {
    const {header, subheader, ctaText, ctaUrl, article, imageAlign} = fields
  console.log('halfvideo', fields)
  return (
    <div className={classes['wrapper']}>
        <div className="container">
            <div className={classes['row']}>
                <div className={classes['text']}>
                    {header && <h1>{header}</h1>}
                    {subheader && <h2>{subheader}</h2>}
                    {ctaUrl && <Link href={ctaUrl}>
                        <a className="flex">
                            <span>{ctaText}</span>
                            <span className={classes['arrow']}><IconArrow /></span>
                        </a>
                    </Link>}
                </div>
                <div className={classes['article']}>
                    <div className={classes['article__image']}>
                        <Image
                            src={article.heroImage.asset.url}
                            layout="fill"
                            objectFit="cover"
                            alt={article.alt}
                        />
                    </div>
                    <div className={classes['article__text']}>
                        {article.heroHeader && <h4>{article.heroHeader}</h4>}
                        {article.heroSubheader && <p>{article.heroSubheader}</p>}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default HalfVideoBlock