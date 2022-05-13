import Link from 'next/link';

const PrimaryNavigation = ({props, classes}) => {

  const {menuItems} = props.nonMemberPrimaryNavigation;

  return (
    <ul className={classes.navItems}>
    {menuItems.map(item => {
      return (
        <li className={classes.navItem} key={item._key}>
          <Link href={item.linkUrl ? item.linkUrl : ''}>
            <a>{item.linkText}</a>
          </Link>
        </li>
      );
    })}
  </ul>
  );
};

export default PrimaryNavigation;