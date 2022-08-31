import classes from './MainNavigation.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import PrimaryNavigation from './PrimaryNavigation'
import NavigationUtilities from './NavigationUtilities'
import PurchaseFlowNavigation from './PurchaseFlowNavigation'
import ResponsiveImage from '@/components/ResponsiveImage'

const MainNavigation = ({props, pageHandle}) => {

  let navigationType

  if (pageHandle === 'purchase-flow' || 'checkout') {
    navigationType = pageHandle
  }

  return (
    <nav className={`${classes.mainNavigation} ${navigationType ? classes[navigationType] : '' }`}>
      <div className={`${classes.mainNavContainer} container`}>
        {pageHandle !== 'purchase-flow' &&
          <PrimaryNavigation props={props} classes={classes} />
        }
        <div className={classes.navLogo}>
          <Link href="/">
            <a>
              <ResponsiveImage src={props.logo?.asset.url} alt={props.logo?.asset.alt || 'Logo'} />
            </a>
          </Link>
        </div>
        {pageHandle === 'purchase-flow' &&
          <PurchaseFlowNavigation />
        }
        <NavigationUtilities props={props} classes={classes} />
      </div>
    </nav>
  )
}

export default MainNavigation