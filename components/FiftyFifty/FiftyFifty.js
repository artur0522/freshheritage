import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import classes from './FiftyFifty.module.scss'

const FiftyFifty = ({ fields }) => {
  let sectionImage

  // Check if image exists
  if (fields.image) {
    // TODO: Add image alt
    sectionImage = <Image className={classes.mbl__img} src={fields.image.asset.url} layout="fill" alt="" />
  } else {
    return null
  }

  return (
    <div className={classes['fifty-fifty']}>
        <div className={`${classes['fifty-fifty__row']} ${classes[fields.imageAlign]} flex--justify-between container`}>
            {sectionImage &&  <div className={classes['fifty-fifty__image']}>
                {sectionImage}
            </div>}
            <div className={classes['fifty-fifty__text']}>
                {fields.header && <h1>{fields.header}</h1>}
                {fields.subheader && <h2>{fields.subheader}</h2>}
                {fields.ctaUrl && <Link href={`${fields.ctaUrl}`}>
                    <a className={`${classes['btn']} btn salmon no-underline text-align--center`}>
                    {fields.ctaText}
                    </a>
                </Link>}
            </div>
        </div>
    </div>
  )
}

export default FiftyFifty
