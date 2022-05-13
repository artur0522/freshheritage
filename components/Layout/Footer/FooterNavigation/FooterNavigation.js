const NavigationMenu = ({item, classes}) => {
  return  <ul className={classes.footerMenuItems}>
            {item.navigation.menuItems.map(item => {
              return <li key={item._key}>{item.linkText}</li>
            })}
          </ul>
}

const FooterNavigation = ({props, classes}) => {
  const footerNavigationList = props;
  return (
    <div className={[classes.footerSection, classes.footerNavigation].join(' ')}>
      <ul className={classes.footerNavigationList}>
        {footerNavigationList.map(item => {
          return  <li key={item._key}>
                    <h3>{item.title}</h3>
                    <NavigationMenu item={item} classes={classes} />
                  </li>
        })}
      </ul>
    </div>
  );
};

export default FooterNavigation;