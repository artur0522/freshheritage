import classes from './ProductMain.module.scss'
import { usePurchaseFlowContext } from '@/context/PurchaseFlowContext'
import ProductSlider from '../ProductSlider'
import ProductReviewStars from '../ProductReviewStars'

const ProductMain = ({box}) => {

  const purchaseFlowContext = usePurchaseFlowContext()

  const product = box ? box.product : {}
  const boxDetails = box ? box.boxDetails?.fields : {}
  const firstVariant = product?.variants ? product.variants[0] : {}

  return (
    <div className={classes['product-main']}>
      <ProductSlider product={product} />
      <ProductReviewStars productId={product.sourceEntryId.replace('gid://shopify/Product/', '')} />
      <h1 className={classes['product-title']}>{product.content?.title}</h1>
      <div className={classes['product-price-pounds']}>
        <span>${firstVariant.price} /box</span>
        <span>{firstVariant.weight} lbs</span>
      </div>
      <button
        onClick={() => purchaseFlowContext.selectBox(product)}
        className={`${classes['product-atc-btn']} btn salmon`}>
          {boxDetails.ctaText}
      </button>
    </div>
  )
}

export default ProductMain