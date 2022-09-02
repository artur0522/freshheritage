import { useState, useEffect, useRef } from 'react'
import { useModalContext } from '@/context/ModalContext'
import { useSearchModalContext } from '@/context/SearchModalContext'
import { useCustomerContext } from '@/context/CustomerContext'
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext'
import { CSSTransition } from 'react-transition-group'
import { useMediaQuery } from 'react-responsive'
import Link from 'next/link'
import IconSearch from '@/svgs/search.svg'
import IconQuestion from '@/svgs/question-circle.svg'
import IconUser from '@/svgs/user.svg'
import IconCart from '@/svgs/cart.svg'
import { useRouter } from 'next/router'

const NavigationUtilities = ({props, classes}) => {

  const isDesktop = useMediaQuery(
    { minWidth: 1074 }
  )

  const router = useRouter()
  const modalContext = useModalContext()
  const customerContext = useCustomerContext()
  const checkoutContext = useHeadlessCheckoutContext()
  const searchModalContext = useSearchModalContext()

  const [mounted, setMounted] = useState(false)
  const [showCustomerServiceInfo, setShowCustomerServiceInfo] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const nodeRef = useRef(null)

  const navCTA = (customerContext.customer?.is_member) ? props.memberCta : props.nonMemberCta
  const customerService = props.customerService

  const { setSearchOpen } = searchModalContext

  const openSearchModal = () => {
    setSearchOpen(true)
  }

  const openAccountModal = (e) => {
    e.preventDefault()
    modalContext.setIsOpen(false)
    console.log(modalContext.isOpen)
    modalContext.setModalType('create')
    modalContext.setIsOpen(true)
  }

  useEffect(() => {
    isHovered ? setShowCustomerServiceInfo(true) : setShowCustomerServiceInfo(false)
  }, [isHovered])

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ul className={[classes.navItems, classes.navUtilities].join(' ')}>
      {mounted && isDesktop &&
        <>
          <li className={classes.navItem}>
            <Link href={navCTA.ctaUrl ? navCTA.ctaUrl : ''}>
              <a className={[classes.navButton, 'btn', 'salmon'].join(' ')}>
                {navCTA.ctaText}
              </a>
            </Link>
          </li>
          <li className={classes.navItem}><IconSearch onClick={() => openSearchModal()} /></li>
        </>
      }
      <li className={[classes.navItem, classes.navItemAccount].join(' ')}>
        {customerContext.customer ? (
          <Link href="/account">
            <a>
              <IconUser />
            </a>
          </Link>
        ): (
          <button className={classes.navIconButton} onClick={(e) => openAccountModal(e)}>
            <IconUser />
          </button>
        )}
      </li>
      {mounted && isDesktop &&
        <li
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={classes.navItem}>
            <IconQuestion />
            <CSSTransition in={customerService && showCustomerServiceInfo} timeout={125} nodeRef={nodeRef} unmountOnExit classNames={{
              'enter': classes.customerServiceInfoEnter,
              'enterActive': classes.customerServiceInfoEnterActive,
              'enterDone': classes.customerServiceInfoEnterDone,
              'exit': classes.customerServiceInfoExit,
            }}>
              <div ref={nodeRef} className={classes.customerServiceInfoModal}>
                <div className={classes.customerServiceInfoOverlay}></div>
                <div
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className={classes.customerServiceInfo}>
                  <div className={classes.customerServiceInfoContent}>
                    <h4>{customerService.header}</h4>
                    <p>{customerService.subheader}</p>
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
        </li>
      }
      <li
        onClick={() => {
          checkoutContext.setFlyoutState(true)
          if (router.pathname === '/checkout') {
            return
          }
        }}
        className={classes.navItem}>
          <IconCart />
      </li>
    </ul>
  )
}

export default NavigationUtilities