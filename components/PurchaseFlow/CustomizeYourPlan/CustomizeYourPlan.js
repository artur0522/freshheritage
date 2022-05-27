import { useState, useEffect } from 'react'
import classes from './CustomizeYourPlan.module.scss'
import PurchaseFlowHeader from '../PurchaseFlowHeader'
import { usePurchaseFlowContext } from '@/context/PurchaseFlowContext'
import MembershipOption from '../MembershipOption'

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
              return <MembershipOption key={index} option={option} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} />
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CustomizeYourPlan