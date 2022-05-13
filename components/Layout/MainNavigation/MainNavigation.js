import classes from './MainNavigation.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import IconLogo from '@/svgs/logo.svg'
import PrimaryNavigation from './PrimaryNavigation';
import NavigationUtilities from './NavigationUtilities';

const MainNavigation = ({props}) => {
  return (
    <nav className={classes.mainNavigation}>
      <div className={`${classes.mainNavContainer} container`}>
        <PrimaryNavigation props={props} classes={classes} />
        <div className={classes.navLogo}>
          <div className={classes.navLogoContainer}>
            <Link href="/">
              <a>
                <IconLogo />
              </a>
            </Link>
          </div>
        </div>
        <NavigationUtilities props={props} classes={classes} />
      </div>
    </nav>
  );
};

export default MainNavigation;