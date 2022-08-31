import React from 'react'
import classes from './SubscriptionDeliveryCard.module.scss'
import moment from 'moment'

export default function SubscriptionDeliveryCard({date, type, address}) {
  return (
    <div className={classes['card']}>
      <h5>
        YOUR{' '}
        <span className={classes['salmon']}>{type} SUBSCRIPTION {moment(date).format('MMM')} BOX</span>{' '}
        IS ESTIMATED TO BE DELIVERED{' '}
        <span className={classes['salmon']}>{moment(date).format('MMM Do')}</span>
      </h5>
      <div className={classes['address']}>{address}</div>
    </div>
  )
}
