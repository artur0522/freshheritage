import React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SubDetail from './SubDetail'
import classes from './Sub.module.scss'

const getVariant = (variantId, allProducts) => {
  // TODO: Remove this when the data matches up
  variantId = '41593002361018'; // Premium Seafood Box
  // variantId = '41593002393786'; // Premium Seafood Box w/ Shellfish
  // END TODO
  const p = allProducts.find(p => p.variants.some(v => v.sourceEntryId.includes(variantId)));
  return p ? p.variants.find(v => v.sourceEntryId.includes(variantId)) : undefined;
}

const getProductFromVariantId = (variantId, allProducts) => {
  // TODO: Remove this when the data matches up
  variantId = '41593002361018'; // Premium Seafood Box
  // variantId = '41593002393786'; // Premium Seafood Box w/ Shellfish
  // END TODO

  const p = allProducts.find(p => p.variants.some(v => v.sourceEntryId.includes(variantId)));
  console.log('found product', p);
  return p;
}

export default function Sub({ defaultOpen, subscription, products, membership }) {

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

    const p = getProductFromVariantId(subscription.subscription_product0id, products);
    const v = getVariant(subscription.subscription_product0id, products);

    return (
    <Accordion defaultExpanded={defaultOpen}>
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
      <AccordionDetails>
        <SubDetail key={subscription.subscription_id} subscription={subscription} product={p} variant={v} membership={membership}></SubDetail>
      </AccordionDetails>
    </Accordion>
  )
}
