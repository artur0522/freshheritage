import { useState } from 'react';
import Link from 'next/link';
import IconSearch from '@/svgs/search.svg'
import IconQuestion from '@/svgs/question-circle.svg'
import IconUser from '@/svgs/user.svg'
import IconCart from '@/svgs/cart.svg'

const NavigationUtilities = ({props, classes}) => {

  const [showCustomerServiceInfo, setShowCustomerServiceInfo] = useState(false);
  const navCTA = props.nonMemberCta;
  const customerService = props.customerService;

  return (
    <ul className={[classes.navItems, classes.navUtilities].join(' ')}>
      <li className={classes.navItem}>
        <button className={[classes.navButton, 'btn', 'salmon'].join(' ')}>
          {navCTA.nonMemberCtaText}
        </button>
      </li>
      <li className={classes.navItem}><IconSearch /></li>
      <li className={classes.navItem}><IconUser /></li>
      <li
        onMouseEnter={() => setShowCustomerServiceInfo(true)}
        onMouseLeave={() => setShowCustomerServiceInfo(false)}
        className={classes.navItem}>
          <IconQuestion />
          {customerService && showCustomerServiceInfo &&
            <div className={classes.customerServiceInfo}>
              <div className={classes.customerServiceInfoContent}>
                <h4>{customerService.header}</h4>
                <p>{customerService.subheader}</p>
                <ul>
                  {customerService.customerServiceNavigation.menuItems.map(item => {
                    return <li key={item._key}>
                      <Link href={item.linkUrl ? item.linkUrl : ''}>
                        <a>{item.linkText}</a>
                      </Link>
                    </li>
                  })}
                </ul>
              </div>
            </div>
          }
      </li>
      <li className={classes.navItem}><IconCart /></li>
    </ul>
  );
};

export default NavigationUtilities;