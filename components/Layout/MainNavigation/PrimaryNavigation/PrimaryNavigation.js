import Link from 'next/link'
import IconMenu from '@/svgs/menu.svg'
import IconSearch from '@/svgs/search.svg'
import { useMediaQuery } from 'react-responsive'

const PrimaryNavigation = ({props, classes, setMobileMenuIsOpen}) => {

  const {menuItems} = props.nonMemberPrimaryNavigation

  const isDesktop = useMediaQuery(
    { minWidth: 1074 }
  )

  return (
    <ul className={classes.navItems}>
      {isDesktop ? (
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