import {useEffect, useState, useRef} from 'react'
import { nacelleClient } from 'services'
import { CSSTransition } from 'react-transition-group'
import classes from './PDPDrawer.module.scss'
import { usePurchaseFlowContext } from '@/context/PurchaseFlowContext'
import { usePDPDrawerContext } from '@/context/PDPDrawerContext'

const PDPDrawer = ({product}) => {

  const purchaseFlowContext = usePurchaseFlowContext()
  const PDPDrawerContext = usePDPDrawerContext()
  const { content } = product
  const firstVariant = product.variants[0]

  const [drawerContent, setDrawerContent] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const nodeRef = useRef(null)
  const timeout = 250

  const closeDrawer = () => {
    setDrawerOpen(false)
    setTimeout(() => {
      PDPDrawerContext.setIsOpen(false)
    }, timeout)
  }

  const openDrawer = (productData) => {
    setDrawerContent(productData)
    setTimeout(() => {
      setDrawerOpen(true)
    }, timeout)
  }

  useEffect(() => {
    async function getDrawerData() {
      const type = product.content.handle === 'intro-box' ? 'introBoxDetailsDrawer' : 'subscriptionBoxDetailsDrawer'
      const productData = await nacelleClient.content({
        type: type
      })
      openDrawer(productData)
    }
    // only make api call if product data hasn't been requested and stored yet
    if (PDPDrawerContext.productManager.hasOwnProperty(product.content.handle)) {
      const productData = PDPDrawerContext.productManager[product.content.handle]
      openDrawer(productData)
    } else {
      getDrawerData()
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
              <h1>{content.title}</h1>
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