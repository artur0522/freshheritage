import {useEffect, useState, useRef} from 'react'
import { CSSTransition } from 'react-transition-group'
import classes from './PDPDrawer.module.scss'
import { usePurchaseFlowContext } from '@/context/PurchaseFlowContext'
import { usePDPDrawerContext } from '@/context/PDPDrawerContext'

const PDPDrawer = ({box = undefined}) => {
  const purchaseFlowContext = usePurchaseFlowContext()
  const PDPDrawerContext = usePDPDrawerContext()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const nodeRef = useRef(null)
  const timeout = 200

  const product = box ? box.product : {}
  const boxDetails = box ? box.boxDetails : {}
  const firstVariant = product?.variants ? product.variants[0] : {}

  const closeDrawer = () => {
    setDrawerOpen(false)
    setTimeout(() => {
      PDPDrawerContext.dispatch({ type: 'close_drawer' })
    }, timeout)
  }

  useEffect(() => {
    if (PDPDrawerContext.activeProductHandle) {
      setTimeout(() => {
        setDrawerOpen(true)
      }, timeout)
    }
  }, [])

  return (
    <div className={classes['pdp-flyout']}>
      <div onClick={() => closeDrawer()} className={classes['pdp-flyout__overlay']}></div>
      <CSSTransition in={drawerOpen} timeout={timeout} nodeRef={nodeRef} unmountOnExit classNames={{
          'enter': classes['pdp-flyout__content--enter'],
          'enterActive': classes['pdp-flyout__content--enter-active'],
          'enterDone': classes['pdp-flyout__content--enter-done'],
          'exit': classes['pdp-flyout__content--exit'],
        }}>
          <div ref={nodeRef} className={classes['pdp-flyout__content']}>
            {/* add slider */}
            <div className={classes['product-details']}>
              <div className={classes['product-reviews']}></div>
              <h1>{boxDetails.title}</h1>
              <div className={classes['product-price-pounds']}>
                <span>${firstVariant.price} / box</span>
                <span>{firstVariant.weight} lbs</span>
                <button
                  onClick={() => purchaseFlowContext.selectBox(product)}
                  className="btn salmon">
                    Select & Customize Your Plan
                </button>
              </div>
              {/* seafood box details pulled from product description? */}
            </div>
          </div>
      </CSSTransition>
    </div>
  )
}

export default PDPDrawer