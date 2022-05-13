import classes from './Footer.module.scss';

import FooterEmailSignup from './FooterEmailSignup';
import FooterNavigation from './FooterNavigation';
import FooterBottom from './FooterBottom';

const Footer = ({ content }) => {

  if (!content) {
    return '';
  }

  return (
    <footer className={classes.footer}>
      <div className="container">
        <FooterEmailSignup props={content.emailSignup} classes={classes} />
        <FooterNavigation props={content.footerNavigationList} classes={classes} />
        <FooterBottom props={content} classes={classes} />
      </div>
    </footer>
  );
};

export default Footer;
