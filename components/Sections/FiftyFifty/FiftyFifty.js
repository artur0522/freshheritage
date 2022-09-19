import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import classes from './FiftyFifty.module.scss'

const FiftyFifty = ({ fields }) => {
  const { title, alt, headerSize, subheaderSize, topPadding, bottomPadding, image } = fields

  return (
    <div className={classes['fifty-fifty']}>
        <div className={`${classes['fifty-fifty__row']} ${classes[fields.imageAlign]} ${topPadding ? classes['top-padding'] : ''} ${bottomPadding ? classes['bottom-padding'] : ''} ${classes['container']} flex--justify-between`}>
            {image &&  <div className={classes['fifty-fifty__image']}>
              <Image className={classes.mbl__img} src={image?.asset?.url} layout="fill" alt={alt || title} />
            </div>}
            <div className={classes['fifty-fifty__text']}>
                {fields.header && headerSize === 'large-header' && <h1>{fields.header}</h1>}
                {fields.header && headerSize === 'small-header' && <h4>{fields.header}</h4>}
                {fields.subheader && subheaderSize === 'large-subheader' && <h2>{fields.subheader}</h2>}
                {fields.subheader && subheaderSize === 'small-subheader' && <p>{fields.subheader}</p>}

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
