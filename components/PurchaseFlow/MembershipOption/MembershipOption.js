import { useState } from 'react'
import Expand from 'react-expand-animated'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import IconSelectArrow from '@/svgs/select-arrow.svg'
import classes from './MembershipOption.module.scss'
import { useMediaQuery } from 'react-responsive'
import { usePurchaseFlowContext } from '@/context/PurchaseFlowContext'
import IconMinus from '@/svgs/minus.svg'
import IconPlus from '@/svgs/plus.svg'

const MembershipOption = ({option, selectedVariant, setSelectedVariant}) => {

  const purchaseFlowContext = usePurchaseFlowContext()

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
                <span>${selectedVariant.price}</span>
                <span>Per Month / Billed Monthly</span>
                {/* above needs to be pulled by variant metafield */}
              </div>
              {option.savingsText &&
                <div className={classes['membership-option__savings-text']}>{option.savingsText}</div>
              }
            </div>
          }
          {purchaseFlowContext.options.product &&
            <Dropdown
              className="dropdown-selector"
              options={purchaseFlowContext.options.product.variants.map(variant => variant.content.title)}
              // onChange={this._onSelect}
              value={purchaseFlowContext.options.product.variants[0].content.title}
              arrowClosed={<IconSelectArrow className="dropdown-selector__arrow-closed" />}
              arrowOpen={<IconSelectArrow className="dropdown-selector__arrow-open" />}
            />
          }
          <button className="btn salmon">{option.ctaText}</button>
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