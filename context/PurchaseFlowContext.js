import { createContext, useContext, useState, useEffect } from 'react'
import * as Cookies from 'es-cookie'

const PurchaseFlowContext = createContext()

export function usePurchaseFlowContext() {
  return useContext(PurchaseFlowContext)
}

export function PurchaseFlowProvider({ children }) {

  const [options, setOptions] = useState({
    step: 2,
    product: undefined,
    variantSelected: undefined,
    membership_type: undefined // could be monthly or prepaid
  })

  useEffect(() => {
    const purchaseFlowData = Cookies.get('purchaseFlowData')
    if (purchaseFlowData) {
      setOptions(JSON.parse(purchaseFlowData))
    }
  }, [])

  useEffect(() => {
    // Cookies.set('purchaseFlowData', JSON.stringify(options), { expires: 1, path: '/' })
  }, [options])

  return (
    <PurchaseFlowContext.Provider value={{options, setOptions}}>
      {children}
    </PurchaseFlowContext.Provider>
  )
}