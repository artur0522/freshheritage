import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useCart } from '@nacelle/react-hooks'
import { nacelleClient } from 'services'
import { getSelectedVariant } from 'utils/getSelectedVariant'
import { getCartVariant } from 'utils/getCartVariant'
import ContentSections from '@/components/ContentSections'
import ProductReviewStars from '../../components/Product/ProductReviewStars'
import ProductSlider from '../../components/Product/ProductSlider'
import ProductAccordion from '../../components/Product/ProductAccordion'
import { useMediaQuery } from 'react-responsive'
import ResponsiveImage from '@/components/ResponsiveImage'

import classes from './Product.module.scss'

function Product({ product, page }) {
  console.log('page', page)
  console.log('product', product)
  const [, { addToCart }] = useCart()
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [selectedOptions, setSelectedOptions] = useState(
    selectedVariant.content.selectedOptions
  )
  const [quantity, setQuantity] = useState(1)
  const [checked, setChecked] = useState(false);
  const handle = product.content.handle

  useEffect(() =>  {
    if(product.content.handle === 'digital-gift-card') {
      setChecked(true)
    }
  }, [])
  
  const isDesktop = useMediaQuery(
    { minWidth: 1074 }
  )

  const handleCheckbox = () => {
    setChecked(!checked);
  };

  let options = null
  if (product?.content?.options?.some((option) => option.values.length > 1)) {
    options = product?.content?.options
  }

  const productAccordionHeaders = page[0].fields.content.find(block => block._type === 'productAccordionHeaders')
  const accordionDeliveryHeader = productAccordionHeaders?.details
  const accordionDescriptionHeader = productAccordionHeaders?.description
  const deliveryDetails = product.metafields.find(metafield => metafield.key === 'delivery_details')
  const deliveryDetailsList = deliveryDetails ? JSON.parse(deliveryDetails.value) : null
  const stampSection = page[0].fields.content.find(field => field._type === 'stamps')
  

  console.log("list", deliveryDetailsList)

  const buttonText = selectedVariant
    ? selectedVariant.availableForSale
      ? 'Add To Cart'
      : 'Sold Out'
    : 'Select Option'

  const handleOptionChange = (event, option) => {
    const newOption = { name: option.name, value: event.target.value }
    const optionIndex = selectedOptions.findIndex((selectedOption) => {
      return selectedOption.name === newOption.name
    })

    const newSelectedOptions = [...selectedOptions]
    if (optionIndex > -1) {
      newSelectedOptions.splice(optionIndex, 1, newOption)
      setSelectedOptions([...newSelectedOptions])
    } else {
      setSelectedOptions([...newSelectedOptions, newOption])
    }
    const variant = getSelectedVariant({
      product,
      options: newSelectedOptions
    })
    setSelectedVariant(variant ? { ...variant } : null)
  }

  const handleQuantityChange = (event) => {
    setQuantity(+event.target.value)
  }

  // Get product data and add it to the cart by using `addToCart`
  // from the `useCart` hook provided by `@nacelle/react-hooks`.
  // (https://github.com/getnacelle/nacelle-react/tree/main/packages/react-hooks)
  const handleAddItem = () => {
    const variant = getCartVariant({
      product,
      variant: selectedVariant
    })
    addToCart({
      variant,
      quantity
    })
  }

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

                <div className={classes['prices']}>
                  <div className={classes['price-wrap']}>
                    {selectedVariant.compareAtPrice && (
                      <h3 className={classes.compare}>
                        ${selectedVariant.compareAtPrice}
                      </h3>
                    )}
                    <h3>${selectedVariant.price}</h3>
                  </div>
                  <h3 className={classes['weight']}>{selectedVariant.weight} lbs</h3>
                </div>

                {handle === 'digital-gift-card' && <form className={classes['gift-card']}>
                  <div className={classes['gift-card__amount']}>
                    <h4><span className={classes['number']}>1</span>Amount</h4>
                  </div>

                  <div className={classes['gift-card__buttons']}>
                    <div className={classes['btn']}>
                      <input type="radio" id="fifty" name="giftCardButtons" value="50" />
                      <label htmlFor="fifty">$50</label>
                    </div>

                    <div className={classes['btn']}>
                      <input type="radio" id="one-hundred" name="giftCardButtons" value="100" />
                      <label htmlFor="one-hundred">$100</label>
                    </div>
                    
                    <div className={classes['btn']}>
                      <input type="radio" id="one-fifty" name="giftCardButtons" value="150" />
                      <label htmlFor="one-fifty">$150</label>
                    </div>
                    
                    <div className={classes['btn']}>
                        <input type="radio" id="two-hundred" name="giftCardButtons" value="200" />
                        <label htmlFor="two-hundred">$200</label>
                      </div>
                  </div>
                </form>}

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
                  {checked && <div className={classes['gift__info']}>
                      <div className={classes['gift__info-header']}>
                        <h4>
                          {handle === 'digital-gift-card' && <span className={classes['number']}>2</span>}
                          Recipient's Information
                        </h4>
                        <span className={`${classes['delivery']} delivery--time`}>Delivered via email one day after purchase.</span>
                      </div>
                     
                      <form>
                        <div className={classes['form__inner']}>
                          <div className={classes['form__col']}>
                            <label className="secondary--body" htmlFor="email">Email Address</label>
                            <input type="email" id="email" className="secondary--body" />
                          </div>
                          <div className={classes['form__col']}>
                            <label className="secondary--body" htmlFor="name">Recipient's Name</label>
                            <input type="text" id="name" className="secondary--body" />
                          </div>
                          <div className={classes['form__col']}>
                            <label className="secondary--body" htmlFor="message">Message</label>
                            <textarea type="text" id="message" name="message" maxlength="250" className="secondary--body" />
                            <p className="disclaimer">*Digital giftcard will be delivered to recipient via email one day after purchase and will include your gift message! </p>
                          </div>
                        </div>
                        <button type="submit" className="btn salmon">Add to Cart</button>
                      </form>
                  </div>}
                </div>
                
                {options &&
                  options.map((option, oIndex) => (
                    <div key={oIndex}>
                      <label htmlFor={`select-${oIndex}-${product.id}`}>
                        {option.name}
                      </label>
                      <select
                        id={`select-${oIndex}-${product.id}`}
                        onChange={($event) => handleOptionChange($event, option)}
                      >
                        {option.values.map((value, vIndex) => (
                          <option key={vIndex} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}


                {/* ACCORDION */}
                {deliveryDetailsList && <div className={classes['accordion']}>
                  <ProductAccordion header={accordionDescriptionHeader}  content={deliveryDetailsList} />
                  <ProductAccordion header={accordionDeliveryHeader}  content={deliveryDetailsList} />
                </div>}

               
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

  const page = await nacelleClient.content({
    handles: ['product']
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
