import { forwardRef } from 'react'
import PrimaryAnnouncement from '../PrimaryAnnouncement'
import MainNavigation from '../MainNavigation'
import MobileMenu from '../MobileMenu'
import { useHeaderContext } from '@/context/HeaderContext'

import classes from './Header.module.scss'

const Header = forwardRef(({ content, pageHandle }, ref) => {

  const { hide } = useHeaderContext()

  return (
    <>
      <header ref={ref} className={`${classes['header']} ${!hide ? classes['is-visible'] : ''}`}>
        {content.primaryAnnouncement?.showAnnouncement &&
          <PrimaryAnnouncement props={content.primaryAnnouncement} />
        }
        <MainNavigation props={content} pageHandle={pageHandle}  />
      </header>
      {pageHandle !== 'purchaseFlow' &&
        <MobileMenu props={content} pageHandle={pageHandle} />
      }
    </>
  )
})

export default Header
