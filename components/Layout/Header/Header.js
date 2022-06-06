import { useState, useEffect } from 'react'
import PrimaryAnnouncement from '../PrimaryAnnouncement'
import MainNavigation from '../MainNavigation'
import MobileMenu from '../MobileMenu'
import Router from 'next/router'

import classes from './Header.module.scss'

const Header = ({ content, pageHandle }) => {

  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false)

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
    <header className={classes.header}>
      {content.primaryAnnouncement?.showAnnouncement &&
        <PrimaryAnnouncement props={content.primaryAnnouncement} />
      }
      <MainNavigation props={content} setMobileMenuIsOpen={setMobileMenuIsOpen} pageHandle={pageHandle}  />
      {pageHandle !== 'purchaseFlow' &&
        <MobileMenu props={content} mobileMenuIsOpen={mobileMenuIsOpen} setMobileMenuIsOpen={setMobileMenuIsOpen} />
      }
    </header>
  )
}

export default Header
