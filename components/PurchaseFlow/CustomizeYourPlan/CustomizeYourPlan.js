import classes from './CustomizeYourPlan.module.scss'
import PurchaseFlowHeader from '../PurchaseFlowHeader'

const CustomizeYourPlan = ({props}) => {
  return (
    <div className={classes['customize-your-plan']}>
      <PurchaseFlowHeader props={props} />
    </div>
  )
}

export default CustomizeYourPlan