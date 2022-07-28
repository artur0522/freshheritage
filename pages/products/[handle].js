import { useState, useEffect, useCallback } from 'react'
import { nacelleClient } from 'services'
import { useMediaQuery } from 'react-responsive'
import ResponsiveImage from '@/components/ResponsiveImage'

import { useModalContext } from '@/context/ModalContext'
import { useCustomerContext } from '@/context/CustomerContext'
import ContentSections from '@/components/Sections/ContentSections'
import ProductReviewStars from '../../components/Product/ProductReviewStars'
import ProductSlider from '../../components/Product/ProductSlider'
import ProductAccordion from '../../components/Product/ProductAccordion'
import ProductGiftForm from '@/components/Product/ProductGiftForm'
import ProductHarvests from '@/components/Product/ProductHarvests'
import { GET_PRODUCTS } from '@/gql/index.js'
import PageSEO from '@/components/SEO/PageSEO'
import StructuredData from '@/components/SEO/StructuredData'

import classes from './Product.module.scss'
import { split } from 'lodash-es'

function Product({ product, page, modals }) {
  const [checked, setChecked] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const handle = product.content?.handle
  const productAccordionHeaders = page[0].fields.content.find(block => block._type === 'productAccordionHeaders')
  const accordionDeliveryHeader = productAccordionHeaders?.details
  const productDescription = product.content?.description
  const accordionDescriptionHeader = productAccordionHeaders?.description
  const deliveryDetails = product.metafields.find(metafield => metafield.key === 'delivery_details')
  const harvestMetafield = product.metafields.find(metafield => metafield.key === 'harvest_handle')
  const deliveryDetailsList = deliveryDetails ? JSON.parse(deliveryDetails.value) : null
  const stampSection = page[0].fields.content.find(field => field._type === 'stamps')

  console.log('harvestmeta', harvestMetafield)

  const modalContext = useModalContext()
  const [mounted, setMounted] = useState(false)
  const customerContext = useCustomerContext()
  const { customer } = customerContext

  useEffect(() =>  {
    setMounted(true)

    if(product.content.handle === 'digital-gift-card') {
      setChecked(true)
    }

    const foundVisibleTags = product.tags.filter(tag => tag.includes('Visible' || 'visible'));
    const splitTag = foundVisibleTags[0]?.split(':')[1]
    const splitTagWithDash = splitTag?.replace(/\s/g, '-').toLowerCase()
    const foundCustomerTag = customer?.tags.find(tag => tag.includes('member' || 'Member') || tag.includes('sustainer' || 'sustainer'))

    const productHasCustomerTag = foundVisibleTags?.find((tag) => {
      let splitTag = tag.split(':')[1] === foundCustomerTag
      if(splitTag) {
        return splitTag
      } else {
        return null
      }
    })

    modalContext.setProductCustomerTag(productHasCustomerTag)

    const foundModal = modals.find(modal => modal.handle === splitTagWithDash)
    const defaultModal = modals.find(modal => modal.handle === 'non-member')

    // if product tags exist but none of the product tags match customer tag
    if(foundVisibleTags.length > 0 && !productHasCustomerTag) {
      if(foundModal) {
        modalContext.setPrevContent(foundModal?.fields)
        modalContext.setContent(foundModal?.fields)
      } else {
        modalContext.setPrevContent(defaultModal?.fields)
        modalContext.setContent(defaultModal?.fields)
      }
      modalContext.setModalType('gated_product')
      modalContext.setIsOpen(true)
    }

    // if one of the product tags contains customer tag
    if(foundVisibleTags.length > 0 && productHasCustomerTag) {
      modalContext.setIsOpen(false)
    }

    // if visible tags dont exist
    if(foundVisibleTags.length === 0) {
      modalContext.setIsOpen(false)
    }
  }, [customer])

  const isDesktop = useMediaQuery(
    { minWidth: 1074 }
  )

  const handleCheckbox = () => {
    setChecked(!checked);
  };

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
                <ProductReviewStars productId={product.sourceEntryId.replace('gid://shopify/Product/', '')} />

                {product.content?.title && <h1 className={classes['product-title']}>{product.content.title}</h1>}

                {handle !== 'digital-gift-card' && <div className={classes['prices']}>
                  <div className={classes['price-wrap']}>
                    {selectedVariant.compareAtPrice && (
                      <h3 className={classes.compare}>
                        ${selectedVariant.compareAtPrice}
                      </h3>
                    )}
                    <h3>${selectedVariant.price}</h3>
                  </div>
                  <h3 className={classes['weight']}>{selectedVariant.weight} lbs</h3>
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

                {/* GIFT FORM */}
                <ProductGiftForm checked={checked} handle={handle} product={product} setSelectedVariant={setSelectedVariant} selectedVariant={selectedVariant} />

                {/* ACCORDION */}
                {deliveryDetailsList && <div className={classes['accordion']}>
                  <ProductAccordion header={accordionDescriptionHeader}  description={productDescription} />
                  <ProductAccordion header={accordionDeliveryHeader}  contentList={deliveryDetailsList} />
                </div>}

                {/* STAMPS */}
                <div className={classes['product-stamps']}>
                  {isDesktop &&
                    <ResponsiveImage src={stampSection.stamps.desktopImage.asset.url} alt={stampSection.stamps.desktopImage.asset.alt || product.content?.title} />
                  }
                  {!isDesktop &&
                    <ResponsiveImage src={stampSection.stamps.mobileImage.asset.url} alt={stampSection.stamps.mobileImage.asset.alt || product.content?.title} />
                  }
                </div>
              </div>
            </div>
          {/* SECTIONS */}
          <ContentSections sections={page[0].fields.content} harvestMetafield={harvestMetafield} />
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
    .filter((product) => product.content?.handle)
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
    handles: ['product']
  })

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
      page,
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

