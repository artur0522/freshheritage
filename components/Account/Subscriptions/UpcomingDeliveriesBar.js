import React from 'react'
import classes from './UpcomingDeliveriesBar.module.scss'

export default function UpcomingDeliveriesBar({subscription}) {
  return <div className={classes['upcoming-deliveries-bar']}>
    <h4 className={classes['section-text']}>Upcoming Deliveries</h4>
    <div className={classes['shipping-link']}>Shipping to {subscription.subscription_address.street1}</div>
    <div className={classes['schedule-link']}>Edit Schedule</div>
  </div>
}
