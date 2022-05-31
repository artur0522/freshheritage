/*
  This image component will render images that will always take
  up the whole width of the parent container while having dynamic
  height based on browser width
*/

import Image from 'next/image'
import classes from './ResponsiveImage.module.scss'

const ResponsiveImage = ({src, alt, priority = false}) => {
  return (
    <div className={classes['image-container']}>
      <Image className={classes['image']} src={src} layout="fill" alt={alt} priority={priority} />
    </div>
  )
}

export default ResponsiveImage