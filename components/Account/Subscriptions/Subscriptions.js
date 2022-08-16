import React, { useEffect, useState } from 'react'
import Sub from './Sub'
import classes from './Subscriptions.module.scss'
import { nacelleClient } from 'services'
import { GET_PRODUCTS } from '@/gql/index.js'

export default function SubscriptionsPage({ subsData, membershipData }) {
  const [products, setProducts] = useState(null);
  useEffect(() => {
    const getProducts = async () => {
      let products = await nacelleClient.query({
        query: GET_PRODUCTS,
      });
      setProducts(products.products);
      console.log('products', products);
    }
    getProducts()
  }, [])

  const renderSubscriptions = () => {
    return subsData.map((sub, index) => {
      return <Sub key={sub.subscription_id} defaultOpen={index === 0} subscription={sub} products={products}></Sub>
    })
  }
  return !!products ? <div className={classes['subscriptions']}>{renderSubscriptions()}</div> : null;
}
