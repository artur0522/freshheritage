import Image from 'next/image'
import Link from 'next/link'
import IconArrow from '@/svgs/arrow-right.svg'
import IconPlay from '@/svgs/play.svg'

import classes from "./HalfVideoBlock.module.scss"

const HalfVideoBlock = ({fields}) => {
  const {header, subheader, ctaText, ctaUrl, recipeArticle, reverse} = fields

  return (
    <div className={classes['wrapper']}>
        <div className="container">
            <div className={`${classes['row']} ${reverse ? classes['reverse'] : ''}`}>
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
                    {recipeArticle.hero.desktopBackgroundImage?.asset?.url && <div className={classes['article__image']}>
                        <Image
                            src={recipeArticle.hero.desktopBackgroundImage.asset.url}
                            layout="fill"
                            objectFit="cover"
                            alt={recipeArticle.title}
                        />
                    </div>}
                    <div className={classes['article__text']}>
                        {recipeArticle.title && <h4>{recipeArticle.title}</h4>}
                        {recipeArticle.subheader && <p>{recipeArticle.subheader}</p>}
                        {recipeArticle.handle && <div className={classes['btn']}>
                            <Link href={`/${recipeArticle.handle.current}`}>
                                <a className="btn sitkablue">
                                    <span className={classes['play-icon']}><IconPlay /></span>
                                    <span>Watch Video</span>
                                </a>
                            </Link>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default HalfVideoBlock