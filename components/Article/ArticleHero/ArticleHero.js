import React, { useState, useEffect } from 'react'
import { PortableText } from '@portabletext/react'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import Link from 'next/link'
import classes from './ArticleHero.module.scss'
import IconClock from '@/svgs/clock.svg'
import IconChefHat from '@/svgs/chef-hat.svg'
import IconCutlery from '@/svgs/cutlery.svg'
import IconScale from '@/svgs/scale.svg'
import ResponsiveImage from '@/components/ResponsiveImage'

const ArticleHero = ({fields}) => {
  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 1073px)' })
  const isDesktop = useMediaQuery(
    {query: '(min-width: 1074px)'}
  )

  const {prepTime, ctaText, ctaUrl, desktopBackgroundImage, mobileBackgroundImage, difficulty, header, servings, tags, cookTime } = fields

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={classes['article-hero']}>
      <div className={classes['article-hero__content']}>
        <div className={classes['article-hero__content-inner']}>
          <div className={classes['article-hero__navigation']}></div>
          <h4 className={classes['article-hero__heading']}>{header}</h4>
          <ul className={classes['article-hero__tags']}>
            {tags.map((tag, index) => {
              return <li className={classes['article-hero__tag']} key={index}>{tag}</li>
            })}
          </ul>
          <ul className={classes['recipe-meta-details']}>
            {prepTime &&
              <li>
                <IconClock />
                <div><b>Prep Time:</b><span>{prepTime}</span></div>
              </li>
            }
            {cookTime &&
              <li>
                <IconChefHat />
                <div><b>Cook Time:</b><span>{cookTime}</span></div>
              </li>
            }
            {servings &&
              <li>
                <IconCutlery />
                <div><b>Servings:</b><span>{servings}</span></div>
              </li>
            }
            {difficulty &&
              <li>
                <IconScale />
                <div><b>Difficulty:</b><span>{difficulty}</span></div>
              </li>
            }
          </ul>
          {ctaText && ctaUrl &&
            <Link href={ctaUrl}>
              <a className={`${classes['article-hero__cta']} btn-link-underline`}>{ctaText}</a>
            </Link>
          }
        </div>
      </div>
      <div className={classes['article-hero__image']}>
        {mobileBackgroundImage && isMobile && mounted &&
          <ResponsiveImage
            src={mobileBackgroundImage.asset.url}
            layout="fill"
            alt={mobileBackgroundImage.asset.alt || ''}
          />}
        {desktopBackgroundImage && isDesktop && mounted &&
          <Image
            src={desktopBackgroundImage.asset.url}
            layout="fill"
            alt={desktopBackgroundImage.asset.alt || ''}
          />
        }
      </div>
    </div>
  )
}

export default ArticleHero