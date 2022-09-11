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

  const futureDeliveries = subscription.group_schedule
  .filter((g) => g.scheduled_status !== 'skipped')
  .map(g => {
    // Get the harvest details for the month
    const month = harvest.fields.months.find((m) =>
      m.month.includes(g.month),
    )

    if (!month) {
      console.error('No harvest data for ' + g.month);
    }

    return {
      group: g,
      month
    }
  })
  .filter(mg => !!mg.month)
  .map((mg) => {

    return (
      <FutureMonthHarvest
        key={`future-harvest-${mg.month.month}`}
        subscriptionGroupSchedule={mg.group}
        month={mg.month}
      />
    )
  });

  const renderEmptyMessage = !currentMonth && futureDeliveries.length === 0;

  return (
    <div className={classes['sub-detail']}>
      <UpcomingDeliveriesBar subscription={subscription} />

      {renderEmptyMessage && (<h4 className={classes['no-upcoming']}>No upcoming deliveries</h4>)}
      {!renderEmptyMessage && currentMonth && (
        <CurrentMonthHarvestDetail
          subscription={subscription}
          month={currentMonth}
          membership={membership}
        />
      )}
      {!renderEmptyMessage && futureDeliveries}
    </div>
  )
}
