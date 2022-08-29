import React from 'react'
import classes from './AccountDetails.module.scss'
import AccountDetailSubscription from './AcountDetailSubsciption/AccountDetailSubscription'

export default function AccountDetailsPage({subscriptions, membershipData, customer}) {

  const activeSubscriptions = subscriptions.map((sub, index) => {
    return (
      <AccountDetailSubscription sub={sub} key={`sub-${index}`}></AccountDetailSubscription>
    )
  })

  return (
    <div className={classes['account-details']}>
      <h3>Account Details</h3>

      <h5>My Info</h5>
      <div className={classes['customer-email-info']}>
        <div>
          <div>{customer.email}</div>
          <div>*********</div>
        </div>
        <div className={classes['reset']}>
          <a>Send Password Reset</a>
        </div>
      </div>

      <h3>My Subscriptions</h3>

      { activeSubscriptions }

    </div>
  )
}
