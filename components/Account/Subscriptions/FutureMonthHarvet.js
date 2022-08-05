import React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import classes from './FutureMonthHarvest.module.scss'
import HarvestCard from '@/components/Harvest/HarvestCard'

export default function FutureMonthHarvest({
  subscriptionGroupSchedule,
  month,
}) {
  const startDate = new Date(subscriptionGroupSchedule.fulfill_start)
  const endDate = new Date(subscriptionGroupSchedule.fulfill_end)
  const startDateString = startDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })

  const endDateString = endDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })

  return (
    <Accordion>
      <AccordionSummary
        sx={{
          background: '#FFFDFC',
          color: '#163144',
          borderRadius: '12px',
        }}
        expandIcon={<ExpandMoreIcon sx={{ color: '#163144' }} />}
        id="sub-panel-header"
      >
        <div className={classes['future-harvest-header']}>
          <div className={classes['future-harvest-left']}>
            <div className={classes['future-harvest-month']}>
              {month.month} box
            </div>
            <div>
              Estimated Delivery{' '}
              <span>
                {startDateString} - {endDateString}
              </span>
            </div>
          </div>
          <div>View Projected Harvest</div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        {month.fishArray.map((fish) => (
          <HarvestCard
            key={`sub-detail-${fish._key}`}
            fish={fish}
            cardStyle={'projected-card'}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  )
}
