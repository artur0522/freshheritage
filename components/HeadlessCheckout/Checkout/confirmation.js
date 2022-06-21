import React from 'react'
import NoSSRWrapper from '../no-ssr-wrapper'
import '../../i18n/config'
import StateBasedCheckout from './StateBasedCheckout'

export async function getServerSideProps(context) {
  console.log('SSR Started for Order Confirmation: ', context.query)

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

  return { props: { data } }
}

const checkoutConfirmation = (props) => {
  // console.log("from confirmation:",props.data);
  return (
    <NoSSRWrapper>
      <StateBasedCheckout data={props.data} />
    </NoSSRWrapper>
  )
}

export default checkoutConfirmation
