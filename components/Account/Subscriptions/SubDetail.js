import HarvestCard from '@/components/Harvest/HarvestCard'
import React, { useEffect, useState } from 'react'
import { nacelleClient } from 'services'
import FutureMonthHarvest from './FutureMonthHarvest'
import CurrentMonthHarvestDetail from './CurrentMonthHarvestDetail'
import classes from './SubDetail.module.scss'
import UpcomingDeliveriesBar from './UpcomingDeliveriesBar'

const getHarvetHandle = (variant, product) => {
  // First, check the meta fields on the variant
  const m = variant.metafields.find((m) => m.key === 'harvest_handle')
  if (!!m) {
    return m.value
  }

  const pm = product.metafields.find((m) => m.key === 'harvest_handle')
  if (!!pm) {
    return pm.value
  }
}

export default function SubDetail({
  subscription,
  product,
  variant,
  membership,
}) {
  const [harvest, setHarvest] = useState(null)
  useEffect(() => {
    const getHarvest = async () => {
      const handleValue = getHarvetHandle(product, variant)
      console.log('got harvest handle value', handleValue)

      if (!!handleValue) {
        console.log('trying to get harvest content from nacelle')
        const harvestContent = await nacelleClient.content({
          handles: [handleValue],
          type: 'harvest',
        })
        console.log('get harvestContent', harvestContent)
        if (!!harvestContent) {
          setHarvest(harvestContent[0])
        }
      }
    }
    getHarvest()
  }, [product, variant])

  return harvest && <div>{renderMonths(subscription, harvest, membership)}</div>
}

const renderMonths = (subscription, harvest, membership) => {
  const currentMonth = harvest.fields.months.find((m) =>
    m.month.includes(subscription.fulfill_month),
  )

  return (
    <div>
      <UpcomingDeliveriesBar subscription={subscription} />
      {currentMonth && (
        <CurrentMonthHarvestDetail
          subscription={subscription}
          month={currentMonth}
          membership={membership}
        />
      )}
      {subscription.group_schedule
        .filter((g) => g.scheduled_status !== 'skipped')
        .map((g) => {
          // Get the harvest details for the month
          const month = harvest.fields.months.find((m) =>
            m.month.includes(g.month),
          )
          return month ? (
            <FutureMonthHarvest
              key={`future-harvest-${month.month}`}
              subscriptionGroupSchedule={g}
              month={month}
            />
          ) : (
            <div key={`no-harvest-data-${g.month}`}>
              No harvest data for {g.month}
            </div>
          )
        })}
    </div>
  )
}
