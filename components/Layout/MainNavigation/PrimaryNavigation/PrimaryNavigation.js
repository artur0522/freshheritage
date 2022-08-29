import { useState, useEffect } from 'react'
import Link from 'next/link'
import IconMenu from '@/svgs/menu.svg'
import IconSearch from '@/svgs/search.svg'
import { useMediaQuery } from 'react-responsive'
import { useCustomerContext } from '@/context/CustomerContext'
import { useHeaderContext } from '@/context/HeaderContext'
import { useSearchModalContext } from '@/context/SearchModalContext'
import { useTheCatchContext } from '@/context/TheCatchContext'

const PrimaryNavigation = ({props, classes}) => {

  const customerContext = useCustomerContext()
  const theCatchContext = useTheCatchContext()
  const { customer } = customerContext
  const { setMobileMenuIsOpen } = useHeaderContext()
  const {menuItems} = (customerContext.customer?.is_member) ? props.memberPrimaryNavigation : props.nonMemberPrimaryNavigation
  const searchModalContext = useSearchModalContext()
  const { setSearchOpen } = searchModalContext
  const { monthName, year } = theCatchContext

  const [mounted, setMounted] = useState(false);
  const isDesktop = useMediaQuery(
    { minWidth: 1074 }
  )

  let theCatchUrl = `/the-catch/premium-seafood-box-${monthName}-${year}`

  if (customer) {
    if (customer.tags.includes('PS')) {
      theCatchUrl = `/the-catch/premium-seafood-box-${monthName}-${year}`
    } else if(customer.tags.includes('PSWS')) {
      theCatchUrl = `/the-catch/premium-seafood-box-no-shellfish-${monthName}-${year}`
    } else if (customer.tags.includes('SF') || customer.tags.includes('SF-BI')) {
      theCatchUrl = `/the-catch/seafood-box-${monthName}-${year}`
    } else if (customer.tags.includes('S')) {
      theCatchUrl = `/the-catch/salmon-box-${monthName}-${year}`
    }
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  const openSearchModal = () => {
    setSearchOpen(true)
  }

  return (
    <ul className={classes.navItems}>
      {mounted && isDesktop ? (
        menuItems.map(item => {
          if(item.linkText === 'The Catch') {
            return (
              <li className={classes.navItem} key={item._key}>
                <Link href={theCatchUrl || '/'}>
                  <a>{item.linkText}</a>
                </Link>
              </li>
            )
          } else {
            return (
              <li className={classes.navItem} key={item._key}>
                <Link href={item.linkUrl ? item.linkUrl : '/'}>
                  <a>{item.linkText}</a>
                </Link>
              </li>
            )
          }
        })
      ): (
        <>
          <li className={classes.navItem}>
            <button
              onClick={() => setMobileMenuIsOpen(true)}
              className={classes.navIconButton}>
              <IconMenu />
            </button>
          </li>
          <li className={classes.navItem}><IconSearch onClick={() => openSearchModal()} /></li>
        </>

      )}
  </ul>
  )
}

export default PrimaryNavigation