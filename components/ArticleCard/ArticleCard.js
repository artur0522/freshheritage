import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import IconBullet from '@/svgs/list-item.svg'
import PlayIcon from '@/svgs/play.svg'

import classes from "./ArticleCard.module.scss"

const ArticleCard = ({ article, reverse }) => {
  const tags = article.hero?.articleTags
  const foundTag = tags?.find(tag => tag === 'video' || 'live cooking class')
  return (
    <Link href={`/${article.handle.current}`}>
        <a className={classes['article-card']}>
            <div className={`${classes['slider__slide']} ${reverse ? classes['row'] : ''}`}>
                {article.hero?.desktopBackgroundImage.asset.url && <div className={classes['image-wrap']}>
                    <Image  layout="fill" objectFit="cover" alt={article.title} src={article.hero.desktopBackgroundImage.asset.url} />
                    {foundTag && <div className={classes['play']}>
                        <PlayIcon />
                    </div>}
                </div>}
                <div className={classes['text']}>
                    {article.title && <h4 className='heading--article'>{article.title}</h4>}
                    {article.ctaText && <p className="recipe--time">
                        <span>
                            {article.ctaText}
                        </span>
                        <span className={classes['icon']}>
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