import { useEditScheduleDrawerContext } from '@/context/EditScheduleDrawerContext'
import React from 'react'
import classes from './UpcomingDeliveriesBar.module.scss'

export default function UpcomingDeliveriesBar({subscription}) {
  const { openDrawer } = useEditScheduleDrawerContext();

  return <div className={classes['upcoming-deliveries-bar']}>
    <h4 className={classes['section-text']}>Upcoming Deliveries</h4>
    <div className={`${classes['shipping-link']} ${classes['right-link']}`}>Shipping to {subscription.subscription_address.street1}</div>
    <div className={`${classes['schedule-link']} ${classes['right-link']}`}><a onClick={() => openDrawer(subscription)}>Edit Schedule</a></div>
  </div>
}
