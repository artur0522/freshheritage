import Image from 'next/image'
import React, { useState } from 'react'
import moment from 'moment'
import classes from './AccountDetailSubscription.module.scss'
import crabTestImage from './crab.png'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'

export default function AccountDetailSubscription({ sub }) {
  const [expanded, setExpanded] = useState(false)
  const [cancellationForm, setCancellationForm] = useState({
    mainFormValue: ''
  })
  const [showPersonalReasonsForm, setShowPersonalReasonsForm] = useState(false)

  const handleFormChange = (formFieldName) => (e, value) => {
    setCancellationForm({
      ...cancellationForm,
      [formFieldName]: value
    })
  }

  const submitCancelPlan = () => {
    if (cancellationForm.mainFormValue === 'personal-reasons') {
      setShowPersonalReasonsForm(true);
    }
    console.log(cancellationForm)
  }

  const cancelPlan = () => {
    console.log('Cancel Plan clicked')
    setExpanded(true)
  }

  const back = () => {
    setShowPersonalReasonsForm(false);
    setCancellationForm({
      ...cancellationForm,
      mainFormValue: ''
    })
    console.log('Back clicked')
  }

  const nevermind = () => {
    console.log('Nevermind clicked')
    setExpanded(false)
  }

  const onFormSubmit = (form) => {
    console.log(form)
  }

  const startShipDate = new Date(sub.fulfill_start)

  const renderPlanDetails = () => {
    if (expanded) {
      return (
        <div>
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
              <div className={classes['name']}>
                <span>Premium Seafood Subscription</span> with shellfish
              </div>
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
            {/* <div>Personal reasons or life changes</div> */}
            <div className={classes['cancel-plan-form']}>
              <FormControl onSubmit={onFormSubmit}>
                <RadioGroup
                  aria-labelledby="cancellation-reason"
                  onChange={handleFormChange('mainFormValue')}
                  value={cancellationForm.mainFormValue}
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="personal-reasons"
                    control={<Radio />}
                    label="Personal reasons or life changes"
                  />
                  <FormControlLabel
                    value="not-right"
                    control={<Radio />}
                    label="The seafood is not right for me"
                  />
                  <FormControlLabel
                    value="membership"
                    control={<Radio />}
                    label="I don’t want a membership right now"
                  />
                  <FormControlLabel
                    value="amount-wrong"
                    control={<Radio />}
                    label="The amount of seafood is not right"
                  />
                  <FormControlLabel
                    value="too-expensive"
                    control={<Radio />}
                    label="It’s too expensive"
                  />
                  <FormControlLabel
                    value="delivery-issues"
                    control={<Radio />}
                    label="Delivery or packaging issues"
                  />
                </RadioGroup>

                <button className={`btn sitkablue`} onClick={() => submitCancelPlan()}>
                  Cancel My Plan
                </button>
              </FormControl>
            </div>
            <div className={classes['options']}>
              {
                showPersonalReasonsForm && <a onClick={() => back()}>Back</a>
              }
              <a onClick={() => nevermind()}>Nevermind</a>
            </div>
          </div>
        </div>
      )
    } else {
      return
    }
  }

  return (
    <div className={classes['subscription-container']}>
      <div className={classes['summary']}>
        <div className={classes['details']}>
          <div>{sub.subscription_product0}</div>
          <div>
            <strong>Next Box Ships</strong>
          </div>
          <div>{moment(startShipDate).format('MMM D, YYYY')}</div>
        </div>
        <div className={classes['cancel']}>
          {/* TODO - Update this when Cancel Plan is supported - DAJ 20220912
            <a onClick={() => cancelPlan()}>Cancel Plan</a> */}
        </div>
      </div>

      {/* Plan Details */}
      {renderPlanDetails()}
    </div>
  )
}
