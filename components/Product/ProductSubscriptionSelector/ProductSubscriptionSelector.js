import { useEffect, useState } from 'react'
import Dropdown from 'react-dropdown'
import IconSelectArrow from '@/svgs/select-arrow.svg'
import classes from './ProductSubscriptionSelector.module.scss';
import { getSubscriptionInfo } from '@/utils/getSubscriptionInfo'
import { getVariantByOptions } from '@/utils/getVariantByOptions'

function buildSelectors(allProducts) {
 return allProducts.reduce((carry, product) => {
    const productHandle = product.content.handle
    const productObj = {
      product,
      boxOption: {
        value: productHandle,
        label: product.content.title
      },
      frequencyOptions: [],
      shipmentsOptions: [] // prepaid options
    }
    if (product.content.handle === 'sitka-seafood-intro-box') {
      productObj.frequencyOptions = ['Monthly']
    } else {
      productObj.frequencyOptions = product.content?.options.find(option => option.name === 'frequency').values
    }
    let subscriptionGroup = product.metafields.find(metafield => metafield.key === 'subscription_group')
    if (subscriptionGroup) {
      subscriptionGroup = JSON.parse(subscriptionGroup.value)
      productObj.shipmentsOptions = subscriptionGroup.prepaid_options.map(option => option.duration)
    }
    carry[productHandle] = productObj
    return carry
  }, {})
}

const ProductSubscriptionSelector = ({selectedVariant, setSelectedVariant, allProducts, product, onSelectProduct}) => {

  const selectors = buildSelectors(allProducts)
  const [shipmentSelected, setShipmentSelected] = useState(selectors[selectedVariant.productHandle].shipmentsOptions[0])

  const options = Object.keys(selectors).map(key => {
    return selectors[key].boxOption
  })

  useEffect(() => {
    setShipmentSelected(selectors[selectedVariant.productHandle].shipmentsOptions[0])
  }, [product])

  return (
    <ul className={classes['product-subscription-selector']}>
      {/* Box Option */}
      <li className={`${classes['product-subscription-selector__item']} ${classes['flex-column']}`}>
        <h2 className="heading__pdp-label"><span>1</span> Box Option</h2>
        <Dropdown
          className={`dropdown-selector`}
          options={options.map(option => option)}
          onChange={(e) => onSelectProduct(e)}
          value={options.find(option => option.value === selectedVariant.productHandle)}
          arrowClosed={<IconSelectArrow className="dropdown-selector__arrow-closed" />}
          arrowOpen={<IconSelectArrow className="dropdown-selector__arrow-open" />}
        />
      </li>
      {/* Frequency */}
      <li className={classes['product-subscription-selector__item']}>
        <h2 className="heading__pdp-label"><span>2</span> Frequency</h2>
        <ul>
          {selectors[selectedVariant.productHandle].frequencyOptions.map((option, index) => {
            const selectedFrequencyName = (selectedVariant.productHandle === 'sitka-seafood-intro-box') ?
              selectors[selectedVariant.productHandle].frequencyOptions[0] : selectedVariant.content.selectedOptions.find(option => option.name === 'frequency').value

            const onSelectVariant = (value) => {
              const variant = getVariantByOptions({
                variants: product.variants,
                matchOptionValue: value,
              })
              setSelectedVariant(variant)
            }

            return <li className={classes['subscription-selector__frequency-item']} key={index}>
              <button
                onClick={() => onSelectVariant(option)}
                className={`${classes['subscription-selector__frequency-item-btn']} btn ${selectedFrequencyName === option ? 'sitkablue' : 'pureWhite' }`}>
                {option}
              </button>
            </li>
          })}
        </ul>
      </li>
      {/* Shipments */}
      <li className={classes['product-subscription-selector__item']}>
        <h2 className="heading__pdp-label"><span>3</span> Shipments</h2>
        <ul>
          {selectors[selectedVariant.productHandle].shipmentsOptions.map((option, index) => {
            return <li className={classes['subscription-selector__shipment-item']} key={index}>
              <button
                onClick={() => setShipmentSelected(option)}
                className={`${classes['subscription-selector__shipment-item-btn']} btn ${shipmentSelected === option ? 'sitkablue' : 'pureWhite' }`}>
                {option}
              </button>
            </li>
          })}
        </ul>
      </li>
      {/* Recipient's Information */}
      <li className={classes['product-subscription-selector__item']}>
        <h2 className="heading__pdp-label"><span>4</span> {`Recipient's Information`}</h2>
      </li>
    </ul>
  )
}

export default ProductSubscriptionSelector