import React from 'react'

import ResponsiveImage from '@/components/ResponsiveImage'

import classes from "./ImageWithText.module.scss"

const ImageWithText = ({fields}) => {
  const {image, imageDescription, alt, imageSize, topPadding, bottomPadding} = fields
  return (
    <div className={`${classes['row']} container ${topPadding ? classes['top-padding'] : ''} ${bottomPadding ? classes['bottom-padding'] : ''}`}>
        <div className={`${classes['col']} ${classes[imageSize]}`}>
            <div className={classes['img-wrap']}>
                {image && <ResponsiveImage
                    src={image?.asset.url}
                    alt={alt || ''}
                />}
            </div>
            {imageDescription && <p>{imageDescription}</p>}
        </div>
    </div>
  )
}

export default ImageWithText