import classes from './PurchaseFlowNavigation.module.scss';
import { usePurchaseFlowContext } from '@/context/PurchaseFlowContext'
import { useRouter } from 'next/router'

const PurchaseFlowNavigation = () => {
  const router = useRouter()
  const purchaseFlowContext = usePurchaseFlowContext()

  return (
    <div className={classes['purchase-flow__navigation']}>
      <ul className={classes['purchase-flow__nav-list']}>
        {purchaseFlowContext.options.step !== 2 ?
          <li className={classes['is-active']}>1</li>
        :
          <li onClick={() => router.back()}>1</li>
        }
        <li className={purchaseFlowContext.options.step === 2 ? classes['is-active'] : ''}>2</li>
        <li>3</li>
      </ul>
    </div>
  )
}

export default PurchaseFlowNavigation;