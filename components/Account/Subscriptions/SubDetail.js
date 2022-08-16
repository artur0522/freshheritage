import HarvestCard from '@/components/Harvest/HarvestCard'
import React, { useEffect, useState } from 'react'
import { nacelleClient } from 'services'
import FutureMonthHarvest from './FutureMonthHarvest'
import CurrentMonthHarvestDetail from './CurrentMonthHarvestDetail'
import classes from './SubDetail.module.scss'

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

export default function SubDetail({ subscription, product, variant }) {
  const [harvest, setHarvest] = useState(null)
  useEffect(() => {
    const getHarvest = async () => {
      const handleValue = getHarvetHandle(product, variant)
      if (!!handleValue) {
        const harvestContent = await nacelleClient.content({
          handles: [handleValue],
          type: 'harvest',
        })
        console.log('harvestContent', harvestContent)
        if (!!harvestContent) {
          setHarvest(harvestContent[0])
        }
      }
    }
    getHarvest()
  }, [product, variant])

  return harvest && <div>{renderMonths(subscription, harvest)}</div>
}

const renderMonths = (subscription, harvest) => {

  const currentMonth = harvest.fields.months.find((m) => m.month.includes(subscription.fulfill_month));

  return <div>
    {currentMonth && <CurrentMonthHarvestDetail subscription={subscription} month={currentMonth}/>}
    {subscription.group_schedule.map((g) => {
    // Get the harvest details for the month
    const month = harvest.fields.months.find((m) => m.month.includes(g.month))
    return month ? (
      <FutureMonthHarvest key={`future-harvest-${month.month}`} subscriptionGroupSchedule={g} month={month}/>
    ) : (
      <div key={`no-harvest-data-${g.month}`}>No harvest data for {g.month}</div>
    )
  })}</div>
}
