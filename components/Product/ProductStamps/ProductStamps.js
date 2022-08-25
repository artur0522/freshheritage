import classes from './ProductStamps.module.scss'
import ResponsiveImage from '@/components/ResponsiveImage'

const ProductStamps = ({fields, product}) => {

  const { badgeItems } = fields

  return <div className={classes['product-stamps']}>
    <ul>
      {badgeItems.map(item => {
        if (!item.asset) return ''
        return <li key={item._key}>
          <ResponsiveImage src={item.asset.url} alt={item.alt || product.content?.title} />
        </li>
      })}
    </ul>
  </div>
}

export default ProductStamps