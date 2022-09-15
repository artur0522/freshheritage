import React, { useEffect, useState } from 'react';
import classes from './Referrals.module.scss';
import ReferralForm from './ReferralForm/ReferralForm';
import ReferralActivity from './ReferralActivity/ReferralActivity';
import Referral30Days from './Referral30Days/Referral30Days';

export default function ReferralsPage({customer}) {
  const [referrals, setReferrals] = useState(undefined)
  const [referralsLoaded, setReferralsLoaded] = useState(false)

  useEffect(() => {
    const load = async () => {
      const idArr = customer.id.split('/')
      const id = idArr[idArr.length - 1]

      const result = await fetch(`/api/account/get-referrals?cID=${id}`, {
        method: 'GET',
      }).then((res) => res.json())

      if (result.message === 'success') {
        setReferrals(result.data)
      }
      setReferralsLoaded(true)
    }

    load()
  }, [customer.id])


  return (
    <div className={classes['referrals']}>
      {/* Left col */}
      <div className={classes['col-left']}>
        <div className={classes['banner']}>
          <Referral30Days referrals={referrals} />
        </div>
        <ReferralForm customer={customer}/>
      </div>

      <div className={classes['divider']}></div>

      {/* Right col */}
      <div className={classes['col-right']}>
        <div className={classes['banner']}>
          <Referral30Days referrals={referrals} />
        </div>
        <ReferralActivity referrals={referrals} referralsLoaded={referralsLoaded}/>
      </div>
    </div>
  )
}
