import React from 'react';
import classes from './CardsContainer.module.scss';
import ReferralCard from '@/components/Account/CardsContainer/Cards/ReferralCard/ReferralCard'
import SubscriptionDeliveryCard from '@/components/Account/CardsContainer/Cards/SubscriptionDeliveryCard/SubscriptionDeliveryCard'

export default function CardsContainer() {
  return (
    <div className={classes['cards-container']}>
      <div className={classes['card']}>
        <SubscriptionDeliveryCard />
      </div>
      <div className={classes['card']}>
        <ReferralCard />
      </div>
      <div className={classes['card']}>
        <ReferralCard />
      </div>
      <div className={classes['card']}>
        <ReferralCard />
      </div>
    </div>
  )
}
