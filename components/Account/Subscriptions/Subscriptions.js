import React, { useEffect, useState } from 'react'
import Sub from './Sub'
import classes from './Subscriptions.module.scss'
import { nacelleClient } from 'services'
import { GET_PRODUCTS } from '@/gql/index.js'
import Link from 'next/link'

export default function SubscriptionsPage({ subsData, membershipData }) {
  const [products, setProducts] = useState(null)
  useEffect(() => {
    const getProducts = async () => {
      let products = await nacelleClient.query({
        query: GET_PRODUCTS,
      })
      setProducts(products.products)
      console.log('products', products)
    }
    getProducts()
  }, [])

  const renderSubscriptions = () => {
    return subsData.length > 0 ? (
      subsData.map((sub, index) => {
        return (
          <Sub
            key={sub.subscription_id}
            defaultOpen={index === 0}
            subscription={sub}
            products={products}
            membership={membershipData}
          ></Sub>
        )
      })
    ) : (<>
      <h4>
        No active subscriptions
      </h4>
      <h5><Link href="/pages/choose-your-plan">Choose your plan.</Link></h5>
      </>
    )
  }
  return !!products ? (
    <div className={classes['subscriptions']}>{renderSubscriptions()}</div>
  ) : null
}
