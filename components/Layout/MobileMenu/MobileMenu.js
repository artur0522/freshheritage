import {useRef} from 'react'
import Link from 'next/link'
import IconClose from '@/svgs/close.svg'
import classes from './MobileMenu.module.scss'
import { CSSTransition } from 'react-transition-group'

const MobileMenu = ({props, mobileMenuIsOpen, setMobileMenuIsOpen}) => {

  const {menuItems} = props.nonMemberPrimaryNavigation
  const navCTA = props.nonMemberCta
  const customerService = props.customerService
  const nodeRef = useRef(null)

  return (
    <CSSTransition in={mobileMenuIsOpen} timeout={250} nodeRef={nodeRef} unmountOnExit classNames={{
      'enter': classes.mobileMenuEnter,
      'enterActive': classes.mobileMenuEnterActive,
      'enterDone': classes.mobileMenuEnterDone,
      'exit': classes.mobileMenuExit,
    }}>
      <div ref={nodeRef} className={classes.mobileMenu}>
        <button
          onClick={() => setMobileMenuIsOpen(false)}
          className={classes.mobileMenuCloseBtn}><IconClose /></button>
        <div className="container">
          <div className={classes.mobileMenuSection}>
            <h1>Become A Sitka Seafood Member</h1>
            <p>Get premium, Wild-Caught Seafood From Alaska Fishermen To Your Doorstep.</p>
            <button className={[classes.mobileMainNavBtn, 'btn', 'salmon'].join(' ')}>
              {navCTA.nonMemberCtaText}
            </button>
          </div>
          <div className={classes.mobileMenuSection}>
            <ul>
              {menuItems.map(item => {
                return (
                  <li className={classes.mobilePrimaryNavItem} key={item._key}>
                    <Link href={item.linkUrl ? item.linkUrl : '/'}>
                      <a>{item.linkText}</a>
                    </Link>
                  </li>
                )
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