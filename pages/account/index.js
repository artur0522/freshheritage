import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useCustomerContext } from '@/context/CustomerContext'
import classes from './AccountMainPage.module.scss'
import AccountHeader from '@/components/Account/AccountHeader'
import Tabs from '@/components/Tabs/Tabs'
import ReferralsPage from '@/components/Account/Referrals/Referrals'
import AccountDetailsPage from '@/components/Account/AccountDetails/AccountDetails'
import OrderHistoryPage from '@/components/Account/OrderHistory/OrderHistory'
import SubscriptionsPage from '@/components/Account/Subscriptions/Subscriptions'

export default function AccountMainPage() {
  const router = useRouter()
  const customerContext = useCustomerContext()
  console.log(`customerContext: `, customerContext)

  const [subsData, setSubsData] = useState(null)
  const [membershipData, setMembershipData] = useState(null)
  const getTabKey = (tabValue) => Object.keys(tabs).find(key => tabs[key] === tabValue);
  const tabs = useMemo(() => ({
    'Your Subscriptions': 'subscriptions',
    'Account Details': 'account-details',
    'Order History': 'order-history',
    'Refer a Friend': 'referrals',
  }), []);
  const [selectedTab, setSelectedTab] = useState(getTabKey(router.query.tab));


  useEffect(() => {
    // check params
    if (!router.query.tab) {
      router.push({
        pathname: '/account',
        query: { tab: tabs[Object.values(tabs)[0]] },
      }, undefined, {shallow: true});
    }

    // Getting customer info
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
  }, [customerContext.customer, router, tabs])

  const onTabSelected = (tab) => {
    setSelectedTab(tab)
    router.push({
      pathname: '/account',
      query: { tab: tabs[tab] },
    }, undefined, {shallow: true});
  }

  const renderTab = () => {
    const tabs = {
      'subscriptions': SubscriptionsPage,
      'account-details': AccountDetailsPage,
      'order-history': OrderHistoryPage,
      'referrals': ReferralsPage,
    }
    return !!tabs[router.query.tab] ? tabs[router.query.tab]() : SubscriptionsPage()
  }

  return (
    <div className={`${classes['main']}`}>
      {customerContext.customer && subsData && membershipData ? (
        <AccountHeader
          firstName={customerContext.customer?.firstName}
        ></AccountHeader>
      ) : (
        <div>LOADING</div>
      )}
      <div className={classes['tabs-container']}>
        <Tabs tabs={Object.keys(tabs)} selected={selectedTab} onSelected={onTabSelected}></Tabs>
      </div>
      <div>{ renderTab() }</div>
    </div>
  )
}
