import { createContext, useContext, useState, useEffect } from 'react'
import CheckoutFlyout from '@/components/HeadlessCheckout/CheckoutFlyout'
import { useCustomerContext } from './CustomerContext'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router'

const HeadlessCheckoutContext = createContext()

export function useHeadlessCheckoutContext() {
  return useContext(HeadlessCheckoutContext)
}

export function HeadlessCheckoutProvider({ children }) {
  const router = useRouter()
  const [data, setData] = useState(null)
  const [PIGIMediaRules, setPIGIMediaRules] = useState([]);
  const [flyoutState, setFlyoutState] = useState(false)
  const { customer } = useCustomerContext()

  function saveDataInLocalStorage(data) {
    const checkoutData = {
      jwt: data.jwt_token,
      public_order_id: data.public_order_id,
      resumable_link: data.application_state.resumable_link || '',
    }
    localStorage.setItem('checkout_data', JSON.stringify(checkoutData))
  }

  function transformCustomerData(customer) {
    return {
      platform_id: customer.id.replace('gid://shopify/Customer/', ''),
      first_name: customer.firstName,
      last_name: customer.lastName,
      email_address: customer.email,
      accepts_marketing: customer.acceptsMarketing
    }
  }

  async function addNewSubscription(currSubscription, newSubscription) {
    const removedCurrSubscriptionResponse = await removeLineItem({
      line_item_key: currSubscription.product_data.line_item_key
    })
    const addedNewSubscriptionResponse = await addLineItem(newSubscription)
    console.log("replaced current subscription with new subscription")
  }

  async function addItemToOrder({variant, quantity = 1, properties = {}, openFlyout = true}) {
    if (!data) {
      return false;
    }

    const newItem = {
      variant,
      variantId: variant.id.replace('gid://shopify/ProductVariant/', ''),
      quantity,
      properties
    }

    // variant names need to be line item properties to render correctly in checkout
    newItem.variant.selectedOptions.forEach(option => {
      if (option.name === 'frequency') newItem.properties.frequency = option.value
      if (option.name === 'preference') newItem.properties.preference = option.value
    })

    const { line_items } = data.application_state
    const foundLineItem = line_items.find(item => item.product_data.id.includes(newItem.variantId))
    const foundSubscriptionItem = line_items.find(item => item.product_data.properties.membership_type)

    if (newItem.properties.membership_type && foundSubscriptionItem) {
      // if new item is a subscription and if there's a line item that is a subscription, replace it by removing it and then adding the new item
      const response = await addNewSubscription(foundSubscriptionItem, {
        platform_id: newItem.variantId,
        quantity: newItem.quantity,
        line_item_key: uuidv4(),
        line_item_properties: {
          ...newItem.properties,
        }
      })
    } else if (foundLineItem) {
      // if item exists, updatelineitem instead by incrementing quantity
        // TODO: if line item and new item is the same but has different properties,
        // (not subscription since the rule is to have only 1 subscription product per order)
        // then add a new line item instead.
      const response = await updateLineItem({
        quantity: foundLineItem.product_data.quantity + newItem.quantity,
        line_item_key: foundLineItem.product_data.line_item_key
      })
    } else {
      // if item doesn't exist, addline item
      const response = await addLineItem({
        platform_id: newItem.variantId,
        quantity: newItem.quantity,
        line_item_key: uuidv4(),
        line_item_properties: {
          ...newItem.properties,
        }
      })
    }
    if (openFlyout) {
      setFlyoutState(true)
    }
  }

  async function stylePaymentIframe() {
    const payload = {
      css_rules: [
        {
          "cssText": "* {font-family: 'FrankRuhl'; font-size: 16px; font-weight: 500; }"
        },
        {
          "cssText": ".TogglePanel__Header { height: 60px; display: flex; align-items: center; padding: 0 15px;}"
        },
        {
          "cssText": ".ToggleField__Input:focus { box-shadow: 0 0 0 2px #163144 inset !important;}"
        },
        {
          "cssText": ".ToggleField__Input--Checkbox:checked { box-shadow: 0 0 0 10px #163144 inset !important;}"
        },
        {
          "cssText": ".ToggleField__Input--Radio { box-shadow: 0 0 0 2px #fff inset !important; border: 1px solid #163144; background-color: #163144; }"
        },
        {
          "cssText": ".TogglePanelGroup { border-radius: 12px !important; border: 1px solid #eaeae9; }"
        },
        {
          "cssText": ".TogglePanel { border-bottom: 1px solid #eaeae9; }"
        },
        {
          "cssText": ".TogglePanel__Content { padding: 24px; border-top: 1px solid #eaeae9; background-color: #fffdfc; }"
        },
        {
          "cssText": ".Button--Primary { background-color: #163144;}"
        },
        {
          "cssText": ".Button--Primary:hover { background-color: #D18357;}"
        },
        {
          "cssText": ".Message--HasError { border-color: #c04a30; color: #C04A31;}"
        },
        {
          "cssText": ".InputField, .SelectField, .CreditCardInputField { border-radius: 12px; padding: 0 15px; height: 60px; }"
        }
      ],
      media_rules: [
        {
          "conditionText": "screen and (max-width: 767px)",
          "cssRules": [
            {
              "cssText": "* {font-size: 14px; }"
            },
            {
              "cssText": ".TogglePanel__Header { height: 48px; padding: 0 12px;}"
            },
            {
              "cssText": ".TogglePanel__Content { padding: 12px; }"
            },
            {
              "cssText": ".InputField, .SelectField, .CreditCardInputField { padding: 0 12px; height: 48px; }"
            }
          ]
        }
      ]
    }

    const { jwt, public_order_id } = JSON.parse(
      localStorage.getItem('checkout_data'),
    )
    const response = await fetch(
      `https://api.boldcommerce.com/checkout/storefront/${process.env.NEXT_PUBLIC_SHOP_IDENTIFIER}/${public_order_id}/payments/styles`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(payload),
      },
    )

    const { data } = await response.json()
    const { mediaRules } = data.style_sheet;

    setPIGIMediaRules(mediaRules);
    // console.log("check:", check)
  }

  // can only initializeCheckout if order has items
  async function initializeCheckout(payload = {}) {
    // payload example
    // {
    //   products: [
    //     { id: '39396153295034', quantity: 2 },
    //     { id: '39248899408058', quantity: 1 }
    //   ]
    // }
    // if the user is logged in add the attribute customer to the payload
    if (customer) {
      payload.customer = transformCustomerData(customer)
    }
    const res = await fetch(
      `${process.env.checkoutUrl}/api/checkout/initialize-otp`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    )
    const { data } = await res.json()
    saveDataInLocalStorage(data)
    console.log(data, 'init checkout')
    stylePaymentIframe()
    setData(data)
  }

  // this endpoint also refreshes the jwt
  async function resumeCheckout({ public_order_id }) {
    const payload = {
      publicOrderId: public_order_id,
    }
    const res = await fetch(
      `${process.env.checkoutUrl}/api/checkout/resume-order/`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    )
    const { data } = await res.json()
    // it's not needed to save all the data again but just to keep the jwt updated
    saveDataInLocalStorage(data)
    console.log(data, 'resumed checkout')
    stylePaymentIframe()
    setData(data)
  }

  async function processBoldOrder() {
    const { public_order_id, jwt } = JSON.parse(
      localStorage.getItem('checkout_data'),
    )
    const response = await fetch(
      `${process.env.checkoutUrl}/api/checkout/process-order/`,
      {
        method: 'POST',
        body: JSON.stringify({ publicOrderId: public_order_id, jwt }),
      },
    )
    const data = await response.json()

    // remove local storage data if the order has been processed
    if (data.application_state.is_processed) {
      localStorage.setItem('checkout_data', JSON.stringify({}))
    }
  }

  async function updateLineItem(payload) {
    // payload example
    //   {
    //     quantity: 3,
    //     line_item_key: '977a6d10-43c5-414a-a60f-f1b551cbc3cf'
    //   }
    console.log(payload)
    const { jwt, public_order_id } = JSON.parse(
      localStorage.getItem('checkout_data'),
    )
    const response = await fetch(
      `https://api.boldcommerce.com/checkout/storefront/${process.env.NEXT_PUBLIC_SHOP_IDENTIFIER}/${public_order_id}/items`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify(payload),
      },
    )
    const updatedData = await response.json()
    console.log('response update line item', updatedData)
    setData({
      ...data,
      application_state: updatedData.data.application_state
    })
    return updatedData
  }

  async function addLineItem(payload) {
    // payload example. platform_id is the variant id
    // {
    //   quantity: 1,
    //   line_item_key: '977a6d10-43c5-414a-a60f-f1b551cbc3cf',
    //   platform_id: '39396153295034'
    // }
    console.log(payload)
    const { jwt, public_order_id } = JSON.parse(
      localStorage.getItem('checkout_data'),
    )
    const response = await fetch(
      `https://api.boldcommerce.com/checkout/storefront/${process.env.NEXT_PUBLIC_SHOP_IDENTIFIER}/${public_order_id}/items`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(payload),
      },
    )
    const updatedData = await response.json()
    console.log('response add line item', updatedData)
    setData({
      ...data,
      application_state: updatedData.data.application_state
    })
    return updatedData
  }

  async function removeLineItem(payload) {
    // payload example
    // {
    //   quantity: 1,
    //   line_item_key: '977a6d10-43c5-414a-a60f-f1b551cbc3cf'
    // }
    console.log(payload)
    const { jwt, public_order_id } = JSON.parse(
      localStorage.getItem('checkout_data'),
    )
    const response = await fetch(
      `https://api.boldcommerce.com/checkout/storefront/${process.env.NEXT_PUBLIC_SHOP_IDENTIFIER}/${public_order_id}/items`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
        body: JSON.stringify(payload),
      },
    )
    const updatedData = await response.json()
    console.log('response remove line item', updatedData)
    setData({
      ...data,
      application_state: updatedData.data.application_state
    })
    return updatedData
  }

  // this keeps closing the flyout since the route changes on processing order

  // useEffect(() => {
  //   const handleRouteChange = () => {
  //     console.log("wut")
  //     setFlyoutState(false)
  //   }
  //   router.events.on('routeChangeStart', handleRouteChange)
  //   return () => {
  //     router.events.off('routeChangeStart', handleRouteChange)
  //   }
  // }, [])

  useEffect(() => {
    const localStorageCheckoutData =
      JSON.parse(localStorage.getItem('checkout_data')) || '';
    // resume checkout if there's a checkout saved otherwise initialize it
    if (Object.keys(localStorageCheckoutData).length) {
      resumeCheckout(localStorageCheckoutData);
    } else {
      initializeCheckout()
    }
  }, [])

  useEffect(() => {
    if (flyoutState) document.querySelector('html').classList.add('disable-scroll')
    if (!flyoutState) document.querySelector('html').classList.remove('disable-scroll')
  }, [flyoutState]);

  return (
    <HeadlessCheckoutContext.Provider
      value={{
        data,
        initializeCheckout,
        resumeCheckout,
        processBoldOrder,
        updateLineItem,
        addLineItem,
        removeLineItem,
        flyoutState,
        setFlyoutState,
        addItemToOrder,
        PIGIMediaRules
      }}
    >
      <CheckoutFlyout />
      {children}
    </HeadlessCheckoutContext.Provider>
  )
}
