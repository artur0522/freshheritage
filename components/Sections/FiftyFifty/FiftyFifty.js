import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import classes from './FiftyFifty.module.scss'

const FiftyFifty = ({ fields }) => {
  let sectionImage
  const { alt, subheaderFont } = fields

  console.log('fiftfirfer', fields)

  // Check if image exists
  if (fields.image) {
    sectionImage = <Image className={classes.mbl__img} src={fields.image.asset.url} layout="fill" alt={alt} />
  } else {
    return null
  }

  return (
    <div className={classes['fifty-fifty']}>
        <div className={`${classes['fifty-fifty__row']} ${classes[fields.imageAlign]} ${classes['container']} flex--justify-between`}>
            {sectionImage &&  <div className={classes['fifty-fifty__image']}>
                {sectionImage}
            </div>}
            <div className={classes['fifty-fifty__text']}>
                {fields.header && <h1>{fields.header}</h1>}
                {fields.subheader && subheaderFont === 'header-font' && <h2>{fields.subheader}</h2>}
                {fields.subheader && subheaderFont === 'body-font' && <p>{fields.subheader}</p>}

                <div className={classes['links']}>
                  {fields.ctaUrl && <Link href={`${fields.ctaUrl}`}>
                      <a className={`${classes['btn']} btn salmon no-underline text-align--center`}>
                      {fields.ctaText}
                      </a>
                  </Link>}

                  {fields.ctaUrl2 && <Link href={`${fields.ctaUrl2}`}>
                      <a className={`${classes['btn']} btn salmon no-underline text-align--center`}>
                      {fields.ctaText2}
                      </a>
                  </Link>}
                </div>
            </div>
        </div>
    </div>
  )
}

export default FiftyFifty
