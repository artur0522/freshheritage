import { useEffect, useState, useRef } from 'react'
import Dropdown from 'react-dropdown'
import IconSelectArrow from '@/svgs/select-arrow.svg'
import classes from './ProductGiftSubForm.module.scss'
import { getSubscriptionInfo } from '@/utils/getSubscriptionInfo'
import { getVariantByOptions } from '@/utils/getVariantByOptions'
import LoadingState from '@/components/LoadingState'
import { getCartVariant } from '@/utils/getCartVariant'
import { getMetafield } from '@/utils/getMetafield'
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext'

function buildSelectors(allProducts) {
 return allProducts.reduce((carry, product) => {
    const productHandle = product.content.handle
    const selectorDetailsMetafield = getMetafield({product, key: 'selector_details'})
    const productObj = {
      product,
      boxOption: {
        value: productHandle,
        label: <div className={classes['subscription-selector__product-selector-details']}><span>{product.content.title}</span> {selectorDetailsMetafield && <span> • {selectorDetailsMetafield.value}</span>} </div>
      },
      frequencyOptions: [],
      shipmentsOptions: [] // prepaid options
    }
    productObj.frequencyOptions = product.content?.options.find(option => option.name === 'frequency').values
    let subscriptionGroup = product.metafields.find(metafield => metafield.key === 'subscription_group')
    if (subscriptionGroup) {
      subscriptionGroup = JSON.parse(subscriptionGroup.value)
      productObj.shipmentsOptions = subscriptionGroup.prepaid_options.map(option => option.duration)
    }
    carry[productHandle] = productObj
    return carry
  }, {})
}

const ProductGiftSubForm = ({selectedVariant, setSelectedVariant, allProducts, product, onSelectProduct}) => {

  const { addItemToOrder } = useHeadlessCheckoutContext()
  const selectors = buildSelectors(allProducts)
  const [shipmentSelected, setShipmentSelected] = useState(selectors[selectedVariant.productHandle].shipmentsOptions[0])
  const [isLoading, setIsLoading] = useState(false)
  const options = Object.keys(selectors).map(key => {
    return selectors[key].boxOption
  })

  const emailRef = useRef()
  const nameRef = useRef()
  const shellfishFreeInputRef = useRef()

  const handleAddItem = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    const variant = getCartVariant({
      product: product,
      variant: selectedVariant
    })

    let subscriptionProperties = {}
    let subscriptionGroup = product.metafields.find(metafield => metafield.key === 'subscription_group')
    const frequency = selectedVariant.content.selectedOptions.find(option => option.name === 'frequency')

    if (subscriptionGroup) {
      subscriptionGroup = JSON.parse(subscriptionGroup.value)
      // console.log("subscriptionGroup:", subscriptionGroup)
      subscriptionProperties = getSubscriptionInfo({
        subscriptionGroup,
        frequencyName: frequency.value,
        membershipType: 'prepaid',
        duration: shipmentSelected
      })
    }

    const giftProperties = {}

    if (emailRef.current.value && nameRef.current.value) {
      giftProperties = {
        is_gift_order: 'true',
        recipient_name: emailRef.current.value,
        recipient_email: nameRef.current.value,
      }
    }

    await addItemToOrder({
      variant: variant,
      properties: {
        ...giftProperties,
        ...subscriptionProperties,
        membership_type: 'prepaid',
        shipments: shipmentSelected.toString()
      },
      open_flyout: true
    }).then(() => {
      setIsLoading(false)
    })
  }

  const onSelectVariant = (value) => {
    const variant = getVariantByOptions({
      variants: product.variants,
      matchOptionValue: value,
      purchaseFlowOptions: {
        productHandle: selectedVariant.productHandle,
        shellfish_free_selected: (shellfishFreeInputRef.current) ? shellfishFreeInputRef.current.checked : undefined
      }
    })
    setSelectedVariant(variant)
  }

  useEffect(() => {
    setShipmentSelected(selectors[selectedVariant.productHandle].shipmentsOptions[0])
  }, [product])

  return (
    <form onSubmit={(e) => handleAddItem(e)} className={classes['product-gift-subscription-form']}>
      <ul className={classes['product-subscription-selector']}>
        {/* Box Option */}
        <li className={`${classes['product-subscription-selector__item']} ${classes['flex-column']}`}>
          <h2 className="heading__pdp-label"><span className={classes['product-subscription-selector__item-step']}>1</span> Box Option</h2>
          <Dropdown
            className={`dropdown-selector`}
            options={options.map(option => option)}
            onChange={(e) => onSelectProduct(e)}
            value={options.find(option => option.value === selectedVariant.productHandle)}
            arrowClosed={<IconSelectArrow className="dropdown-selector__arrow-closed" />}
            arrowOpen={<IconSelectArrow className="dropdown-selector__arrow-open" />}
          />
          {product.content?.handle === 'premium-seafood-subscription-box' &&
            <div className={classes['shellfish-free-input']}>
              <div className="input-group input-group--checkbox">
                <input
                  className="input"
                  id="shellfish_free"
                  type="checkbox"
                  ref={shellfishFreeInputRef}
                  onChange={() => {
                    const frequency = selectedVariant.content.selectedOptions.find(option => option.name === 'frequency')
                    onSelectVariant(frequency.value)
                  }}
                />
                <label htmlFor="shellfish_free">Shellfish Free</label>
              </div>
            </div>
          }
        </li>
        {/* Frequency */}
        <li className={`${classes['product-subscription-selector__item']} ${classes['product-subscription-selector__frequency']}`}>
          <h2 className="heading__pdp-label"><span className={classes['product-subscription-selector__item-step']}>2</span> Frequency</h2>
          <ul>
            {selectors[selectedVariant.productHandle].frequencyOptions.map((option, index) => {
              const selectedFrequencyName = selectedVariant.content.selectedOptions.find(option => option.name === 'frequency').value
              return <li className={classes['subscription-selector__frequency-item']} key={index}>
                <button
                  type="button"
                  onClick={() => onSelectVariant(option)}
                  className={`${classes['subscription-selector__frequency-item-btn']} btn ${selectedFrequencyName === option ? 'sitkablue' : 'pureWhite' }`}>
                  {option}
                </button>
              </li>
            })}
          </ul>
        </li>
        {/* Shipments */}
        <li className={`${classes['product-subscription-selector__item']} ${classes['product-subscription-selector__shipment']}`}>
          <h2 className="heading__pdp-label"><span className={classes['product-subscription-selector__item-step']}>3</span> Shipments</h2>
          <ul>
            {selectors[selectedVariant.productHandle].shipmentsOptions.map((option, index) => {
              return <li className={classes['subscription-selector__shipment-item']} key={index}>
                <button
                  type="button"
                  onClick={() => {setShipmentSelected(option)}}
                  className={`${classes['subscription-selector__shipment-item-btn']} btn ${shipmentSelected === option ? 'sitkablue' : 'pureWhite' }`}>
                  <span>{option} boxes</span>
                  {option >= 12 && <p>3% Discount</p>}
                </button>
              </li>
            })}
          </ul>
        </li>
        {/* Recipient's Information */}
        <li className={`${classes['product-subscription-selector__item']} ${classes['flex-column']}`}>
          <h2 className="heading__pdp-label"><span className={classes['product-subscription-selector__item-step']}>4</span> {`Recipient's Information`}</h2>
          <div className={classes['product-subscription-selector__recipient-fields']}>
            <div className="input-group--wrapper">
              <div className="input-group">
                <label className="label label--block secondary--body">Email Address</label>
                <input className="input" type="email" placeholder="recipient@email.com" ref={emailRef} required />
              </div>
              <div className="input-group">
                <label className="label label--block secondary--body">Recipient Name</label>
                <input className="input" type="text" placeholder="Recipient Name" ref={nameRef} required />
              </div>
            </div>
          </div>
        </li>
      </ul>
      <button type="submit" disabled={isLoading} className="btn salmon">
        {isLoading ? <LoadingState /> : 'Add to Cart'}
      </button>
    </form>
  )
}

export default ProductGiftSubForm