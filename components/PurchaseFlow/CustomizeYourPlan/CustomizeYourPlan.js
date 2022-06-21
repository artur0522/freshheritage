import classes from './CustomizeYourPlan.module.scss'
import PurchaseFlowHeader from '../PurchaseFlowHeader'
import MembershipOption from '../MembershipOption'
import { usePurchaseFlowContext } from '@/context/PurchaseFlowContext'

const CustomizeYourPlan = ({props}) => {
  const purchaseFlowContext = usePurchaseFlowContext()
  const membershipOptions = [props.regularOptions, props.prePaidOptions]
  return (
    <div className={classes['customize-your-plan']}>
      <div className="container">
        <PurchaseFlowHeader props={props} />
        <div className={classes['customize-your-plan__options']}>
          <ul className={classes['customize-your-plan__option-list']}>
            {purchaseFlowContext.options.product && membershipOptions.map((option, index) => {
              return <MembershipOption
                        key={index}
                        option={option}
                        membershipType={index === 0 ? 'regular' : 'prepaid'} />
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CustomizeYourPlan