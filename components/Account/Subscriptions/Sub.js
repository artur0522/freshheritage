import React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import classes from './Sub.module.scss'

export default function Sub({ subscription }) {
  const currentFulfillmentStartDate = new Date(subscription.fulfill_start)
  const currentFulfillmentStartDateString =
    currentFulfillmentStartDate.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })

  const currentFulfillmentEndDate = new Date(subscription.fulfill_end)
  const currentFulfillmentEndDateString =
    currentFulfillmentEndDate.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })
  return (
    <Accordion className="baz-baz-baz-baz">
      <AccordionSummary
        sx={{
          background: '#163144',
          color: 'white',
          borderRadius: '5px',
        }}
        expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
        id="sub-panel-header"
      >
        <div className={classes['panel-content']}>
          <h1>{subscription.subscription_product0}</h1>
          <h1 className={classes['sub-header']}>
            Next Estimated Delivery{' '}
            <span className={classes['current-fulfill-date']}>
              {currentFulfillmentStartDateString} - {currentFulfillmentEndDateString}
            </span>
          </h1>
        </div>
      </AccordionSummary>
      <AccordionDetails>This is where all the details go</AccordionDetails>
    </Accordion>
  )
}
