import React, { useState, useEffect, useRef, forwardRef } from 'react'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import Link from 'next/link'
import classes from './ArticleSplitHero.module.scss'
import IconClock from '@/svgs/clock.svg'
import IconChefHat from '@/svgs/chef-hat.svg'
import IconCutlery from '@/svgs/cutlery.svg'
import IconScale from '@/svgs/scale.svg'
import IconBullet from '@/svgs/list-item.svg'
import IconPlayButton from '@/svgs/play-button.svg'
import IconPlayButtonTriangle from '@/svgs/play-button-triangle.svg'
import ResponsiveImage from '@/components/ResponsiveImage'
import { useHeaderContext } from '@/context/HeaderContext'
import ArticleVideo from '../ArticleVideo'
import { useRouter } from 'next/router'
import ArticleCountdownTimer from './ArticleCountdownTimer'

/*
  Split Hero can be used for Article or Blog Listing Pages
  - needs fields from sanity
  - if listing page, render blog-listing style -> renderType
  - if article
    - if article recipe, render recipe style -> renderType
    - if not, render default style  -> renderType
  - if content is either brand or culinary to render unique background color & image -> blogType
  renderTypes:
    - blog-listing -> colored background with illustration image
    - recipe -> recipe content inside floating panel/box
    - default -> white background
    - cooking-guide -> same as default, but with sticky hero image/video
    - live-cooking-class -> same as default, but with a countdown timer
    - cooking-class -> same as default, but adds watch now button if valid
*/

const getBackNavigationInfo = (router) => {

  let urlPathArray = router.asPath.split('/').slice(0, -1)
  const goBackUrl = urlPathArray.join('/')
  const goBackTitle = urlPathArray[urlPathArray.length - 1].replace(/-/g, ' ')

  return {
    url: goBackUrl,
    title: goBackTitle
  }
}

const ArticleSplitHero = forwardRef(({fields, renderType = 'default', blogGlobalSettings }, mainContentRef) => {
  const [mounted, setMounted] = useState(false)
  const [startVideo, setStartVideo] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 1073px)' })
  const isDesktop = useMediaQuery(
    {query: '(min-width: 1074px)'}
  )
  const { headerRef } = useHeaderContext()
  const router = useRouter()
  const goBackNavigationSettings = getBackNavigationInfo(router)

  const {prepTime, ctaText, ctaUrl, desktopBackgroundImage, mobileBackgroundImage, difficulty, header, subheader, servings, tags, cookTime, youtubeVideoId, classStartDate, classEndDate } = fields

  const hasVideo = youtubeVideoId ? true : false
  const heroImageRef = useRef()

  /* Cooking Guide Articles will have a sticky hero video if available */
  const getStickyPosition = () => {
    if (!mainContentRef) {
      return false;
    }
    const mainContentRefBottomPos = mainContentRef.current.offsetHeight + mainContentRef.current.offsetTop
    const headerRefIsVisible = (headerRef.current.getBoundingClientRect().top >= 0 || window.pageYOffset === 0) ? true : false
    if (renderType === 'cooking-guide' && hasVideo) {
      if (window !== undefined && (window.scrollY + window.innerHeight) > mainContentRefBottomPos) {
        heroImageRef.current.style.top = `${mainContentRefBottomPos - heroImageRef.current.offsetHeight}px`
        heroImageRef.current.style.position = 'absolute'
      } else {
        heroImageRef.current.style.top = !headerRefIsVisible ? 0 : headerRef.current?.offsetHeight + 'px'
        heroImageRef.current.style.position = 'fixed'
      }
      heroImageRef.current.style.height = `${ !headerRefIsVisible ? '100%' : 'calc(100% - ' + headerRef.current?.offsetHeight + 'px)'}`
    }
  }

  useEffect(() => {
    setMounted(true)
    getStickyPosition()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', getStickyPosition)
    return () => {
      window.removeEventListener('scroll', getStickyPosition)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!blogGlobalSettings) {
    return ''
  }

  const showVideo = () => {
    setStartVideo(true)
  }

  const backgroundColorClass = `article-hero--${blogGlobalSettings.backgroundColor}-bg-color`
  const backgroundIllustrationImage = blogGlobalSettings.illustrationImage
  const renderTypeClass = `article-hero--render-type-${renderType}`

  return (
    <div className={`${classes['article-hero']} ${classes[renderTypeClass]} ${classes[backgroundColorClass]} ${renderType === 'blog-listing' && blogGlobalSettings.blogType === 'brand' ? classes['article-hero--white-color-text'] : ''}`}>
      <div className={classes['article-hero__content']}>

        {backgroundIllustrationImage && renderType === 'blog-listing' && isDesktop && mounted &&
          <div className={classes['article-hero__illustration-image']}>
            <ResponsiveImage
              src={backgroundIllustrationImage.asset.url}
              layout="fill"
              alt={backgroundIllustrationImage.asset.alt || ''}
            />
          </div>
        }

        <div className={classes['article-hero__content-inner']}>
          <div className={classes['article-hero__navigation']}>
            {goBackNavigationSettings.url && <Link href={goBackNavigationSettings.url}>
              <a><IconBullet /> <span>Back to all {goBackNavigationSettings.title}</span></a>
            </Link>}
          </div>
          {renderType === 'live-cooking-class' ? (
            <h1 className={classes['article-hero__heading']}>Live Cooking Class</h1>
          ):(
            <h1 className={classes['article-hero__heading']}>{header}</h1>
          )}
          {subheader && <h2 className={classes['article-hero__subheading']}>{subheader}</h2>}

          {classStartDate && classEndDate && <ArticleCountdownTimer classStartDate={classStartDate} classEndDate={classEndDate} classes={classes} />}

          {renderType === 'cooking-class' && youtubeVideoId && <div>
            <button onClick={() => showVideo()} className={`${classes['article-hero__action-btn']} btn salmon`}>
              <IconPlayButtonTriangle />
              <span>Watch Now</span>
            </button>
          </div>}

          {tags && <ul className={classes['article-hero__tags']}>
            {tags.map((tag, index) => {
              return <li className={classes['article-hero__tag']} key={index}>{tag.value}</li>
            })}
          </ul>}

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

      <div className={classes['article-hero__image-wrapper']} ref={heroImageRef}>
        {!startVideo && <div className={classes['article-hero__image']}>
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
          {youtubeVideoId &&
            <button
              className={classes['article-hero__play-btn']}
              onClick={() => showVideo()}><IconPlayButton /></button>
          }
        </div>}
        {youtubeVideoId && <ArticleVideo youtubeVideoId={youtubeVideoId} startVideo={startVideo} className={classes['article-hero__video']} />}
      </div>

    </div>
  )
})

export default ArticleSplitHero