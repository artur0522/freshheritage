import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import ResponsiveImage from '@/components/ResponsiveImage'
import Link from 'next/link'
import IconPlayButtonTriangle from '@/svgs/play-button-triangle.svg'
import Video from '@/components/Video'

import classes from './FullBleedHero.module.scss'

const FullBleedHero = ({ fields }) => {
  const [mounted, setMounted] = useState(false)
  const [startVideo, setStartVideo] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' })

  let { heroStyle, textColor, desktopBackgroundImage, mobileBackgroundImage, alt, youtubeVideoId, topMargin, bottomMargin } = fields

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

  return (
    <div className={`${classes['hero']} ${classes[heroStyle]} ${classes[textColor]} ${topMargin ? classes['top-margin'] : ''} ${bottomMargin ? classes['bottom-margin'] : ''} ${startVideo ? classes['hero--video-enabled'] : ''}`}>
      <div className={`${classes['hero__text']}`}>
        <div className={classes['hero__text-inner']}>
          {fields.header && <h1 className={`${heroStyle === 'hero--bottom' ? 'heading--catch' : ''}`}>{fields.header}</h1>}
          {fields.subheader && <h2>{fields.subheader}</h2>}

          {heroStyle !== 'hero--bottom' && <div className={classes['btn-wrap']}>
            {youtubeVideoId && <button onClick={() => showVideo()} className={`${classes['hero-video__action-btn']} btn salmon`}>
              <IconPlayButtonTriangle />
              <span>Play Video</span>
            </button>}

            {fields.primaryCtaUrl && !youtubeVideoId && <Link href={`${fields.primaryCtaUrl}`}>
              <a className={`${classes['btn']} btn ${btnColor} no-underline`}>
              {fields.primaryCtaText}
              </a>
            </Link>}

            {fields.secondaryCtaUrl && !youtubeVideoId && <Link href={`${fields.secondaryCtaUrl}`}>
              <a>{fields.secondaryCtaText}</a>
            </Link>}
          </div>}
        </div>
      </div>

      {isMobile && mounted && mobileBackgroundImage && <div className={`${classes['hero__wrap']} ${classes['hero__wrap--mbl']}`}>
        {heroStyle === 'hero--center-transparent' ?
          <Image className={classes.mbl__img} src={mobileBackgroundImage?.asset.url} layout="fill" alt={alt} /> :
          <ResponsiveImage className={classes.mbl__img} src={mobileBackgroundImage?.asset.url} layout="fill" alt={alt} />
        }
      </div>}

      {isDesktop && mounted && desktopBackgroundImage && <div className={`${classes['hero__wrap']} ${classes['hero__wrap--dsktp']}`}>
        {heroStyle === 'hero--center-transparent' ?
          <Image className={classes.mbl__img} src={desktopBackgroundImage?.asset.url} layout="fill" alt={alt} /> :
          <ResponsiveImage className={classes.mbl__img} src={desktopBackgroundImage?.asset.url} layout="fill" alt={alt} />
        }
      </div>}

      {youtubeVideoId && <Video youtubeVideoId={youtubeVideoId} startVideo={startVideo} className={classes['hero-video__wrap']} />}

    </div>
  )
}

export default FullBleedHero
