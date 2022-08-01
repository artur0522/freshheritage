import { useState } from 'react'
import Expand from 'react-expand-animated'
import Dropdown from 'react-dropdown'
import IconSelectArrow from '@/svgs/select-arrow.svg'
import classes from './MembershipOption.module.scss'
import { useMediaQuery } from 'react-responsive'
import { usePurchaseFlowContext } from '@/context/PurchaseFlowContext'
import IconMinus from '@/svgs/minus.svg'
import IconPlus from '@/svgs/plus.svg'
import { getVariantByOptions } from '@/utils/getVariantByOptions'
import LoadingState from '@/components/LoadingState'

const MembershipOption = ({option, membershipType}) => {
  const purchaseFlowContext = usePurchaseFlowContext()

  const [selectedVariant, setSelectedVariant] = useState(purchaseFlowContext.options.product.variants[0])
  const [isLoading, setIsLoading] = useState(false)

  const { product } = purchaseFlowContext.options
  const { variants } = product;

  const membershipText = selectedVariant.metafields.find(metafield => metafield.key === `${membershipType}_membership_text`)
  const frequencyOptions = product.content?.options.find(option => option.name === 'frequency').values
  const variantPrice = membershipType === 'prepaid' ? (selectedVariant.price * .97).toFixed(2) : selectedVariant.price

  const handleMediaQueryChange = (matches) => {
    if (matches) setHeight('auto')
    if (!matches) setHeight(0)
  }

  const isDesktop = useMediaQuery(
    { minWidth: 768 }, undefined, handleMediaQueryChange
  )
  const [height, setHeight] = useState(isDesktop ? 'auto' : 0)

  const toggleExpand = () => {
    if (isDesktop) {
      return false
    }
    height === 0 ? setHeight('auto') : setHeight(0)
  }

  const onSelectVariant = ({value}) => {
    const variant = getVariantByOptions({
      variants,
      matchOptionValue: value,
      purchaseFlowOptions: purchaseFlowContext.options
    })
    setSelectedVariant(variant)
  }

  return (
    <li className={classes['membership-option']}>
      <div className={classes['membership-option__container']}>
        {option.promoFlag &&
          <span className={classes['membership-option__promo-flag']}>{option.promoFlag}</span>
        }
        <div className={classes['membership-option__details']}>
          <h2 className={`${classes['membership-option__title']} h1`}>{option.header}</h2>
          {selectedVariant &&
            <div className={classes['membership-option__price-wrap']}>
              <div className={classes['membership-option__price']}>
                <span>${variantPrice}</span>
                <span>{membershipText.value}</span>
              </div>
              {option.savingsText &&
                <div className={classes['membership-option__savings-text']}>{option.savingsText}</div>
              }
            </div>
          }
          {product &&
            <Dropdown
              className={`dropdown-selector`}
              options={frequencyOptions.map(option => option)}
              onChange={(e) => onSelectVariant(e)}
              value={frequencyOptions[0]}
              arrowClosed={<IconSelectArrow className="dropdown-selector__arrow-closed" />}
              arrowOpen={<IconSelectArrow className="dropdown-selector__arrow-open" />}
            />
          }
          <button
            onClick={() => {
              setIsLoading(true)
              purchaseFlowContext.selectMembershipPlan(selectedVariant, membershipType)
            }}
            disabled={isLoading}
            className="btn salmon">
              {isLoading ? <LoadingState /> : option.ctaText}
          </button>
          {!isDesktop &&
            <button onClick={() => toggleExpand()} className={`${classes['membership-option__toggle-btn']} btn-link-underline`}>
              <span>{option.toggleValuePropsCtaText}</span>
              {height !== 0 && !isDesktop ? (
                <IconMinus />
              ) :(
                <IconPlus />
              )}
            </button>
          }
          <Expand open={height !== 0} duration={300}>
            <ul className={classes['membership-value__props']}>
              {option.valueProps.map((item, index) => {
                return <li key={index}>{item}</li>
              })}
            </ul>
          </Expand>
        </div>
      </div>
  </li>
  )
}

export default MembershipOption