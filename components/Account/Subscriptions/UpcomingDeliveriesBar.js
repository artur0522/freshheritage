import { useEditScheduleDrawerContext } from '@/context/EditScheduleDrawerContext'
import { useMemberAccountContext } from '@/context/MemberAccountContext';
import React, { useEffect } from 'react'
import classes from './UpcomingDeliveriesBar.module.scss'

export default function UpcomingDeliveriesBar({subscription}) {
  const { isOpen, currentOpenSubscription, openDrawer, updateSubscription } = useEditScheduleDrawerContext();

  // Since we set the subscription for the drawer _at the point that we open it_
  // we need a way to tell the drawer that the subscription changed
  // We need to make sure that we only send this if we are the component for the open
  // subscription
  useEffect(() => {
    if (isOpen && currentOpenSubscription.subscription_id === subscription.subscription_id) {
      updateSubscription(subscription)
    }
  }, [isOpen, currentOpenSubscription, updateSubscription, subscription])

  return <div className={classes['upcoming-deliveries-bar']}>
    <h4 className={classes['section-text']}>Upcoming Deliveries</h4>
    <div className={`${classes['shipping-link']} ${classes['right-link']}`}>Shipping to {subscription.subscription_address.street1}</div>
    <div className={`${classes['schedule-link']} ${classes['right-link']}`}><a onClick={() => openDrawer(subscription)}>Edit Schedule</a></div>
  </div>
}
