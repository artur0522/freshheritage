import { useState, useEffect } from 'react'
import { nacelleClient } from 'services'
import { useMediaQuery } from 'react-responsive'
import ResponsiveImage from '@/components/ResponsiveImage'

import { useModalContext } from '@/context/ModalContext'
import { useCustomerContext } from '@/context/CustomerContext'
import ContentSections from '@/components/ContentSections'
import ProductReviewStars from '../../components/Product/ProductReviewStars'
import ProductSlider from '../../components/Product/ProductSlider'
import ProductAccordion from '../../components/Product/ProductAccordion'
import ProductGiftForm from '@/components/Product/ProductGiftForm'

import classes from './Product.module.scss'

function Product({ product, page }) {
  const [checked, setChecked] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  
  const handle = product.content.handle
  const productAccordionHeaders = page[0].fields.content.find(block => block._type === 'productAccordionHeaders')
  const accordionDeliveryHeader = productAccordionHeaders?.details
  const productDescription = product.content.description
  const accordionDescriptionHeader = productAccordionHeaders?.description
  const deliveryDetails = product.metafields.find(metafield => metafield.key === 'delivery_details')
  const deliveryDetailsList = deliveryDetails ? JSON.parse(deliveryDetails.value) : null
  const stampSection = page[0].fields.content.find(field => field._type === 'stamps')

  const modalContext = useModalContext()
  const customerContext = useCustomerContext()
  const { customer } = customerContext

  useEffect(() =>  {
    if(product.content.handle === 'digital-gift-card') {
      setChecked(true)
    }

    const foundVisibleTags = product.tags.filter(tag => tag.includes('Visible'));
    const splitTag = foundVisibleTags[0]?.split(':')[1]
    const splitTagWithDash = splitTag?.replace(/\s/g, '-').toLowerCase()

    const foundCustomerTag = customer?.tags.find(tag => tag.includes('member') || tag.includes('sustainer'))
    const productHasCustomerTag = foundVisibleTags.find(tag => tag.includes('member') || tag.includes('sustainer'))
  
    if(foundVisibleTags.length > 0 && customer && !productHasCustomerTag) {
      const gatedPopup = page.find(field => field.handle === splitTagWithDash)
      modalContext.setContent(gatedPopup.fields)
      modalContext.setIsOpen(true)
      modalContext.setModalType('gated_product')
    }
  })
  
  const isDesktop = useMediaQuery(
    { minWidth: 1074 }
  )

  const handleCheckbox = () => {
    setChecked(!checked);
  };
  
  return (
    product && (
      <div className={classes['product']}>
        <div className={classes['product__inner']}>
            <div className={`${classes['product__row']} container`}>
            <div className={classes['slider']}>
              <ProductSlider product={product} />
            </div>
             
              <div className={classes['main']}>
                <ProductReviewStars />

                {product.content.title && <h1 className={classes['product-title']}>{product.content.title}</h1>}

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
          <ContentSections sections={page[0].fields.content} />
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
    query: PAGE_QUERY,
    variables: { handle: params.handle }
  })

  const product = products[0]
  const foundVisibleTag = product.tags.find(tag => tag.includes('Visible'));
  const splitTag = foundVisibleTag?.split(':')[1]
  const refinedSplitTag = splitTag?.replace(' ', '-').toLowerCase()

  const page = await nacelleClient.content({
    handles: ['product', refinedSplitTag ? refinedSplitTag : '']
  })

  if (!products.length) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      product: products[0],
      page
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

// GraphQL query for product content. Used in `getStaticProps`.
// (https://nacelle.com/docs/querying-data/storefront-api)
const PAGE_QUERY = `
  query ProductPage($handle: String!){
    products(filter: { handles: [$handle] }){
      nacelleEntryId
      sourceEntryId
      content{
        handle
        title
        description
        media {
          altText
          id
          src
          thumbnailSrc
          type
        }
        options{
          name
          values
        }
        featuredMedia{
          src
          thumbnailSrc
          altText
        }
			}
      tags
      metafields {
        id
        key
        namespace
        value
      }
      variants{
        nacelleEntryId
        sourceEntryId
        sku
        availableForSale
        price
        compareAtPrice
        weight
        content{
          title
          variantEntryId
          selectedOptions{
            name
            value
          }
          featuredMedia{
            src
            thumbnailSrc
            altText
          }
        }
      }
    }
  }
`

