import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useCustomerContext } from './CustomerContext'

const MemberAccountContext = createContext()

export function useMemberAccountContext() {
  return useContext(MemberAccountContext)
}

export function MemberAccountContextProvider({ children }) {
  const customerContext = useCustomerContext()
  console.log(`customerContext: `, customerContext)

  const [reloadingData, setReloadingData] = useState(false);
  const [subsData, setSubsData] = useState(null);
  const [membershipData, setMembershipData] = useState(null);

  const fetchCustomerData = useCallback(() => {
    setReloadingData(true);
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
          setReloadingData(false);
        })

      fetch('/api/account/get-membership?cID=' + id)
        .then((res) => res.json())
        .then((res) => {
          if (res.message === 'success') {
            setMembershipData(res.data)
            console.log('membership', res.data)
          }
          setReloadingData(false);
        })
    }
  }, [customerContext.customer]);

  useEffect(() => {
    // Getting customer info
    console.log('running effect with customer ', customerContext.customer)
    fetchCustomerData();
  }, [fetchCustomerData, customerContext.customer])

  return (
    <MemberAccountContext.Provider value={{subsData, membershipData, reloadingData, fetchCustomerData}}>
      {children}
    </MemberAccountContext.Provider>
  )
}
