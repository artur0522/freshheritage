import classes from './MainNavigation.module.scss';

import PrimaryNavigation from './PrimaryNavigation';
import NavigationUtilities from './NavigationUtilities';

const MainNavigation = ({props}) => {
  return (
    <nav className={classes.mainNavigation}>
      <div className={`${classes.mainNavContainer} container`}>
        <PrimaryNavigation props={props} classes={classes} />
        <div className={classes.navLogo}>
          Logo
        </div>
        <NavigationUtilities props={props} classes={classes} />
      </div>
    </nav>
  );
};

export default MainNavigation;