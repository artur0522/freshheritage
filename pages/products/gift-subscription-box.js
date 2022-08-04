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
import ProductForm from '@/components/Product/ProductForm'
import ProductSubscriptionSelector from '@/components/Product/ProductSubscriptionSelector'
import { GET_PRODUCTS } from '@/gql/index.js'
import PageSEO from '@/components/SEO/PageSEO'
import StructuredData from '@/components/SEO/StructuredData'
import ProductHarvests from '@/components/Product/ProductHarvests'

import classes from './Product.module.scss'
import { getNacelleReferences } from '@/utils/getNacelleReferences'

function GiftSubscriptionBoxPDP({ page, modals, products }) {

  const [product, setProduct] = useState(products[0])

  console.log("product:", product)

  const [checked, setChecked] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [harvest, setHarvests] = useState()
  const productAccordionHeaders = page.fields.content.find(block => block._type === 'productAccordionHeaders')
  const accordionDeliveryHeader = productAccordionHeaders?.details
  const productDescription = product.content?.description
  const accordionDescriptionHeader = productAccordionHeaders?.description
  const deliveryDetails = product.metafields.find(metafield => metafield.key === 'delivery_details')
  const deliveryDetailsList = deliveryDetails ? JSON.parse(deliveryDetails.value) : null
  const stampSection = page.fields.content.find(field => field._type === 'stamps')

  const modalContext = useModalContext()
  const [mounted, setMounted] = useState(false)
  const customerContext = useCustomerContext()
  const { customer } = customerContext

  const onSelectProduct = (e) => {
    const product = products.find(product => product.content.handle === e.value)
    setProduct(product)
  }

  useEffect(() => {
    console.log("change variant")
    setSelectedVariant(product.variants[0])
  }, [product])

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

                {product.content.handle !== 'digital-gift-card' && <div className={classes['prices']}>
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

                <ProductSubscriptionSelector selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} allProducts={products} product={product} onSelectProduct={onSelectProduct} />

                {/* GIFT FORM */}
                {/* <ProductForm checked={checked} handle={product.content.handle} product={product} setSelectedVariant={setSelectedVariant} selectedVariant={selectedVariant} /> */}

                {/* ACCORDION */}
                {deliveryDetailsList && <div className={classes['accordion']}>
                  <ProductAccordion header={accordionDescriptionHeader}  description={productDescription} />
                  <ProductAccordion header={accordionDeliveryHeader}  contentList={deliveryDetailsList} />
                </div>}

                {/* STAMPS */}
                <div className={classes['product-stamps']}>
                  {isDesktop &&
                    <ResponsiveImage src={stampSection.stamps.desktopImage.asset.url} alt={stampSection.stamps.desktopImage.alt || product.content?.title} />
                  }
                  {!isDesktop &&
                    <ResponsiveImage src={stampSection.stamps.mobileImage.asset.url} alt={stampSection.stamps.mobileImage.alt || product.content?.title} />
                  }
                </div>
              </div>
            </div>
          <ProductHarvests title="Projected Harvests" product={product} />
          {/* SECTIONS */}
          <ContentSections sections={page.fields.content} />
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
  const { products } = await nacelleClient.query({
    query: GET_PRODUCTS,
    variables: {
      "filter": {
        "handles": ['salmon-subscription-box', 'premium-seafood-subscription-box', 'seafood-subscription-box', 'sitka-seafood-intro-box']
      }
    }
  })

  const page = await nacelleClient.content({
    handles: ['product'],
    entryDepth: 1
  })

  const fullRefPage = await getNacelleReferences(page[0])

  // if (!products.length) {
  //   return {
  //     notFound: true
  //   }
  // }

  const modals = await nacelleClient.content({
    type: 'gatedProductModal'
  })

  return {
    props: {
      products: products,
      page: fullRefPage,
      modals
    }
  }
}