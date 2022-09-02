import React from 'react';
import classes from './Referrals.module.scss';
import ReferralForm from './ReferralForm/ReferralForm';
import ReferralActivity from './ReferralActivity/ReferralActivity';

export default function ReferralsPage({customer}) {
  return (
    <div className={classes['referrals']}>
      {/* Left col */}
      <div className={classes['col-left']}>
        <ReferralForm customer={customer}/>
      </div>

      <div className={classes['divider']}></div>

      {/* Right col */}
      <div className={classes['col-right']}>
        <ReferralActivity customer={customer}/>
      </div>
    </div>
  )
}
