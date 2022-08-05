import { useState, useEffect } from 'react'
import { nacelleClient } from 'services'
import ContentSections from '@/components/Sections/ContentSections'
import ProductReviewStars from '../../components/Product/ProductReviewStars'
import ProductSlider from '../../components/Product/ProductSlider'
import ProductForm from '@/components/Product/ProductForm'
import ProductSubscriptionSelector from '@/components/Product/ProductSubscriptionSelector'
import { GET_PRODUCTS } from '@/gql/index.js'
import PageSEO from '@/components/SEO/PageSEO'
import StructuredData from '@/components/SEO/StructuredData'
import ProductDetailsList from '@/components/Product/ProductDetailsList'
import ProductStamps from '@/components/Product/ProductStamps'
import classes from './Product.module.scss'
import { getNacelleReferences } from '@/utils/getNacelleReferences'
import { getHarvests } from '@/utils/getHarvests'

function GiftSubscriptionBoxPDP({ page, products }) {

  const [product, setProduct] = useState(products[0])
  const [checked, setChecked] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [harvests, setHarvests] = useState(null)
  const [mounted, setMounted] = useState(false)

  const onSelectProduct = (e) => {
    const product = products.find(product => product.content.handle === e.value)
    setProduct(product)
  }

  useEffect(() => {
    setSelectedVariant(product.variants[0])
    getHarvests({product})
    .then(res => {
      if (res) {
        setHarvests(res)
      }
    })
  }, [product])

  useEffect(() =>  {
    setMounted(true)
  }, [])

  const handleCheckbox = () => {
    setChecked(!checked);
  };

  return (
    product && (
      <div className={`${classes['product']} ${classes['gift-subscription-product']}`}>
        <StructuredData type="product" data={product} />
        <PageSEO product={product} />
        <div className={classes['product__inner']}>
            <div className={`${classes['product__row']} container`}>

              <div className={classes['slider']}>
                <ProductSlider product={product} />
              </div>

              <div className={classes['main']}>
                <ProductReviewStars productId={product.sourceEntryId.replace('gid://shopify/Product/', '')} />

                {product.content?.title && <h1 className={classes['product-title']}>{product.content.title}</h1>}

                <div className={classes['prices']}>
                  <div className={classes['price-wrap']}>
                    {selectedVariant.compareAtPrice && (
                      <h2 className={classes.compare}>
                        ${selectedVariant.compareAtPrice}
                      </h2>
                    )}
                    <h2>${selectedVariant.price} / box</h2>
                  </div>
                  <h2 className={classes['weight']}>{selectedVariant.weight} lbs</h2>
                </div>

                <ProductSubscriptionSelector selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} allProducts={products} product={product} onSelectProduct={onSelectProduct} />

                {/* GIFT FORM */}
                {/* <ProductForm checked={checked} handle={product.content.handle} product={product} setSelectedVariant={setSelectedVariant} selectedVariant={selectedVariant} /> */}

                {!!product.boxDetails.fields.details &&
                  <ProductDetailsList fields={product.boxDetails.fields.details} />
                }

                {!!product.boxDetails.fields.stamps &&
                  <ProductStamps fields={product.boxDetails.fields.stamps} product={product} />
                }

              </div>
            </div>
          {/* SECTIONS */}
          <ContentSections sections={page.fields.content} harvests={harvests} disableHarvestFilters={true} />
        </div>
      </div>
    )
  )
}

export default GiftSubscriptionBoxPDP

export async function getStaticProps({ params }) {
  // Performs a GraphQL query to Nacelle to get product data,
  // using the handle of the current page.
  // (https://nacelle.com/docs/querying-data/storefront-sdk)

  const productHandles = ['salmon-subscription-box', 'premium-seafood-subscription-box', 'seafood-subscription-box', 'sitka-seafood-intro-box']

  const { products } = await nacelleClient.query({
    query: GET_PRODUCTS,
    variables: {
      "filter": {
        "handles": productHandles
      }
    }
  })

  if (!products.length) {
    return {
      notFound: true
    }
  }

  const boxDetails = await nacelleClient.content({
    handles: productHandles,
    type: 'boxDetails'
  })

  const productsWithBoxInfo = products.map(product => {
    const boxInfo = boxDetails ? boxDetails.find(box => box.handle === product.content.handle) : {}
    return {
      ...product,
      boxDetails: boxInfo
    }
  })

  const page = await nacelleClient.content({
    handles: ['gift-subscription-product'],
    entryDepth: 1
  })

  const fullRefPage = await getNacelleReferences(page[0])

  return {
    props: {
      products: productsWithBoxInfo,
      page: fullRefPage
    }
  }
}