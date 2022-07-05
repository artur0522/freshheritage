import { useState, useEffect } from 'react'
import Link from 'next/link'
import IconMenu from '@/svgs/menu.svg'
import IconSearch from '@/svgs/search.svg'
import { useMediaQuery } from 'react-responsive'
import { useCustomerContext } from '@/context/CustomerContext'
import { useHeaderContext } from '@/context/HeaderContext'

const PrimaryNavigation = ({props, classes}) => {

  const customerContext = useCustomerContext()
  const { setMobileMenuIsOpen } = useHeaderContext()
  const {menuItems} = (customerContext.customer?.is_member) ? props.memberPrimaryNavigation : props.nonMemberPrimaryNavigation

  const [mounted, setMounted] = useState(false);
  const isDesktop = useMediaQuery(
    { minWidth: 1074 }
  )

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ul className={classes.navItems}>
      {mounted && isDesktop ? (
        menuItems.map(item => {
          return (
            <li className={classes.navItem} key={item._key}>
              <Link href={item.linkUrl ? item.linkUrl : '/'}>
                <a>{item.linkText}</a>
              </Link>
            </li>
          )
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
          <li className={classes.navItem}><IconSearch /></li>
        </>

      )}
  </ul>
  )
}

export default PrimaryNavigation