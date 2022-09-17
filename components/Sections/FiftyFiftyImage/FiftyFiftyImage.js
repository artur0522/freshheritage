import ResponsiveImage from '@/components/ResponsiveImage'

import classes from "./FiftyFiftyImage.module.scss"

const FiftyFiftyImage = ({fields}) => {
  const {image, imageTwo, alt, altTwo, imageDescription, imageDescriptionTwo, topPadding, bottomPadding} = fields
  return (
    <div className={`${classes['row']} container ${topPadding ? classes['top-padding'] : ''} ${bottomPadding ? classes['bottom-padding'] : ''}`}>
        <div className={classes['col']}>
            <div className={classes['img-wrap']}>
                {image && <ResponsiveImage
                    sizes="50vw"
                    src={image?.asset.url}
                    alt={alt || ''}
                />}
            </div>
            {imageDescription && <p>{imageDescription}</p>}
        </div>

        <div className={classes['col']}>
            <div className={classes['img-wrap']}>
                {image && <ResponsiveImage
                    sizes="50vw"
                    src={imageTwo?.asset.url}
                    alt={altTwo || ''}
                />}
            </div>
            {imageDescriptionTwo && <p>{imageDescriptionTwo}</p>}
        </div>
    </div>
  )
}


export default FiftyFiftyImage