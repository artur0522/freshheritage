import { useRef, useEffect } from 'react'
import Link from 'next/link'
import ResponsiveImage from '@/components/ResponsiveImage'
import { PortableText } from '@portabletext/react'
import classes from './ChooseYourBox.module.scss'
import ContentSections from '@/components/Sections/ContentSections'
import PurchaseFlowHeader from '../PurchaseFlowHeader'
import { usePurchaseFlowContext } from '@/context/PurchaseFlowContext'
import { usePDPDrawerContext } from '@/context/PDPDrawerContext'
import { useAnalytics, useErrorLogging } from '@/hooks/index.js';

const ChooseYourBox = ({props, tierOptions}) => {

  const purchaseFlowContext = usePurchaseFlowContext()
  const PDPDrawerContext = usePDPDrawerContext()
  const inputRef = useRef()

  const myPortableTextComponents = {
    marks: {
      link: ({children, value}) => {
        const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined
        if (value.href.includes('expand=')) {
          var productHandle = value.href.slice(value.href.indexOf('expand=') + 'expand='.length)
          return (
            <a onClick={() => {
              const product = tierOptions.find(option => option.content.handle === productHandle)
              PDPDrawerContext.openDrawer(product)
            }}>
              {children}
            </a>
          )
        }
        return (
          <Link href={value.href}>
            <a rel={rel}>{children}</a>
          </Link>
        )
      }
    }
  }

  useEffect(() => {
    console.log('track membership_view_list',tierOptions)
    // can't call a hook from an effect: 
    // const trackEvent = useAnalytics();
    // trackEvent('membership_view_list');
    if(typeof window.gtag === 'function') {
      let item_list = tierOptions.map(item => {
        return {
          item_id: item.sourceEntryId.replace('gid://shopify/Product/', ''),
          item_name: item.content.title
        }
      })
      window.gtag('event', 'view_item_list', {
        'item_list_name': 'Membership Product List',
        'items': item_list
        });   
    }

  }, [])


  return (
    <>
      <div className={classes['choose-your-box']}>
        <div className="container">
          <PurchaseFlowHeader props={props} />
          <div className={classes['choose-your-box__tiers']}>
            <ul className={classes['choose-your-box__tier-list']}>
              {tierOptions.map(tier => {
                if (tier.content?.handle === 'sitka-seafood-intro-box') {
                  return ''
                }

                const product = tier;
                const firstVariant = tier.variants[0]
                const isPopular = tier.markAsMostPopular;
                return <li className={`${classes['choose-your-box__tier']}  ${isPopular ? classes['is-popular'] : ''} `} key={tier.sourceEntryId}>
                          <div className={classes['choose-your-box__tier-container']}>
                            <div className={classes['choose-your-box__tier-image']} >
                              <ResponsiveImage
                                src={product.content?.media[0].src}
                                alt={product.content?.media[0].altText || product.content?.title}
                                priority={true} />
                            </div>
                            <div className={classes['choose-your-box__tier-details']}>
                              <h2 className={`${classes['choose_your-box__tier-title']} h1`}>{product.content?.title.replace('Subscription', '')}</h2>
                              <div className={`${classes['choose-your-box__tier-price-pounds']} secondary--body`}>
                                <span>${firstVariant.price} / box</span>
                                <span>{firstVariant.weight} lbs</span>
                              </div>
                              {tier.content?.handle === 'premium-seafood-subscription-box' &&
                                <div className={classes['input-group']}>
                                  <input
                                    id="shellfish_free"
                                    type="checkbox"
                                    ref={inputRef}
                                    checked={purchaseFlowContext.options.shellfish_free_selected}
                                    onChange={() => {
                                      purchaseFlowContext.setOptions({
                                        ...purchaseFlowContext.options,
                                        shellfish_free_selected: inputRef.current.checked
                                      })
                                    }}
                                  />
                                  <label htmlFor="shellfish_free">Shellfish Free</label>
                                </div>
                              }
                              <button
                                onClick={() => purchaseFlowContext.selectBox(product, inputRef.current.checked)}
                                className="btn salmon">
                                  {props.tierCtaText}
                              </button>
                            </div>
                            <div className={classes['choose-your-box__tier-details-footer']}>
                              <button
                                onClick={() => PDPDrawerContext.openDrawer(product)}
                                className="btn-link-underline">
                                  {props.tierDetailsText}
                              </button>
                            </div>
                          </div>
                      </li>
              })}
            </ul>
          </div>
          {props.tierContent &&
            <div className={`${classes['choose-your-box__tier-content']}`}>
              <PortableText value={props.tierContent} components={myPortableTextComponents} />
            </div>
          }
        </div>
      </div>
      <ContentSections sections={props.content} />
    </>
  )
}

export default ChooseYourBox