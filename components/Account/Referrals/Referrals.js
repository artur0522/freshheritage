import React, { useState } from 'react';
import classes from './Referrals.module.scss';
import ReferralForm from './ReferralForm/ReferralForm';
import ReferralActivity from './ReferralActivity/ReferralActivity';

export default function ReferralsPage() {
  const [name, setName] = useState()

  const submitForm = (e) => {
    e.preventDefault()
    const name = e.target.name.value;
    const email = e.target.email.value;
    console.log(`${name} ${email}`)
  }

  return (
    <div className={classes['referrals']}>
      {/* Left col */}
      <div className={classes['col-left']}>
        <ReferralForm />
      </div>

      <div className={classes['divider']}></div>

      {/* Right col */}
      <div className={classes['col-right']}>
        <ReferralActivity />
      </div>
    </div>
  )
}
