import classes from './ProductDetailsList.module.scss'
import { PortableText } from '@portabletext/react'

const ProductDetailsList = ({fields}) => {
  return (
    <div className={`${classes['product-details']} ${classes['pdp-drawer__product-details']}`}>
      <h4>{fields.detailsTitle}</h4>
      <ul className={classes['product-details__items']}>
        {fields.detailsItems.map(item => {
          return <li className={classes['product-details__item']} key={item._key}>
            <PortableText value={item.text[0]} />
          </li>
        })}
      </ul>
    </div>
  )
}

export default ProductDetailsList