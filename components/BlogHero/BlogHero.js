import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'

import classes from './BlogHero.module.scss'

const BlogHero = ({ fields }) => {
  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' })
  let { heroStyle, textColor, desktopBackgroundImage, mobileBackgroundImage } = fields
  let btnColor

  useEffect(() => {
    setMounted(true)
  }, [])

  // Conditionally change the color of the button
  if (textColor === 'text--light') {
    btnColor = 'alabaster'
  } else {
    btnColor = 'salmon'
  }
  
  return (
    <div className={`${classes['hero']} ${classes[heroStyle]} ${classes[textColor]}`}>
      <div className={`${classes['hero__text']}`}>
        <div className={classes['hero__text-inner']}>
          {fields.header && <h1>{fields.header}</h1>}
          {fields.subheader && <h2>{fields.subheader}</h2>}
        </div>
      </div>

      {isMobile && mounted &&
        <div className={`${classes['hero__wrap']} ${classes['hero__wrap--mbl']}`}>
          <Image
            className={classes.dsktp__img}
            src={mobileBackgroundImage.asset.url}
            layout="fill"
          />
        </div>}

        {isDesktop && mounted && <div className={`${classes['hero__wrap']} ${classes['hero__wrap--dsktp']}`}>
          <Image
            className={classes.mbl__img}
            src={desktopBackgroundImage.asset.url}
            layout="fill"
          />
        </div>}
    </div>
  )
}

export default BlogHero
