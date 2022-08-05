import { createContext, useContext, useState, useEffect } from 'react'
import { nacelleClient } from 'services'
import { useHeadlessCheckoutContext } from './HeadlessCheckoutContext'
import { useRouter } from 'next/router'
import { getCartVariant } from 'utils/getCartVariant'
import { GET_PRODUCTS } from '../gql'
import { getSubscriptionInfo } from '@/utils/getSubscriptionInfo'

const PurchaseFlowContext = createContext()

export function usePurchaseFlowContext() {
  return useContext(PurchaseFlowContext)
}

export function PurchaseFlowProvider({ children }) {

  const router = useRouter()
  const { addItemToOrder } = useHeadlessCheckoutContext()
  const [options, setOptions] = useState({
    step: 1,
    product: null,
    productHandle: null,
    variantIdSelected: null,
    shellfish_free_selected: false, // is required to select a variant id specifically for premium seafood subscription box (hardcoded logic)
    membership_type: null, // values can either be regular or prepaid
    is_loaded: false
  })

  // step 1 - selecting product
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

  // step 2 - selecting membership and frequency variant option
  const selectMembershipPlan = async (variantSelected, membershipType) => {
    console.log("variantSelected:", variantSelected)
    setOptions({
      ...options,
      step: 3,
      membership_type: membershipType,
      variantIdSelected: variantSelected.sourceEntryId
    })
    // add to cart
    const variant = getCartVariant({
      product: options.product,
      variant: variantSelected
    });

    let subscriptionProperties = {}
    let subscriptionGroup = options.product.metafields.find(metafield => metafield.key === 'subscription_group')
    const frequency = variantSelected.content.selectedOptions.find(option => option.name === 'frequency')


    if (subscriptionGroup) {
      subscriptionGroup = JSON.parse(subscriptionGroup.value)
      // console.log("subscriptionGroup:", subscriptionGroup)
      subscriptionProperties = getSubscriptionInfo({
        subscriptionGroup,
        frequencyName: frequency.value,
        membershipType,
        duration: 12
      })
    }

    await addItemToOrder({
      variant: variant,
      properties: {
        ...subscriptionProperties,
        membership_type: membershipType,
        shipments: '12'
      },
      open_flyout: false
    })
    .then(() => {
      router.push('/checkout')
    })
  }

  // on browser back button, reset step back to 1
  useEffect(() => {
    router.beforePopState(({ as }) => {
      if (as.includes('/pages/choose-your-plan') && router.asPath === '/pages/customize-your-plan') {
        setOptions({
          ...options,
          step: 1,
          is_loaded: true
        })
      }
      if (as.includes('/pages/customize-your-plan') && router.asPath === '/checkout') {
        setOptions({
          ...options,
          step: 2,
          is_loaded: true
        })
      }
      return true
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [router, options])

  // on page load, get saved data from local storage
  useEffect(() => {
    async function updateOptions() {
      let localStoragePurchaseFlowData = JSON.parse(localStorage.getItem('purchase_flow_data')) || {...options};
      if (Object.keys(localStoragePurchaseFlowData).length) {
        if (localStoragePurchaseFlowData.productHandle) {
          const { products } = await nacelleClient.query({
            query: GET_PRODUCTS,
            variables: {
              "filter": {
                "handles": [localStoragePurchaseFlowData.productHandle]
              }
            }
          })
          localStoragePurchaseFlowData.product = products[0]
        }
      }
      setOptions({...localStoragePurchaseFlowData, is_loaded: true})
    }
    updateOptions()
  }, [])

  useEffect(() => {
    const pages = [
      '/pages/choose-your-plan',
      '/pages/customize-your-plan'
    ]
    if (pages.includes(router.pathname) && options.is_loaded) {
      if (options.step === 1 && router.pathname !== '/pages/choose-your-plan') {
        router.push('/pages/choose-your-plan')
      }
      if (options.step === 2 && router.pathname !== '/pages/customize-your-plan') {
        router.push('/pages/customize-your-plan')
      }
    }
  }, [options, router])

  useEffect(() => {
    // console.log("options useEffect:", options)
    const saveData = {...options};
    delete saveData.product
    localStorage.setItem('purchase_flow_data', JSON.stringify(saveData))
  }, [options])

  return (
    <PurchaseFlowContext.Provider value={{options, setOptions, selectBox, selectMembershipPlan}}>
      {children}
    </PurchaseFlowContext.Provider>
  )
}