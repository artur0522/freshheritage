import { createContext, useContext, useState, useEffect } from 'react'
import * as Cookies from 'es-cookie'

const PurchaseFlowContext = createContext()

export function usePurchaseFlowContext() {
  return useContext(PurchaseFlowContext)
}

export function PurchaseFlowProvider({ children }) {

  const [purchaseFlow, setPurchaseFlow] = useState({
    step: 1,
    product: undefined,
    variantSelected: undefined,
    membership_type: undefined // could be monthly or prepaid
  })

  useEffect(() => {
    const purchaseFlowData = Cookies.get('purchaseFlowData')
    if (purchaseFlowData) {
      setPurchaseFlow(JSON.parse(purchaseFlowData))
    }
  }, [])

  useEffect(() => {
    Cookies.set('purchaseFlowData', JSON.stringify(purchaseFlow), { expires: 1, path: '/' })
  }, [purchaseFlow])

  return (
    <PurchaseFlowContext.Provider value={{purchaseFlow, setPurchaseFlow}}>
      {children}
    </PurchaseFlowContext.Provider>
  )
}