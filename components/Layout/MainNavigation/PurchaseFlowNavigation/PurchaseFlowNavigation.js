import classes from './PurchaseFlowNavigation.module.scss';
import { usePurchaseFlowContext } from '@/context/PurchaseFlowContext'

const PurchaseFlowNavigation = ({props}) => {

  const purchaseFlowContext = usePurchaseFlowContext()

  const goBack = () => {
    purchaseFlowContext.setOptions({
      ...purchaseFlowContext.options,
      step: 1
    })
  }

  return (
    <div className={classes['purchase-flow__navigation']}>
      <ul className={classes['purchase-flow__nav-list']}>
        <li onClick={() => goBack()} className={purchaseFlowContext.options.step === 1 ? classes['is-active'] : ''}>1</li>
        <li className={purchaseFlowContext.options.step === 2 ? classes['is-active'] : ''}>2</li>
        <li>3</li>
      </ul>
    </div>
  )
}

export default PurchaseFlowNavigation;