import React, { useEffect, useState } from 'react'
import { useCustomerContext } from '@/context/CustomerContext'
import classes from './AccountMainPage.module.scss'
import AccountHeader from '@/components/Account/AccountHeader'

export default function AccountMainPage() {
  const customerContext = useCustomerContext()
  console.log(`customerContext: `, customerContext)

  const [subsData, setSubsData] = useState(null)
  const [membershipData, setMembershipData] = useState(null)

  useEffect(() => {
    console.log('running effect with customer ', customerContext.customer)
    if (customerContext.customer?.id) {
      const idArr = customerContext.customer.id.split('/')
      const id = idArr[idArr.length - 1]
      fetch('/api/account/get-subs?cID=' + id)
        .then((res) => res.json())
        .then((res) => {
          if (res.message === 'success') {
            setSubsData(res.data)
            console.log('get-subs', res.data)
          }
        })

      fetch('/api/account/get-membership?cID=' + id)
        .then((res) => res.json())
        .then((res) => {
          if (res.message === 'success') {
            setMembershipData(res.data)
            console.log('membership', res.data)
          }
        })
    }
  }, [customerContext.customer])

  // {customerContext.customer?.id &&
  //   console.log(customerContext.customer?.displayName ?? 'NOT LOADED');
  //   retrieveSubs(customerContext.customer?.id.substring(100, 23));
  // }

  return (
    <div className={`${classes['main']}`}>
      {customerContext.customer && subsData && membershipData ? (
        <AccountHeader
          firstName={customerContext.customer?.firstName}
        ></AccountHeader>
      ) : (
        <div>LOADING</div>
      )}
      {/* <div className={`${classes['greeting']}`}>
        Welcome to the account page,{' '}
        {customerContext.customer?.displayName ?? 'LOADING...'}
      </div> */}
    </div>
  )
}
