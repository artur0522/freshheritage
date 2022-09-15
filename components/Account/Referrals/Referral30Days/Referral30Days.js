import React from 'react'
import classes from './Referral30Days.module.scss'

export default function Referral30Days({referrals = []}) {
  const activeReferrals = 0
  referrals.forEach(r => {
    if (r.isActive)
      num++
  });

  return (
    <div className={classes['referral-activity']}>
      <h2>
        <span className={classes['salmon']}>{activeReferrals}</span> Of Your Referrees Have Been Active In The Past 30 Days
      </h2>
      <div className={classes['banner']}>
        You&apos;ll get <span className={classes['salmon']}>$10 Off</span> Your Next Order!
      </div>
    </div>
  )
}
