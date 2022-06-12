import { useState } from 'react'
import Image from 'next/image'
import { useCart } from '@nacelle/react-hooks'
import { nacelleClient } from 'services'
import { getSelectedVariant } from 'utils/getSelectedVariant'
import { getCartVariant } from 'utils/getCartVariant'
import ContentSections from '@/components/ContentSections'
import ProductReviewStars from '../../components/Product/ProductReviewStars'
import ProductSlider from '../../components/Product/ProductSlider'
import IconPlus from '@/svgs/plus.svg'

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

  const handleCheckbox = () => {
    setChecked(!checked);
  };

  let options = null
  if (product?.content?.options?.some((option) => option.values.length > 1)) {
    options = product?.content?.options
  }

  const productAccordionHeaders = page[0].fields.content.find(block => block._type === 'productAccordionHeaders')
  const accordionDeliveryHeader = productAccordionHeaders.details
  const accordionDescriptionHeader = productAccordionHeaders.description
  const deliveryDetails = product.metafields.find(metafield => metafield.key === 'delivery_details')
  const deliveryDetailsList = JSON.parse(deliveryDetails.value)

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
        <div className={`${classes['product__inner']}`}>
            <div className={`container`}>
              <ProductSlider product={product} />
              <ProductReviewStars />
              <div className={classes['main']}>
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




                <div className={classes['gift']}>
                  <div className={classes['gift__check']}>
                    <input
                      id="giftCheck"
                      type="checkbox"
                      checked={checked}
                      onChange={handleCheckbox}
                    />
                    <label htmlFor="giftCheck" className="heading--label">
                      This is a Gift
                    </label>
                  </div>
                  <div className={classes['gift__info']}>
                      <h4>Recipient's Information</h4>
                      <form>
                        <div className={classes['form__col']}>
                          <label className="secondary--body" htmlFor="email">Email Address</label>
                          <input type="email" id="email" className="secondary--body" />
                        </div>
                        <div className={classes['form__col']}>
                          <label className="secondary--body" htmlFor="name">Recipient's Name</label>
                          <input type="text" id="name" className="secondary--body" />
                        </div>
                        <button type="submit" className="btn salmon">Add to Cart</button>
                      </form>
                  </div>
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

                <div className={classes['accordion']}>
                  <div className={classes['accordion__row']}>
                    <button className="h4">
                      <span>{accordionDescriptionHeader}</span>
                      <IconPlus />
                    </button>
                  </div>
                  <div className={classes['accordion__row']}>
                    <button className="h4">
                      <span>{accordionDeliveryHeader}</span>
                      <IconPlus />
                    </button>
                    <ul className={classes['accordion__content']}>
                      {deliveryDetailsList.map((listItem) => {
                        return (
                          <li>{listItem}</li>
                        )
                      })}
                    </ul>
                  </div>
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
