import React, { useEffect } from 'react'
import { useCustomerContext } from '@/context/CustomerContext'
import classes from './AccountMainPage.module.scss'

export default function AccountMainPage() {

  const retrieveSubs = async (id) => {
    useEffect(() => {
      fetch('/api/account/get-subs?cID='+id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // TODO:
          // 'Authorization': `Bearer test`,
        }
      })
      .then(res => res.json())
      .then(res => {
        if (res.message === 'success') {
          const results = res.data
          console.log('get-subs',results)

        }
      })
    }, [])
  };

  

  const customerContext = useCustomerContext();
  console.log(`customerContext: `, customerContext);

  {customerContext.customer?.id &&
    console.log(customerContext.customer?.displayName ?? 'NOT LOADED');
    retrieveSubs(customerContext.customer?.id.substring(100, 23));
  }
  
  return (<div className={`${classes['main']}`}><div className={`${classes['greeting']}`}>Welcome to the account page, {customerContext.customer?.displayName ?? 'LOADING...'}</div></div>)
}
