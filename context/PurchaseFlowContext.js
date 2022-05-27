import { createContext, useContext, useState, useEffect } from 'react'
import { nacelleClient } from 'services'
import * as Cookies from 'es-cookie'

const PurchaseFlowContext = createContext()

export function usePurchaseFlowContext() {
  return useContext(PurchaseFlowContext)
}

export function PurchaseFlowProvider({ children }) {

  const [options, setOptions] = useState({
    step: 1,
    product: null,
    productHandle: null,
    variantIdSelected: null,
    membership_type: null, // could be monthly or prepaid
    is_loaded: false
  })

  useEffect(() => {
    async function updateOptions() {
      let purchaseFlowData = Cookies.get('purchaseFlowData')
      if (purchaseFlowData) {
        purchaseFlowData = JSON.parse(purchaseFlowData)
        if (purchaseFlowData.productHandle) {
          const product = await nacelleClient.products({
            handles: [purchaseFlowData.productHandle]
          })
          purchaseFlowData.product = product[0]
        }
        console.log("update purchaseFlow options:", purchaseFlowData)
        setOptions({...purchaseFlowData, is_loaded: true})
      }
    }
    updateOptions()
  }, [])

  useEffect(() => {
    const cookieReadyOptions = {...options}
    delete cookieReadyOptions.product
    Cookies.set('purchaseFlowData', JSON.stringify(cookieReadyOptions), { expires: 1, path: '/' })
  }, [options])

  return (
    <PurchaseFlowContext.Provider value={{options, setOptions}}>
      {children}
    </PurchaseFlowContext.Provider>
  )
}