import { forwardRef } from 'react'
import classes from './ProductReviews.module.scss'

const ProductReviews = forwardRef(({product, fields}, ref) => {

  const { media } = product.content
  const { header } = fields
  const ignoreProductHandles = ['digital-gift-card']

  if (ignoreProductHandles.includes(product.content.handle)) {
    return '';
  }

  if (!media?.length) {
    return ''
  }

  return (
    <div ref={ref.current.productReviews} className={classes['product-reviews']}>
      <div className="container">
        <div className={classes['product-reviews__header']}>
          <h2 className="h1">{header}</h2>
        </div>
        <div
          id="stamped-main-widget"
          data-product-id={product.sourceEntryId.replace('gid://shopify/Product/', '')}
          data-name={product.content.title}
          data-image-url={media[0].src}
          data-product-title={product.content.title} />
      </div>
    </div>
  )
})

export default ProductReviews