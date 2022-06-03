import classes from './ProductStamps.module.scss'
import { useMediaQuery } from 'react-responsive'
import ResponsiveImage from '@/components/ResponsiveImage'

const ProductStamps = ({fields, product}) => {

  const isDesktop = useMediaQuery(
    { minWidth: 1074 }
  )

  return (
    <div className={classes['product-stamps']}>
      {isDesktop &&
        <ResponsiveImage src={fields.desktopImage.asset.url} alt={fields.desktopImage.asset.alt || product.content?.title} />
      }
      {!isDesktop &&
        <ResponsiveImage src={fields.mobileImage.asset.url} alt={fields.mobileImage.asset.alt || product.content?.title} />
      }
    </div>
  )
}

export default ProductStamps