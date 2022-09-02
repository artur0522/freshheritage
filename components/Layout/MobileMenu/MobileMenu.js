import {useRef} from 'react'
import Link from 'next/link'
import IconClose from '@/svgs/close.svg'
import classes from './MobileMenu.module.scss'
import { CSSTransition } from 'react-transition-group'
import { useCustomerContext } from '@/context/CustomerContext'
import { useHeaderContext } from '@/context/HeaderContext'
import { useTheCatchContext } from '@/context/TheCatchContext'

const MobileMenu = ({props, pageHandle}) => {

  let navigationType;

  if (pageHandle === 'purchase-flow' || 'checkout') {
    navigationType = pageHandle
  }

  const customerContext = useCustomerContext()
  const theCatchContext = useTheCatchContext()
  const { customer } = customerContext
  const { mobileMenuIsOpen, setMobileMenuIsOpen } = useHeaderContext()
  const {menuItems} = (customerContext.customer?.is_member || customerContext.customer?.is_sustainer) ? props.memberPrimaryNavigation : props.nonMemberPrimaryNavigation
  const navCTA = (customerContext.customer?.is_member) ? props.memberCta : props.nonMemberCta
  const customerService = props.customerService
  const nodeRef = useRef(null)
  const { monthName, year } = theCatchContext

  let theCatchUrl = `/the-catch/premium-seafood-box-${monthName}-${year}`
  if (customer) {
    if (customer.tags.includes('PS') || customer.tags.includes('PSWS')) {
      theCatchUrl = `/the-catch/premium-seafood-box-${monthName}-${year}`
    } else if (customer.tags.includes('SF') || customer.tags.includes('SF-BI')) {
      theCatchUrl = `/the-catch/seafood-box-${monthName}-${year}`
    } else if (customer.tags.includes('S')) {
      theCatchUrl = `/the-catch/salmon-box-${monthName}-${year}`
    }
  }

  return (
    <CSSTransition in={mobileMenuIsOpen} timeout={250} nodeRef={nodeRef} unmountOnExit classNames={{
      'enter': classes.mobileMenuEnter,
      'enterActive': classes.mobileMenuEnterActive,
      'enterDone': classes.mobileMenuEnterDone,
      'exit': classes.mobileMenuExit,
    }}>
      <div ref={nodeRef} className={`${classes.mobileMenu} ${navigationType ? classes[navigationType] : '' }`}>
        <button
          onClick={() => setMobileMenuIsOpen(false)}
          className={classes.mobileMenuCloseBtn}><IconClose /></button>
        <div className="container">
          <div className={classes.mobileMenuSection}>
            <h1>Become A Sitka Seafood Member</h1>
            <p>Get premium, Wild-Caught Seafood From Alaska Fishermen To Your Doorstep.</p>
            <Link href={navCTA.ctaUrl ? navCTA.ctaUrl : ''}>
              <a className={[classes.mobileMainNavBtn, 'btn', 'salmon'].join(' ')}>
                {navCTA.ctaText}
              </a>
            </Link>
          </div>
          <div className={classes.mobileMenuSection}>
            <ul>
              {menuItems.map(item => {
                  if(item.linkText === 'The Catch') {
                    return (
                      <li className={classes.mobilePrimaryNavItem} key={item._key}>
                        <Link href={theCatchUrl || '/'}>
                          <a>{item.linkText}</a>
                        </Link>
                      </li>
                    )
                  } else {
                    return (
                      <li className={classes.mobilePrimaryNavItem} key={item._key}>
                        <Link href={item.linkUrl ? item.linkUrl : '/'}>
                          <a>{item.linkText}</a>
                        </Link>
                      </li>
                    )
                  }
              })}
            </ul>
          </div>
          <div className={classes.mobileMenuSection}>
            <ul>
              {customerService.customerServiceNavigation.menuItems.map(item => {
                return <li key={item._key}>
                  <Link href={item.linkUrl ? item.linkUrl : ''}>
                    <a>{item.linkText}</a>
                  </Link>
                </li>
              })}
            </ul>
          </div>
        </div>
      </div>
    </CSSTransition>
  )
}

export default MobileMenu