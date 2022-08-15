import { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import classes from './ArticleProduct.module.scss'
import { getCartVariant } from 'utils/getCartVariant'
import { usePDPDrawerContext } from '@/context/PDPDrawerContext'
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext'
import ResponsiveImage from '@/components/ResponsiveImage'
import Image from 'next/image'

const ArticleProduct = ({product, parentClasses}) => {

  const PDPDrawerContext = usePDPDrawerContext()
  const { addItemToOrder } = useHeadlessCheckoutContext()

  const [mounted, setMounted] = useState(false)
  const isDesktop = useMediaQuery(
    {query: '(min-width: 1074px)'}
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!product || !product.content) {
    return ''
  }

  return (
    <div className={`${classes['article-product']} ${parentClasses['article-section']}`}>
      <div className={classes['article-product__card']}>
        <div className={classes['article-product__content']}>
          <div className={classes['article-product__image']}>
            {mounted && isDesktop && <ResponsiveImage
              src={product.content.media[0].src}
              alt={product.content.media[0].altText || product.content.title}
            />}
            {mounted && !isDesktop && <Image
              layout="fill"
              src={product.content.media[0].src}
              alt={product.content.media[0].altText || product.content.title}
            />}
          </div>
          <div className={classes['article-product__details']}>
            <h4 className="heading--product-title">{product.content.title}</h4>
            <div className={`${classes['article-product____tier-price-pounds']} secondary--body`}>
              <span>${product.variants[0].price} / box</span>
              <span>{product.variants[0].weight} lbs</span>
            </div>
            <div className={classes['article-product__details-footer']}>
              <button
                onClick={() => PDPDrawerContext.openDrawer(product)}
                className="btn-link-underline">
                  Details & Projected Harvest
              </button>
              <button
                onClick={() => {
                  const variant = getCartVariant({
                    product,
                    variant: product.variants[0]
                  });
                  addItemToOrder({variant})
                }}
                className="btn salmon"
              >Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default ArticleProduct