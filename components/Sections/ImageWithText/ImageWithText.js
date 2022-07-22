import React from 'react'

import ResponsiveImage from '@/components/ResponsiveImage'

import classes from "./ImageWithText.module.scss"

const ImageWithText = ({fields}) => {
  const {image, imageDescription, alt, imageSize} = fields
  return (
    <div className={`${classes['row']} container`}>
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