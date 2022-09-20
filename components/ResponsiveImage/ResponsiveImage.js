/*
  This image component will render images that will always take
  up the whole width of the parent container while having dynamic
  height based on browser width
*/

import Image from 'next/image'
import classes from './ResponsiveImage.module.scss'

const ResponsiveImage = ({src, loader, sizes, alt, priority = false, style }) => {
  return (
    <div className={`${classes['image-container']} responsve-image-container`}>
      <Image className={classes['image']} loader={loader} sizes={sizes} src={src} layout="fill" alt={alt} priority={priority} style={style} />
    </div>
  )
}

export default ResponsiveImage