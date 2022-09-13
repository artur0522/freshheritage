import React from 'react'
import classes from './CardsContainer.module.scss'
import ReferralCard from '@/components/Account/CardsContainer/Cards/ReferralCard/ReferralCard'
import SubscriptionDeliveryCard from '@/components/Account/CardsContainer/Cards/SubscriptionDeliveryCard/SubscriptionDeliveryCard'

export default function CardsContainer({ subscriptions }) {

  const nextSubscription = subscriptions[0]
  const endDate = new Date(nextSubscription.fulfill_end)

  const address = `${nextSubscription.subscription_address.street1}, ${nextSubscription.subscription_address.city}` +
    ` ${nextSubscription.subscription_address.state} ${nextSubscription.subscription_address.zip}`

  return (
    <div className={classes['cards-container']}>
      <div className={classes['card']}>
        <SubscriptionDeliveryCard
          date={endDate}
          type={'Premium'}
          address={address}
        />
      </div>
      <div className={classes['card']}>
        <ReferralCard />
      </div>
    </div>
  )
}
