import React, { useState, useEffect } from 'react'
import { PortableText } from '@portabletext/react'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import Link from 'next/link'

import classes from './SplitHero.module.scss'
import IconBullet from '@/svgs/list-item.svg'

const SplitHero = ({ fields }) => {
  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const isDesktop = useMediaQuery(
    {query: '(min-width: 768px)'}
  )
  
  const { imageContainer, imageWidth, style, textColor, valueProps, disclaimer, desktopBackgroundImage, mobileBackgroundImage, alt } = fields

  useEffect(() => {
    setMounted(true)
  }, [])
    
  return (
    <div className={`${classes['hero']} ${classes[style]} ${classes[imageContainer]} ${classes[textColor]}`}>
      <div className={`${classes['hero__row']}`}>
        <div className={classes['hero__text']}>
          <div className={classes['hero__text--inner']}>
            {fields.header && <h1>{fields.header}</h1>}
            {fields.subheader && <h2 className={classes['subheader']}>{fields.subheader}</h2>}

            {valueProps && <ul className={classes['value-props']}>{
              valueProps.map((prop) =>
                <li className="body" key={prop}><span><IconBullet /></span>{prop}</li>
            )}
            </ul>}

            <div className={classes['btn-wrap']}>
              {fields.primaryCtaUrl && <Link href={`${fields.primaryCtaUrl}`}>
                  <a className={`${classes['primary-btn']} btn salmon no-underline text-align--center`}>
                  {fields.primaryCtaText}
                  </a>
              </Link>}

              {fields.secondaryCtaUrl && <Link href={`${fields.secondaryCtaUrl}`}>
                  <a className={`btn--only-mobile alabaster ${classes['secondary-btn']}`}>{fields.secondaryCtaText}</a>
              </Link>}

              {!fields.secondaryCtaUrl && fields.secondaryCtaText && <h2 className={classes['secondary-text']}>{fields.secondaryCtaText}</h2>}
            </div>

            {disclaimer && <div className={`${classes['disclaimer']} body`}>
              <PortableText
                value={disclaimer}
              />
            </div>}
          </div>
        </div>

        {isMobile && mounted && <div className={`${classes['hero__wrap--mbl']} ${classes['hero__wrap']} ${classes[imageWidth]}`}>
          <Image
            className={classes.dsktp__img}
            src={mobileBackgroundImage.asset.url}
            layout="fill"
            alt={alt}
          />
        </div>}

        {isDesktop && mounted && <div className={`${classes['hero__wrap--dsktp']} ${classes['hero__wrap']} ${classes[imageWidth]}`}>
          <Image
            className={classes.mbl__img}
            src={desktopBackgroundImage.asset.url}
            layout="fill"
            alt={alt}
          />
        </div>}
      </div>
    </div>
  )
}

export default SplitHero
