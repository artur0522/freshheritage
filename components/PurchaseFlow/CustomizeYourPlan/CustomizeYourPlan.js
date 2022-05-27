import { useState, useEffect } from 'react'
import classes from './CustomizeYourPlan.module.scss'
import PurchaseFlowHeader from '../PurchaseFlowHeader'
import { usePurchaseFlowContext } from '@/context/PurchaseFlowContext'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import IconSelectArrow from '@/svgs/select-arrow.svg'

const CustomizeYourPlan = ({props}) => {

  const purchaseFlowContext = usePurchaseFlowContext()
  const membershipOptions = [props.regularOptions, props.prePaidOptions]

  const [selectedVariant, setSelectedVariant] = useState(null)

  useEffect(() => {
    if (purchaseFlowContext.options.product) {
      setSelectedVariant(purchaseFlowContext.options.product.variants[0])
    }
  }, [purchaseFlowContext.options.product])

  return (
    <div className={classes['customize-your-plan']}>
      <div className="container">
        <PurchaseFlowHeader props={props} />
        <div className={classes['customize-your-plan__options']}>
          <ul className={classes['customize-your-plan__option-list']}>
            {membershipOptions.map((option, index) => {
              return <li key={index} className={classes['customize-your-plan__option']}>
                        <div className={classes['customize-your-plan__option-container']}>
                          {option.promoFlag &&
                            <span className={classes['customize-your-plan__option-promo-flag']}>{option.promoFlag}</span>
                          }
                          <div className={classes['customize-your-plan__option-details']}>
                            <h2 className={`${classes['customize-your-plan__option-title']} h1`}>{option.header}</h2>
                            {selectedVariant &&
                              <div className={classes['customize-your-plan__option-price-wrap']}>
                                <div className={classes['customize-your-plan__option-price']}>
                                  <span>${selectedVariant.price}</span>
                                  <span>Per Month / Billed Monthly</span>
                                  {/* above needs to be pulled by variant metafield */}
                                </div>
                                {option.savingsText &&
                                  <div className={classes['customize-your-plan__option-savings-text']}>{option.savingsText}</div>
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
                            <ul className={classes['customize-your-plan__value-props']}>
                              {option.valueProps.map((item, index) => {
                                return <li key={index}>{item}</li>
                              })}
                            </ul>
                          </div>
                        </div>
                    </li>
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CustomizeYourPlan