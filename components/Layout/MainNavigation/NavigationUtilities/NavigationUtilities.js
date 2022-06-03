import { useState, useEffect, useRef } from 'react'
import { useModalContext } from '@/context/ModalContext'
import { useCustomerContext } from '@/context/CustomerContext'
import { CSSTransition } from 'react-transition-group'
import { useMediaQuery } from 'react-responsive'
import Link from 'next/link'
import IconSearch from '@/svgs/search.svg'
import IconQuestion from '@/svgs/question-circle.svg'
import IconUser from '@/svgs/user.svg'
import IconCart from '@/svgs/cart.svg'

const NavigationUtilities = ({props, classes}) => {

  const isDesktop = useMediaQuery(
    { minWidth: 1074 }
  )

  const modalContext = useModalContext()
  const customerContext = useCustomerContext()

  const [showCustomerServiceInfo, setShowCustomerServiceInfo] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const nodeRef = useRef(null)

  const navCTA = (customerContext.customer?.is_member) ? props.memberCta : props.nonMemberCta
  const customerService = props.customerService

  const openAccountModal = (e) => {
    e.preventDefault()
    modalContext.setModalType('create')
    modalContext.setIsOpen(true)
  }

  useEffect(() => {
    isHovered ? setShowCustomerServiceInfo(true) : setShowCustomerServiceInfo(false)
  }, [isHovered])

  return (
    <ul className={[classes.navItems, classes.navUtilities].join(' ')}>
      {isDesktop &&
        <>
          <li className={classes.navItem}>
            <Link href={navCTA.ctaUrl ? navCTA.ctaUrl : ''}>
              <a className={[classes.navButton, 'btn', 'salmon'].join(' ')}>
                {navCTA.ctaText}
              </a>
            </Link>
          </li>
          <li className={classes.navItem}><IconSearch /></li>
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
      {isDesktop &&
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
      <li className={classes.navItem}><IconCart /></li>
    </ul>
  )
}

export default NavigationUtilities