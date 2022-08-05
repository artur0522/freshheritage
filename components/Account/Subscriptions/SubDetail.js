import HarvestCard from '@/components/Harvest/HarvestCard'
import React, { useEffect, useState } from 'react'
import { nacelleClient } from 'services'
import FutureMonthHarvest from './FutureMonthHarvet'
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
  return <div>
    <div>Current month details here</div>
    {subscription.group_schedule.map((g) => {
    // Get the harvest details for the month
    const month = harvest.fields.months.find((m) => m.month.includes(g.month))
    return month ? (
      <FutureMonthHarvest subscriptionGroupSchedule={g} month={month}/>
    ) : (
      <div>No harvest data for {g.month}</div>
    )
  })}</div>
}
