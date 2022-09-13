import React, { useState } from 'react'
import classes from './AccountDetails.module.scss'
import AccountDetailSubscription from './AcountDetailSubsciption/AccountDetailSubscription'
import { useCustomerContext } from '@/context/CustomerContext'

export default function AccountDetailsPage({subscriptions, membershipData, customer}) {
  const customerContext = useCustomerContext()
  const [resettingPassword, setResettingPassword] = useState(false)

  const resetPassword = async () => {
    setResettingPassword(true)
    const result = await customerContext.recover({
      email: customer.email,
    })
    console.log(result)
    setResettingPassword(false)
  }

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
          <div className={classes['email']}>{customer.email}</div>
          <div>*********</div>
        </div>
        <div className={classes['reset']}>
          <a onClick={() => resetPassword()}>{resettingPassword ? 'Sending...' : 'Send Password Reset'}</a>
        </div>
      </div>

      <h3>My Subscriptions</h3>

      { activeSubscriptions }

    </div>
  )
}
