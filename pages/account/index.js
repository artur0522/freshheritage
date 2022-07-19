import React from 'react'
import { useCustomerContext } from '@/context/CustomerContext'
import classes from './AccountMainPage.module.scss'

export default function AccountMainPage() {

  const customerContext = useCustomerContext();
  console.log(`customerContext: `, customerContext);
  console.log(customerContext.customer?.displayName ?? 'NOT LOADED');
  return (<div className={`${classes['main']}`}><div className={`${classes['greeting']}`}>Welcome to the account page, {customerContext.customer?.displayName ?? 'LOADING...'}</div></div>)
}
