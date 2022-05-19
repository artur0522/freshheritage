import Link from 'next/link'
import {useState} from 'react'
import IconMinus from '@/svgs/minus.svg'
import AnimateHeight from 'react-animate-height'
import { useMediaQuery } from 'react-responsive'

const FooterMenuItems = ({item, classes}) => {
  const handleMediaQueryChange = (matches) => {
    if (matches) setHeight('auto')
    if (!matches) setHeight(0)
  }

  const isDesktop = useMediaQuery(
    { minWidth: 1440 }, undefined, handleMediaQueryChange
  )
  const [height, setHeight] = useState(isDesktop ? 'auto' : 0)

  const toggleExpand = (e) => {
    e.preventDefault()
    if (isDesktop) {
      return false
    }
    height === 0 ? setHeight('auto') : setHeight(0)
  }

  return (
    <li className={classes.footerNavigationListItem} key={item._key}>
      <button
        className={classes.footerNavigationListItemButton}
        onClick={(e) => toggleExpand(e)}>
          <h2>{item.title}</h2>
          {height !== 0 && !isDesktop &&
            <IconMinus />
          }
      </button>
      <AnimateHeight height={height} duration={500} className={classes.footerMenuItems}>
        {item.navigation.menuItems.map(item => {
          return <li key={item._key}>
            <Link href={item.linkUrl ? item.linkUrl : '/'}>
              <a>{item.linkText}</a>
            </Link>
          </li>
        })}
      </AnimateHeight>
    </li>
  )
}

export default FooterMenuItems