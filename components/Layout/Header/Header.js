import { useState, useEffect, useRef } from 'react'
import PrimaryAnnouncement from '../PrimaryAnnouncement'
import MainNavigation from '../MainNavigation'
import MobileMenu from '../MobileMenu'
import Router from 'next/router'

import classes from './Header.module.scss'

const Header = ({ content, pageHandle }) => {

  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false)
  const [hide, setHide] = useState(false)
  const oldScrollYPosition = useRef(0)

  const stickyNavbar = (e) => {
    if (window !== undefined) {
      if (window.scrollY > oldScrollYPosition.current + 250) {
        setHide(true)
        oldScrollYPosition.current = window.scrollY
      } else if (window.scrollY < oldScrollYPosition.current - 250) {
        setHide(false)
        oldScrollYPosition.current = window.scrollY
      }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', stickyNavbar)
    return () => {
      window.removeEventListener('scroll', stickyNavbar)
    }
  }, [])

  useEffect(() => {
    const onRountChangeComplete = () => {
      setMobileMenuIsOpen(false)
    };
    Router.events.on('routeChangeComplete', onRountChangeComplete);
  }, [])

  if (!content) {
    return ''
  }

  return (
    <header className={`${classes['header']} ${!hide ? classes['is-visible'] : ''}`}>
      {content.primaryAnnouncement?.showAnnouncement &&
        <PrimaryAnnouncement props={content.primaryAnnouncement} />
      }
      <MainNavigation props={content} setMobileMenuIsOpen={setMobileMenuIsOpen} pageHandle={pageHandle}  />
      {pageHandle !== 'purchaseFlow' &&
        <MobileMenu props={content} mobileMenuIsOpen={mobileMenuIsOpen} setMobileMenuIsOpen={setMobileMenuIsOpen} pageHandle={pageHandle} />
      }
    </header>
  )
}

export default Header
