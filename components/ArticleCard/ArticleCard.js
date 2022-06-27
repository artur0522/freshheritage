import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import IconBullet from '@/svgs/list-item.svg'

import classes from "./ArticleCard.module.scss"

const ArticleCard = ({ article, reverse }) => {
  return (
    <Link href={`/${article.handle.current}`}>
        <a className={classes['article-card']}>
            <div className={`${classes['slider__slide']} ${reverse ? classes['row'] : null}`}>
                {article.heroImage && <div className={classes['image-wrap']}>
                    <Image width={438} height={600} alt={article.alt} src={article.heroImage.asset.url} />
                </div>}
                <div className={classes['text']}>
                    {article.heroHeader && <h4>{article.heroHeader}</h4>}
                    {article.heroSubheader && <p>
                        <span>
                            {article.heroSubheader}
                        </span>
                        <span>
                            <IconBullet />
                        </span>
                    </p>}
                </div>
            </div>
        </a>
    </Link>
  )
}

export default ArticleCard