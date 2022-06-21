import React from 'react'
import NoSSRWrapper from '../no-ssr-wrapper'
import '../../i18n/config'
import StateBasedCheckout from './StateBasedCheckout'

export async function getServerSideProps(context) {
  console.log('SSR Started for Inventory Issues: ', context.query)

  const publicOrderId = context.query.public_order_id
  const cartId = context.query.cart_id

  const res = await fetch(
    process.env.checkoutUrl +
      '/api/checkout?public_order_id=' +
      publicOrderId +
      '&cart_id=' +
      cartId,
  )
  const data = await res.json()

  const variants = context.query.variants

  // console.log("useinventory env: "+process.env.NEXT_PUBLIC_INVENTORY_URL);
  // const response = await fetch(`${process.env.NEXT_PUBLIC_CHECKOUT_URL}${process.env.NEXT_PUBLIC_INVENTORY_URL}?variants=${variants}`);
  const response = await fetch(
    `${process.env.checkoutUrl}/api/checkout/validateInventory?variants=${variants}`,
  )
  let inventory = await response.json()
  data.application_state.inventory = inventory

  return { props: { data } }
}

const checkoutIssues = (props) => {
  // console.log("from issues:",props.data);
  return (
    <NoSSRWrapper>
      <StateBasedCheckout data={props.data} />
    </NoSSRWrapper>
  )
}

export default checkoutIssues
