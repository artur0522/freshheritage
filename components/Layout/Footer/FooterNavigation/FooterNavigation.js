import IconLogo from '@/svgs/logo.svg'
import IconFacebook from '@/svgs/facebook.svg'
import IconInstagram from '@/svgs/instagram.svg'
import IconPinterest from '@/svgs/pinterest.svg'
import IconTwitter from '@/svgs/twitter.svg'
import IconVimeo from '@/svgs/vimeo.svg'
import IconYoutube from '@/svgs/youtube.svg'

const NavigationMenu = ({item, classes}) => {
  return  <ul className={classes.footerMenuItems}>
            {item.navigation.menuItems.map(item => {
              return <li key={item._key}>{item.linkText}</li>
            })}
          </ul>
}

const socialLinkItem = (item, classes) => {
  function getIcon(platform) {
    switch(platform) {
      case 'facebook':
        return <IconFacebook />
      case 'instagram':
        return <IconInstagram />
      case 'pinterest':
        return <IconPinterest />
      case 'twitter':
        return <IconTwitter />
      case 'vimeo':
        return <IconVimeo />
      case 'youtube':
        return <IconYoutube />
      default:
        return ''
    }
  }
  return <li
            key={item._key}
            className={[classes.socialLinkItem, classes[item.platform]].join(' ')}>
              {getIcon(item.platform)}
          </li>
}

const FooterNavigation = ({props, classes}) => {
  const { footerNavigationList } = props;
  const { socialLinks } = props;


  return (
    <div className={[classes.footerSection, classes.footerNavigation].join(' ')}>
      <div className={classes.footerLogoAndSocials}>
        <div className={classes.footerLogo}>
          <IconLogo />
        </div>
        <ul className={classes.footerSocials}>
          {socialLinks.map(item => {
            return socialLinkItem(item, classes)
          })}
        </ul>
      </div>
      <ul className={classes.footerNavigationList}>
        {footerNavigationList.map(item => {
          return  <li className={classes.footerNavigationListItem} key={item._key}>
                    <h2>{item.title}</h2>
                    <NavigationMenu item={item} classes={classes} />
                  </li>
        })}
      </ul>
    </div>
  );
};

export default FooterNavigation;