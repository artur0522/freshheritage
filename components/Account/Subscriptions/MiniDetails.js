import React from 'react'
import classes from './MiniDetails.module.scss'
import Image from 'next/image'

export default function MiniDetails({ subscription, month }) {
  const fishToShow = Object.values(month.fishArray)
    .filter((fish) => !!fish.species)
    .map((fish) => fish.species)

  const currentChargeDate = new Date(
    subscription.subscription_next_orderdate,
  );

  return (
    <div className={classes['mini-details']}>
      <div className={classes['mini-harvest']}>
        {fishToShow.map((fish) => (
          <div
            className={classes['fish-row']}
            key={`fish-detail-line-${fish._id}`}
          >
            <Image
              src={fish.image.asset.url}
              alt={fish.title}
              width={214}
              height={143}
            />
            <h4>{fish.title}</h4>
          </div>
        ))}
      </div>
      <div className={classes['payment-details']}>
        <h4>
          Next Charge <span className={classes['date']}>{currentChargeDate.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
    })}</span>
        </h4>
        <div className={classes['payment-details-line-2']}>$224 &#x2022; Ships Monthly</div>
        <button className={`btn salmon ${classes['prepay-btn']}`}>Upgrade to Prepaid and Save 3%</button>
      </div>
    </div>
  )
}
