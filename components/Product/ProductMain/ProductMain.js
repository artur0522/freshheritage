import { useRef } from 'react'
import classes from './ProductMain.module.scss'
import { usePurchaseFlowContext } from '@/context/PurchaseFlowContext'
import { usePDPDrawerContext } from '@/context/PDPDrawerContext'
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext'
import ProductSlider from '../ProductSlider'
import ProductReviewStars from '../ProductReviewStars'
import { getCartVariant } from 'utils/getCartVariant'
import { useRouter } from 'next/router'
import { formatWeight } from '@/utils/formatWeight'

const ProductMain = ({box}) => {

  const inputRef = useRef()
  const purchaseFlowContext = usePurchaseFlowContext()
  const PDPDrawerContext = usePDPDrawerContext()
  const { addItemToOrder } = useHeadlessCheckoutContext()
  const router = useRouter()

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
        <span>{formatWeight(firstVariant.weight)} lbs</span>
      </div>

      {product.content?.handle === 'premium-seafood-subscription-box' &&
        <div className="input-group input-group--checkbox">
          <input
            className="input"
            id="shellfish_free"
            type="checkbox"
            ref={inputRef}
            checked={purchaseFlowContext.options.shellfish_free_selected}
            onChange={() => {
              purchaseFlowContext.setOptions({
                ...purchaseFlowContext.options,
                shellfish_free_selected: inputRef.current.checked
              })
            }}
          />
          <label htmlFor="shellfish_free">Shellfish Free</label>
        </div>
      }
      <button
        onClick={async () => {
          if (product.content.handle === 'sitka-seafood-intro-box') {
            const variant = getCartVariant({
              product,
              variant: firstVariant
            });
            await addItemToOrder({variant, product})
              .then(() => {
                PDPDrawerContext.dispatch({ type: 'close_drawer' })
                router.push('/checkout')
              })
          } else {
            purchaseFlowContext.selectBox(product, inputRef.current?.checked)
            PDPDrawerContext.dispatch({ type: 'close_drawer' })
          }
        }}
        className={`${classes['product-atc-btn']} btn salmon`}>
          {boxDetails.ctaText}
      </button>
    </div>
  )
}

export default ProductMain