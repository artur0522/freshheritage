import { createContext, useContext, useState } from 'react'
import CheckoutFlyout from '@/components/HeadlessCheckout/CheckoutFlyout'

const HeadlessCheckoutContext = createContext()

export function useHeadlessCheckoutContext() {
  return useContext(HeadlessCheckoutContext)
}

export function HeadlessCheckoutProvider({ children }) {
  const [data, setData] = useState()
  const [flyoutState, setFlyoutState] = useState(false)

  function saveDataInLocalStorage(data) {
    const checkoutData = {
      jwt: data.jwt_token,
      public_order_id: data.public_order_id,
      resumable_link: data.application_state.resumable_link || '',
    }
    localStorage.setItem('checkout_data', JSON.stringify(checkoutData))
  }

  async function initializeCheckout(payload) {
    // payload example
    // {
    //   products: [
    //     { id: '39396153295034', quantity: 2 },
    //     { id: '39248899408058', quantity: 1 }
    //   ]
    // }
    // if the user is logged in add the attribute customer to the payload
    // if (customer) {
    //   payload.customer = customer
    // }
    const res = await fetch(
      `${process.env.checkoutUrl}/api/checkout/initialize-otp`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    )
    const { data } = await res.json()
    saveDataInLocalStorage(data)

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

  async function getLineItemsFromOrder() {
    const { jwt, public_order_id } = JSON.parse(
      localStorage.getItem('checkout_data'),
    )
    const response = await fetch(
      `https://api.boldcommerce.com/checkout/storefront/${process.env.SHOP_IDENTIFIER}/${public_order_id}/items`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      },
    )
    const { data } = await response.json()
    console.log(data)
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
      `https://api.boldcommerce.com/checkout/storefront/${process.env.SHOP_IDENTIFIER}/${public_order_id}/items`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify(payload),
      },
    )
    const data = await response.json()
    console.log('response update line item', data)
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
      `https://api.boldcommerce.com/checkout/storefront/${process.env.SHOP_IDENTIFIER}/${public_order_id}/items`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(payload),
      },
    )
    const data = await response.json()
    console.log('response add line item', data)
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
      `https://api.boldcommerce.com/checkout/storefront/${process.env.SHOP_IDENTIFIER}/${public_order_id}/items`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
        body: JSON.stringify(payload),
      },
    )
    const data = await response.json()
    console.log('response remove line item', data)
  }

  return (
    <HeadlessCheckoutContext.Provider
      value={{
        data,
        initializeCheckout,
        resumeCheckout,
        processBoldOrder,
        getLineItemsFromOrder,
        updateLineItem,
        addLineItem,
        removeLineItem,
        flyoutState,
        setFlyoutState,
      }}
    >
      <CheckoutFlyout />
      {children}
    </HeadlessCheckoutContext.Provider>
  )
}
