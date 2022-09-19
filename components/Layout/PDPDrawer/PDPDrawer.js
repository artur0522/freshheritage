import {useEffect, useMemo, useState, useRef} from 'react'
import { CSSTransition } from 'react-transition-group'
import classes from './PDPDrawer.module.scss'
import { usePDPDrawerContext } from '@/context/PDPDrawerContext'
import ProductMain from '@/components/Product/ProductMain'
import ProductStamps from '@/components/Product/ProductStamps'
import ProductDetailsList from '@/components/Product/ProductDetailsList'
import FAQs from '@/components/Sections/FAQs'
import IconClose from '@/svgs/close.svg'
import ProductHarvests from '@/components/Product/ProductHarvests'
import { useAnalytics, useErrorLogging } from '@/hooks/index.js';
import { dataLayerViewProduct } from '@/utils/dataLayer'

const PDPDrawer = ({box = undefined}) => {
  const PDPDrawerContext = usePDPDrawerContext()

  const product = useMemo(() => box ? box.product : {}, [box])
  const boxDetails = useMemo(() => box ? box.boxDetails?.fields : {}, [box])

  const [drawerOpen, setDrawerOpen] = useState(false)
  const nodeRef = useRef(null)
  const timeout = 200

  const closeDrawer = () => {
    setDrawerOpen(false)
    setTimeout(() => {
      PDPDrawerContext.dispatch({ type: 'close_drawer' })
    }, timeout)
  }


  useEffect(() => {
    if (Object.keys(product).length > 0 && Object.keys(boxDetails).length > 0) {
      setTimeout(() => {
        setDrawerOpen(true)

        // console.log('drawer open',product)
        // can't call a hook from an effect:

        // const trackEvent = useAnalytics();
        // trackEvent('view_product',product);
        if(typeof window.gtag === 'function') {
          window.gtag('event', 'view_item', {
            'currency': 'USD',
            'value': product.variants[0].price,
            'items': [ {
              'item_id': product.sourceEntryId.replace('gid://shopify/Product/', ''),
              'item_name': product.content.title
              } ]
            });

          window.gtag('event', 'page_view', {
            'page_title': product.content.title,
            'page_path': '/pages/choose-your-plan?expand='+product.content.handle
            });
        }

        if (sessionStorage.getItem("referrer")?.includes('facebook') || sessionStorage.getItem("utm_source") === 'facebook' || sessionStorage.getItem("utm_source") === 'fb' || sessionStorage.getItem("utm_source") === 'ig'){
          fbEvent({
            eventName: 'ViewContent',
            products: [{
              sku: product.sourceEntryId.replace('gid://shopify/Product/', ''),
              quantity: 1,
            }],
            value: product.variants[0].price,
            currency: 'USD',
            enableStandardPixel: false
          });
        }

        dataLayerViewProduct({product})

      }, timeout)
    }
  }, [box, boxDetails, product])

  return (
    <div className={`${classes['pdp-flyout']} pdp-flyout`}>
      <div onClick={() => closeDrawer()} className={classes['pdp-flyout__overlay']}></div>
      <CSSTransition in={drawerOpen} timeout={timeout} nodeRef={nodeRef} unmountOnExit classNames={{
          'enter': classes['pdp-flyout__content--enter'],
          'enterActive': classes['pdp-flyout__content--enter-active'],
          'enterDone': classes['pdp-flyout__content--enter-done'],
          'exit': classes['pdp-flyout__content--exit'],
        }}>
          <div ref={nodeRef} className={classes['pdp-flyout__content']}>
            <button
              onClick={() => closeDrawer()}
              className={classes['pdp-flyout__close-btn']}><IconClose /></button>
            <div className={classes['product']}>
              {Object.keys(product).length > 0 && Object.keys(boxDetails).length > 0 &&
                <ProductMain box={box} timeout={timeout} />
              }
              {!!boxDetails.details &&
                <ProductDetailsList fields={boxDetails.details} expandOnLoad={true} />
              }
              {!!boxDetails.badges &&
                <ProductStamps fields={boxDetails.badges} product={product} />
              }
              <ProductHarvests product={product} />
              <FAQs fields={boxDetails.membershipInfo} parentClasses={'pdp-drawer__faq'} />
              <FAQs fields={boxDetails.faqs} parentClasses={'pdp-drawer__faq'}  />
            </div>
          </div>
      </CSSTransition>
    </div>
  )
}

export default PDPDrawer