import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import ResponsiveImage from '@/components/ResponsiveImage'
import Link from 'next/link'
import IconPlayButtonTriangle from '@/svgs/play-button-triangle.svg'
import Video from '@/components/Video'

import classes from './FullBleedHero.module.scss'

const FullBleedHero = ({ fields, imagePriority }) => {
  const [mounted, setMounted] = useState(false)
  const [startVideo, setStartVideo] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' })
  const isLargeMobile = useMediaQuery({ query: '(max-width: 1439px)' })

  let { heroStyle, smallerText, textColor, desktopBackgroundImage, mobileBackgroundImage, imageBrightness, alt, youtubeVideoId, topMargin, bottomMargin, fixedImage } = fields

  const showVideo = () => {
    setStartVideo(true)
  }

  useEffect(() => {
    setMounted(true)
  }, [fields])

  let btnColor
  // Conditionally change the color of the button
  if (textColor === 'text--light') {
    btnColor = 'alabaster'
  } else {
    btnColor = 'salmon'
  }

  const imageInlineStyles = {
    'filter': `brightness(${imageBrightness ? imageBrightness : 100}%)`
  }

  return (
    <div className={`${classes['hero']} ${smallerText ? classes['hero--smaller-text'] : ''} ${classes[heroStyle]} ${heroStyle === 'hero--with-container' ? 'container' : ''} ${classes[textColor]} ${topMargin ? classes['top-margin'] : ''} ${bottomMargin ? classes['bottom-margin'] : ''} ${startVideo ? classes['hero--video-enabled'] : ''}`}>
      <div className={`${classes['hero__text']}`}>
        <div className={classes['hero__text-inner']}>
          {fields.header && <h1 className={`${heroStyle === 'hero--bottom' ? 'heading--catch' : ''}`}>{fields.header}</h1>}
          {fields.subheader && <h2>{fields.subheader}</h2>}

          <div className={classes['btn-wrap']}>
            <div className={classes['primary-btn-wrap']}>
              {fields.primaryCtaUrl && <Link href={`${fields.primaryCtaUrl}`}>
                <a className={`${classes['btn']} btn ${youtubeVideoId ? 'sitkablue' : btnColor} no-underline`}>
                  {fields.primaryCtaText}
                </a>
              </Link>}
              {youtubeVideoId && isDesktop && heroStyle !== 'hero--with-container' && <button onClick={() => showVideo()} className={`${classes['hero-video__action-btn']} btn ${btnColor}`}>
                <IconPlayButtonTriangle />
                <span>Play Video</span>
              </button>}
              {youtubeVideoId && !isLargeMobile && heroStyle === 'hero--with-container' && <button onClick={() => showVideo()} className={`${classes['hero-video__action-btn']} btn ${btnColor}`}>
                <IconPlayButtonTriangle />
                <span>Play Video</span>
              </button>}
            </div>
            {fields.secondaryCtaUrl && <Link href={`${fields.secondaryCtaUrl}`}>
              <a>{fields.secondaryCtaText}</a>
            </Link>}
          </div>
        </div>
      </div>

      <div className={classes['hero__main-wrap']}>
        {youtubeVideoId && isLargeMobile && heroStyle === 'hero--with-container' && <button onClick={() => showVideo()} className={`${classes['hero-video__action-btn']} btn ${btnColor}`}>
          <IconPlayButtonTriangle />
          <span>Play Video</span>
        </button>}
        {isMobile && mounted && mobileBackgroundImage && <div className={`${classes['hero__wrap']} ${fixedImage ? classes['hero__wrap--mbl'] : ''}`}>
          {fixedImage ?
            <Image className={classes.mbl__img} src={mobileBackgroundImage?.asset.url} layout="fill" priority={imagePriority} alt={alt} style={imageInlineStyles} /> :
            <ResponsiveImage className={classes.mbl__img} src={mobileBackgroundImage?.asset.url} priority={imagePriority} layout="fill" alt={alt} style={imageInlineStyles} />
          }
        </div>}

        {isDesktop && mounted && desktopBackgroundImage && <div className={`${classes['hero__wrap']} ${classes['hero__wrap--dsktp']}`}>
          {heroStyle === 'hero--center-transparent' ?
            <Image className={classes.mbl__img} src={desktopBackgroundImage?.asset.url} layout="fill" priority={imagePriority} alt={alt} style={imageInlineStyles} /> :
            <ResponsiveImage className={classes.mbl__img} src={desktopBackgroundImage?.asset.url} layout="fill" priority={imagePriority} alt={alt} style={imageInlineStyles} />
          }
        </div>}
      </div>


      {youtubeVideoId && <Video youtubeVideoId={youtubeVideoId} startVideo={startVideo} className={classes['hero-video__wrap']} />}

    </div>
  )
}

export default FullBleedHero
