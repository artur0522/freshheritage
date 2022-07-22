import ResponsiveImage from '@/components/ResponsiveImage'

import classes from "./FiftyFiftyImage.module.scss"

const FiftyFiftyImage = ({fields}) => {
    console.log('fifty', fields)
    const {image, imageTwo, alt, altTwo, imageDescription, imageDescriptionTwo} = fields
  return (
    <div className={`${classes['row']} container`}>
        <div className={classes['col']}>
            <div className={classes['img-wrap']}>
                {image && <ResponsiveImage
                    src={image?.asset.url}
                    alt={image?.asset.alt || ''}
                />}
            </div>
            {imageDescription && <p>{imageDescription}</p>}
        </div>

        <div className={classes['col']}>
            <div className={classes['img-wrap']}>
                {image && <ResponsiveImage
                    src={imageTwo?.asset.url}
                    alt={imageTwo?.asset.alt || ''}
                />}
            </div>
            {imageDescriptionTwo && <p>{imageDescriptionTwo}</p>}
        </div>
    </div>
  )
}


export default FiftyFiftyImage