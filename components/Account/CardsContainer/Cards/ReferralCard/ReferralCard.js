import React from 'react'
import classes from './ReferralCard.module.scss'

export default function ReferralCard() {

  const onReferAFriendClicked = () => {
    console.log('go')
  }

  return (
    <div className={classes['card']}>
      <h5>
        GET&nbsp;
        <span className={classes['salmon']}>$10 OFF</span> EVERY MONTH FOR EVERY
        REFERRAL!
      </h5>
      <button className="btn" onClick={() => onReferAFriendClicked}>Refer a Friend</button>
    </div>
  )
}
