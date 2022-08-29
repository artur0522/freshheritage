import Image from 'next/image';
import React, { useState } from 'react'
import moment from 'moment'
import classes from './AccountDetailSubscription.module.scss'
import crabTestImage from './crab.png';

export default function AccountDetailSubscription({sub}) {
  const [expanded, setExpanded] = useState(false)

  const cancelPlan = () => {
    console.log('Cancel Plan clicked')
    setExpanded(true)
  }

  const back = () => {
    console.log('Back clicked')
  }

  const nevermind = () => {
    console.log('Nevermind clicked')
    setExpanded(false)
  }

  const startShipDate = new Date(sub.fulfill_start)

  return (
    <div className={classes['subscription-container']}>
      <div className={classes['summary']}>
        <div className={classes['details']}>
          <div>{sub.subscription_product0}</div>
          <div><strong>Next Box Ships</strong></div>
          <div>{moment(startShipDate).format('MMM D, YYYY') }</div>
        </div>
        <div className={classes['cancel']}>
          <a>Cancel Plan</a>
        </div>
      </div>

      {/* Plan Details */}
      <div className={classes['detailed-description']}>
        <div className={classes['image']}>
          <Image
            src={crabTestImage.src}
            alt="Crab"
            layout="intrinsic"
            height={84}
            width={120}
          />
        </div>
        <div className={classes['product']}>
          <div className={classes['name']}><span>Premium Seafood Subscription</span> with shellfish</div>
          <div>12 deliveries prepaid | Ships every month</div>
        </div>
        <div className={classes['cost']}>
          <div>$1,850.76 ($154.23/box)</div>
          <div>4.5lbs / box</div>
        </div>
      </div>

      {/* Plan Cancellation Accordion */}
      <div className={classes['cancel-container']}>
        <h5>Please select a reason below</h5>
        <div>Personal reasons or life changes</div>
        <form className={classes['cancel-plan-form']}>
          <div>Personal reasons or life changes</div>
          <div>todo...</div>
          <div>todo...</div>
          <div>todo...</div>
          <button className={`btn sitkablue`} onClick={() => cancelPlan()}>Cancel My Plan</button>
        </form>
        <div className={classes['options']}>
          <a>Back</a>
          <a>Nevermind</a>
        </div>
      </div>
    </div>
  )
}
