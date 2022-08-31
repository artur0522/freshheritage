import React from 'react'
import classes from './ReferralCard.module.scss'
import { useRouter } from 'next/router'

export default function ReferralCard() {
  const router = useRouter()

  const onReferAFriendClicked = () => {
    router.push('/account/referrals', undefined, { shallow: true })
  }

  return (
    <div className={classes['card']}>
      <h5>
        GET&nbsp;
        <span className={classes['salmon']}>$10 OFF</span> EVERY MONTH FOR EVERY
        REFERRAL!
      </h5>
      <button className="btn" onClick={() => onReferAFriendClicked()}>
        Refer a Friend
      </button>
    </div>
  )
}
