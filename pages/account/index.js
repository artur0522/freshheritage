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
  const getTabKey = (tabValue) =>
    Object.keys(tabs).find((key) => tabs[key] === tabValue)

  const tabs = useMemo(
    () => ({
      'subscriptions': 'Your Subscriptions',
      'account-details': 'Account Details',
      'order-history': 'Order History',
      'referrals': 'Refer a Friend',
    }), []
  )
  const [selectedTab, setSelectedTab] = useState(router.query.tab)

  useEffect(() => {
    // check params
    if (!router.query.tab || !tabs[router.query.tab]) {
      router.push(
        {
          pathname: '/account',
          query: { tab: Object.keys(tabs)[0] },
        },
        undefined,
        { shallow: true },
      )
    }
  }, [router, tabs])

  useEffect(() => {
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
  }, [customerContext.customer])

  const onTabSelected = (tab) => {
    const tabKey = getTabKey(tab)
    setSelectedTab(tabKey)

    router.push(
      {
        pathname: '/account',
        query: { tab: tabKey },
      },
      undefined,
      { shallow: true },
    )
  }

  const renderTab = () => {
    const tabs = {
      subscriptions: SubscriptionsPage,
      'account-details': AccountDetailsPage,
      'order-history': OrderHistoryPage,
      referrals: ReferralsPage,
    }
    return !!tabs[router.query.tab]
      ? tabs[router.query.tab]()
      : SubscriptionsPage()
  }

  return (
    <div className={`${classes['main']}`}>
      {customerContext.customer && subsData && membershipData ? (
        <div>
          <AccountHeader
            firstName={customerContext.customer?.firstName}
          ></AccountHeader>
          <div className={classes['tabs-container']}>
            <Tabs
              tabs={Object.values(tabs)}
              selected={tabs[selectedTab]}
              onSelected={onTabSelected}
            ></Tabs>
          </div>
          <div>{renderTab()}</div>
        </div>
      ) : (
        <div>LOADING</div>
      )}
    </div>
  )
}
