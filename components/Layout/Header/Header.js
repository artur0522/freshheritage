import { useState } from 'react'
import PrimaryAnnouncement from '../PrimaryAnnouncement'
import MainNavigation from '../MainNavigation'
import MobileMenu from '../MobileMenu'

import classes from './Header.module.scss'

const Header = ({ content }) => {

  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false)

  if (!content) {
    return ''
  }

  return (
    <header className={classes.header}>
      {content.primaryAnnouncement?.showAnnouncement &&
        <PrimaryAnnouncement props={content.primaryAnnouncement} />
      }
      <MainNavigation props={content} setMobileMenuIsOpen={setMobileMenuIsOpen}  />
      <MobileMenu props={content} mobileMenuIsOpen={mobileMenuIsOpen} setMobileMenuIsOpen={setMobileMenuIsOpen} />
    </header>
  )
}

export default Header
