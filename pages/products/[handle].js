import { useState, useEffect, createRef, useRef } from 'react'
import { nacelleClient } from 'services'
import { useMediaQuery } from 'react-responsive'
import useSWR from 'swr'
import axios from 'axios'

import { useModalContext } from '@/context/ModalContext'
import { useCustomerContext } from '@/context/CustomerContext'
import ContentSections from '@/components/Sections/ContentSections'
import ProductReviewStars from '@/components/Product/ProductReviewStars'
import ProductSlider from '../../components/Product/ProductSlider'
import ProductForm from '@/components/Product/ProductForm'
import ProductDetailsList from '@/components/Product/ProductDetailsList'
import { GET_PRODUCTS } from '@/gql/index.js'
import { getVariantByOptions } from '@/utils/getVariantByOptions'
import PageSEO from '@/components/SEO/PageSEO'
import StructuredData from '@/components/SEO/StructuredData'

import classes from './Product.module.scss'
import { getNacelleReferences } from '@/utils/getNacelleReferences'
import { getRecentArticlesHandles } from '@/utils/getRecentArticleHandles'
import ProductStamps from '@/components/Product/ProductStamps'
import { dataLayerViewProduct } from '@/utils/dataLayer'
import { formatWeight } from '@/utils/formatWeight'

// setup inventory fetcher
const fetchInventory = (url, productHandle) => {
  return axios
     .get(url, {
       params: {
         productHandle: productHandle,
       },
     })
   .then((res) => res.data)
 };


function Product({ product, page, modals }) {
  const [checked, setChecked] = useState(false)
  const [variants, setVariants] = useState(product.variants)
  const [selectedVariant, setSelectedVariant] = useState(variants[0])
  const handle = product.content?.handle
  const productAccordionHeaders = page.fields.content.find(block => block._type === 'productAccordionHeaders')
  const accordionDeliveryHeader = productAccordionHeaders?.details
  const productDescription = product.content?.description
  const accordionDescriptionHeader = productAccordionHeaders?.description
  const deliveryDetails = product.metafields.find(metafield => metafield.key === 'delivery_details')
  const harvestMetafield = product.metafields.find(metafield => metafield.key === 'harvest_handle')
  const deliveryDetailsList = deliveryDetails ? JSON.parse(deliveryDetails.value) : null
  const badgeSection = page.fields.content.find(field => field._type === 'stamps')

  const modalContext = useModalContext()
  const [mounted, setMounted] = useState(false)
  const customerContext = useCustomerContext()
  const { customer } = customerContext

  const refs = useRef(['reviewsStars', 'productReviews'].reduce((carry, ref) => {
    return {
      ...carry,
      [ref]: createRef()
    }
  }, {}))

  const { data: productInfoRevalidate } = useSWR(
    ['/api/product/available', product.content.handle],
    (url, id) => fetchInventory(url, id),
    {
      errorRetryCount: 3,
      refreshInterval: 5000
    }
  );

  useEffect(() => {
    if (productInfoRevalidate?.variants) {
      const variant = productInfoRevalidate.variants.find(variant => variant.sourceEntryId === selectedVariant.sourceEntryId)
      setVariants(productInfoRevalidate.variants);
      setSelectedVariant(variant);
    }
  }, [productInfoRevalidate]);

  useEffect(() =>  {
    setMounted(true)

    if(product.content.handle === 'digital-gift-card') {
      setChecked(true)
    }

    if (!product.tags.length) {
      return
    }

    const foundVisibleTags = product.tags.reduce((carry, tag) => {
      if (tag.toLowerCase().includes('visible')) {
        const splitTag = tag.split(':')[1].trim()
        const splitTagWithoutDash = splitTag?.replace(/-/g, '').replace(/ /g, '').toLowerCase()
        return [...carry, splitTagWithoutDash]
      }
      return carry
    }, [])

    const productHasCustomerTag = customer?.tags.some(tag => {
      const customerTagWithoutDash = tag.replace(/-/g, '').toLowerCase()
      return foundVisibleTags.some(tag => customerTagWithoutDash.indexOf(tag) > -1)
    })

    modalContext.setArticleCustomerTag(productHasCustomerTag)

    const hierarchy = [
      'kingsustainer',
      'sockeyesustainer',
      'prepaid',
      'member'
    ]

    const foundModal = modals.reduce((carry, modal) => {
      const modalHandleWithoutDash = modal.handle.replace(/-/g, '').replace(/ /g, '')
      if (foundVisibleTags.some(tag => tag.indexOf(modalHandleWithoutDash) > -1)) {
        if (!carry.handle) return modal
        if (hierarchy.indexOf(modalHandleWithoutDash) < hierarchy.indexOf(carry.handle.replace(/-/g, ''))) {
          return modal
        }
      }
      return carry
    }, {})

    // if product tags exist but none of the product tags match customer tag
    if(foundVisibleTags.length > 0 && !productHasCustomerTag && foundModal.fields) {
      modalContext.setContent(foundModal.fields)
      modalContext.setModalType('gated_product')
      modalContext.setIsOpen(true)
    }

    if (modalContext.modalType === 'gated_product') {
      // if one of the product tags contains customer tag
      if(foundVisibleTags.length > 0 && productHasCustomerTag) {
        modalContext.setIsOpen(false)
      }

      // if visible tags dont exist
      if(foundVisibleTags.length === 0) {
        modalContext.setIsOpen(false)
      }
    }

  }, [customer, modalContext.isOpen])

  useEffect(() => {
    dataLayerViewProduct({product})
  }, [])

  const isDesktop = useMediaQuery(
    { minWidth: 1074 }
  )

  const handleCheckbox = () => {
    setChecked(!checked)
  }

  return (
    product && (
      <div className={classes['product']}>
        <StructuredData type="product" data={product} />
        <PageSEO product={product} />
        <div className={classes['product__inner']}>
            <div className={`${classes['product__row']} container`}>

              <div className={classes['slider']}>
                <ProductSlider product={product} />
                {/* <ProductHarvests product={product} /> */}
              </div>

              <div className={classes['main']}>
                <ProductReviewStars refs={refs} productId={product.sourceEntryId.replace('gid://shopify/Product/', '')} />

                {product.content?.title && <h1 className={classes['product-title']}>{product.content.title}</h1>}

                {handle !== 'digital-gift-card' && <div className={classes['prices']}>
                  <div className={classes['price-wrap']}>
                    {selectedVariant.compareAtPrice && (
                      <h2 className={classes.compare}>
                        ${selectedVariant.compareAtPrice}
                      </h2>
                    )}
                    <h2>${selectedVariant.price} {product.tags.includes('Subscription Box') ? '/ box' : ''}</h2>
                  </div>
                  <h2 className={classes['weight']}>{formatWeight(selectedVariant.weight)} lbs</h2>
                </div>}

                <div className={classes['gift']}>
                    {handle !== 'digital-gift-card' && <div className={classes['gift__check']}>
                      <input
                        id="giftCheck"
                        type="checkbox"
                        checked={checked}
                        onChange={handleCheckbox}
                      />
                      <label htmlFor="giftCheck" className="heading--label">
                        This is a Gift
                      </label>
                    </div>}
                </div>

                {/* PRODUCT FORM  */}
                <ProductForm checked={checked} handle={handle} product={product} variants={variants} setSelectedVariant={setSelectedVariant} selectedVariant={selectedVariant} />

                {/* ACCORDION */}
                {deliveryDetailsList && <div className={`product-accordions ${classes['accordion']}`}>
                  <ProductDetailsList fields={{
                    detailsTitle: accordionDescriptionHeader,
                    description: (productDescription) ? productDescription : ''
                  }} enableToggle={true} />
                  <ProductDetailsList fields={{
                    detailsTitle: accordionDeliveryHeader,
                    detailsItems: deliveryDetailsList
                  }} enableToggle={true} />
                </div>}

                {/* STAMPS */}
                {badgeSection.badges &&
                  <ProductStamps fields={badgeSection.badges} product={product} />
                }
              </div>
            </div>
          {/* SECTIONS */}
          <ContentSections ref={refs} product={product} sections={page.fields.content} harvestMetafield={harvestMetafield} />
        </div>
      </div>
    )
  )
}

export default Product

export async function getStaticPaths() {
  // Performs a GraphQL query to Nacelle to get product handles.
  // (https://nacelle.com/docs/querying-data/storefront-sdk)
  const results = await nacelleClient.query({
    query: HANDLES_QUERY
  })
  const handles = results.products
    .filter((product) => product.content.handle && product.content.handle !== 'gift-subscription-box')
    .map((product) => ({ params: { handle: product.content.handle } }))

  return {
    paths: handles,
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params }) {
  // Performs a GraphQL query to Nacelle to get product data,
  // using the handle of the current page.
  // (https://nacelle.com/docs/querying-data/storefront-sdk)
  const { products } = await nacelleClient.query({
    query: GET_PRODUCTS,
    variables: {
      "filter": {
        "handles": [params.handle]
      }
    }
  })

  const page = await nacelleClient.content({
    handles: ['product'],
    entryDepth: 1
  })

  const fullRefPage = await getNacelleReferences(page[0])

  if (fullRefPage?.fields?.content?.some(content => content._type === 'featuredBlogContent')) {
    await getRecentArticlesHandles(fullRefPage.fields.content)
  }

  if (!products.length) {
    return {
      notFound: true
    }
  }

  const modals = await nacelleClient.content({
    type: 'gatedProductModal'
  })

  return {
    props: {
      product: products[0],
      page: fullRefPage,
      modals
    }
  }
}

// GraphQL query for the handles of products. Used in `getStaticPaths`.
// (https://nacelle.com/docs/querying-data/storefront-api)
const HANDLES_QUERY = `
  {
    products {
      content {
        handle
      }
    }
  }
`

