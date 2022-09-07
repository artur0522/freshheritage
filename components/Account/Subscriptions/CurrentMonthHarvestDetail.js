import HarvestCard from '@/components/Harvest/HarvestCard'
import MiniDetails from './MiniDetails'
import React, { useState } from 'react'
import classes from './CurrentMonthHarvestDetail.module.scss'

export default function CurrentMonthHarvestDetail({ subscription, month, membership }) {
  const startDate = new Date(subscription.fulfill_start)
  const endDate = new Date(subscription.fulfill_end)
  const startDateString = startDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })

  const endDateString = endDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })

  const [activeTab, setActiveTab] = useState('left')

  return (
    <div className={classes['current-month-harvest']}>
      <div className={classes['top-bar']}>
        <div
          onClick={() => {
            setActiveTab('left')
          }}
          className={`${classes['left-tab']} ${
            activeTab === 'left'
              ? classes['active-tab']
              : classes['inactive-tab']
          }`}
        >
          <div className={classes['future-harvest-month']}>
            <h4>{month.month} box</h4>
          </div>
          <div className={classes['estimated-delivery']}>
            <span>Estimated Delivery </span>
            <span className={classes['date-string']}>
              {startDateString} - {endDateString}
            </span>
          </div>
        </div>
        <div
          onClick={() => {
            setActiveTab('right')
          }}
          className={`${classes['right-tab']} ${
            activeTab === 'right'
              ? classes['active-tab']
              : classes['inactive-tab']
          }`}
        >
          <h4>Harvest Details</h4>
        </div>
      </div>
      <div className={classes['detail-body']}>
        {activeTab === 'left' ? (
          <MiniDetails subscription={subscription} month={month} membership={membership}/>
        ) : (
          month.fishArray.map((fish) => (
            <HarvestCard
              key={`sub-detail-${fish._key}`}
              fish={fish}
              cardStyle={'projected-card'}
            />
          ))
        )}
      </div>
    </div>
  )
}
