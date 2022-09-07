import React, { useState } from 'react'
import classes from './MiniDetails.module.scss'
import Image from 'next/image'

export default function MiniDetails({ subscription, month, membership }) {
  const fishToShow = Object.values(month.fishArray)
    .filter((fish) => !!fish.species)
    .map((fish) => fish.species)

  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const currentChargeDate = new Date(subscription.subscription_next_orderdate)

  return (
    <div className={classes['mini-details']}>
      <div className={classes['mini-harvest']}>
        {fishToShow.map((fish) => (
          <div
            className={classes['fish-row']}
            key={`fish-detail-line-${fish._id}`}
          >
            <Image
              src={fish.image.asset.url}
              alt={fish.title}
              width={214}
              height={143}
            />
            <h4>{fish.title}</h4>
          </div>
        ))}
      </div>
      <div className={classes['payment-details']}>
        {membership.prepaid_cta_status === 'na' // TODO FLIP BACK WHEN FOR REAL
          ? renderNoPrepaidNecessary(subscription)
          : renderWithPrepaidCTA(
              subscription,
              currentChargeDate,
              membership,
              saving,
              setSaving,
              successMessage,
              setSuccessMessage,
              errorMessage,
              setErrorMessage,
            )}
      </div>
    </div>
  )
}

const renderNoPrepaidNecessary = (subscription) => {
  // TODO Adjust when dealing with multiple line items
  return (
    <>
      <h4>
        Prepaid box{' '}
        <span className={classes['date']}>
          {subscription.subscription_lineitems[0].prepaid_next_count} of{' '}
          {subscription.subscription_lineitems[0].prepaid_duration}
        </span>
      </h4>
    </>
  )
}

const renderWithPrepaidCTA = (
  subscription,
  currentChargeDate,
  membershipData,
  saving,
  setSaving,
  successMessage,
  setSuccessMessage,
  errorMessage,
  setErrorMessage,
) => {
  return (
    <>
      <h4>
        Next Charge{' '}
        <span className={classes['date']}>
          {currentChargeDate.toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </h4>
      <div className={classes['payment-details-line-2']}>
        $
        {
          subscription.subscription_lineitems[0].price /
            100 /*TODO Fix this when we do multiple line items*/
        }{' '}
        &#x2022; Ships Monthly
      </div>
      {!successMessage ? (
        <button
          disabled={saving}
          className={`btn salmon ${classes['prepay-btn']}`}
          onClick={() => {
            setSaving(true)
            setSuccessMessage('')
            setErrorMessage('')

            fetch(`/api/account/membership-cta`, {
              method: 'POST',
              body: JSON.stringify({
                cId: membershipData.customer_id,
                product: membershipData.prepaid_cta.product_name,
                total_price: membershipData.prepaid_cta.total_price,
                cta: 'prepaid', // can also extend this in the future to support 'enroll',
              }),
            })
              .then((_res) => {
                console.log('prepaid ok')
                setSuccessMessage(
                  'Request received, your subscription will be updated within 1-2 business days',
                )
                setSaving(false)
              })
              .catch(() => {
                console.log('prepaid failed')
                setErrorMessage('There was a problem submitting your request.');
                setSaving(false);
              })
          }}
        >
          Upgrade to Prepaid and Save 3%
        </button>
      ) : null}
      {successMessage ? (
        <div className={classes['success-message']}>{successMessage}</div>
      ) : null}
      {errorMessage ? (
        <div className={classes['error-message']}>{errorMessage}</div>
      ) : null}
    </>
  )
}
