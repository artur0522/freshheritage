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

const ArticleHero = ({fields}) => {
  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const isDesktop = useMediaQuery(
    {query: '(min-width: 768px)'}
  )

  const {activeTime, ctaText, ctaUrl, desktopBackgroundImage, mobileBackgroundImage, difficulty, header, servings, tags, totalTime } = fields

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
            {activeTime &&
              <li>
                <IconClock />
                <div><b>Active Time:</b><span>{activeTime}</span></div>
              </li>
            }
            {totalTime &&
              <li>
                <IconChefHat />
                <div><b>Total Time:</b><span>{totalTime}</span></div>
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
        {isMobile && mounted &&
          <Image
            src={mobileBackgroundImage.asset.url}
            layout="fill"
            alt={mobileBackgroundImage.asset.alt || ''}
          />}
        {isDesktop && mounted &&
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