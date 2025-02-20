import Link from 'next/link'
import { useState, useEffect } from 'react'
import IconMinus from '@/svgs/minus.svg'
import Expand from 'react-expand-animated'
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
  const [mounted, setMounted] = useState(false)

  const toggleExpand = (e) => {
    e.preventDefault()
    if (isDesktop) {
      return false
    }
    height === 0 ? setHeight('auto') : setHeight(0)
  }

  useEffect(() => {
    setMounted(true);
  }, []);

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
      {mounted &&
        <Expand open={height !== 0} duration={300}>
          <ul className={classes.footerMenuItems}>
            {item.navigation.menuItems.map(item => {
              return <li key={item._key}>
                <Link prefetch={false} href={item.linkUrl ? item.linkUrl : '/'}>
                  <a>{item.linkText}</a>
                </Link>
              </li>
            })}
          </ul>
        </Expand>
      }
    </li>
  )
}

export default FooterMenuItems