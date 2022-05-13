import PrimaryAnnouncement from '../PrimaryAnnouncement'
import MainNavigation from '../MainNavigation'

import classes from './Header.module.scss';

const Header = ({ content }) => {

  if (!content) {
    return ''
  }

  return (
    <header className={classes.header}>
      {content.primaryAnnouncement?.showAnnouncement &&
        <PrimaryAnnouncement props={content.primaryAnnouncement} />
      }
      <MainNavigation props={content} />
    </header>
  );
};

export default Header;
