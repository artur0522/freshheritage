import { createContext, useContext, useState, useEffect } from 'react'
import { nacelleClient } from 'services'
import * as Cookies from 'es-cookie'

const PurchaseFlowContext = createContext()

export function usePurchaseFlowContext() {
  return useContext(PurchaseFlowContext)
}

export function PurchaseFlowProvider({ children }) {

  const [tierOptions, setTierOptions] = useState([])
  const [options, setOptions] = useState({
    step: 1,
    product: null,
    productHandle: null,
    variantIdSelected: null,
    shellfish_free_selected: false, // only needed to select variant Id specifically for premium seafood subscription box (hardcoded logic)
    membership_type: null, // values can either be regular or prepaid
    is_loaded: false
  })

  const selectBox = (product, shellfish_free_selected = false) => {
    if (product.content.handle !== 'premium-seafood-subscription-box') {
      shellfish_free_selected = false
    }
    setOptions({
      ...options,
      product,
      productHandle: product.content.handle,
      step: 2,
      shellfish_free_selected
    })
  }

  const selectMembershipPlan = (variantSelected, membershipType) => {
    // select membership plan based on options
    setOptions({
      ...options,
      membership_type: membershipType,
      variantIdSelected: variantSelected.sourceEntryId
    })
      // redirect to checkout - add in useeffect
  }

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
    console.log("options useEffect:", options)
    const cookieReadyOptions = {...options}
    delete cookieReadyOptions.product
    Cookies.set('purchaseFlowData', JSON.stringify(cookieReadyOptions), { expires: 1, path: '/' })
  }, [options])

  return (
    <PurchaseFlowContext.Provider value={{options, setOptions, tierOptions, setTierOptions, selectBox, selectMembershipPlan}}>
      {children}
    </PurchaseFlowContext.Provider>
  )
}