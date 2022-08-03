import React from 'react'
import Sub from './Sub'
import classes from './Subscriptions.module.scss'

export default function SubscriptionsPage({subsData, membershipData}) {
  const renderSubscriptions = () => {
    return subsData.map((sub) => {
      return <Sub key={sub.subscription_id} subscription={sub}></Sub>
    })
  }
  return (
    <div className={classes['subscriptions']}>
      {renderSubscriptions()}
    </div>
  )
}
