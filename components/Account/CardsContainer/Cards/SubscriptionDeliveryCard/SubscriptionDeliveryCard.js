import React from 'react'
import classes from './SubscriptionDeliveryCard.module.scss'

export default function SubscriptionDeliveryCard() {
  return (
    <div className={classes['card']}>
      <h5>
        YOUR{' '}
        <span className={classes['salmon']}>PREMIUM SUBSCRIPTION MAY BOX</span>{' '}
        IS ESTIMATED TO BE DELIVERED{' '}
        <span className={classes['salmon']}>MAY 9TH</span>
      </h5>
      <div className={classes['address']}>1209 E Mifflin St, Madison WI 53703</div>
    </div>
  )
}
