import React from 'react';
// import ReactDOM from "react-dom";
// import { useRouter, BrowserRouter } from 'next/router';
import NoSSRWrapper from '../../components/no-ssr-wrapper';
import '../../i18n/config';
import StateBasedCheckout from './StateBasedCheckout';

export async function getServerSideProps(context) {
  console.log('SSR Started for Inventory Issues: ', context.query);

  const publicOrderId = context.query.public_order_id;
  const cartId = context.query.cart_id;

  const res = await fetch(
    'https://sitkasalmontest.ngrok.io/api/checkout?public_order_id=' +
      publicOrderId +
      '&cart_id=' +
      cartId
  );
  const data = await res.json();

  const variants = context.query.variants;

  // console.log("useinventory env: "+process.env.INVENTORY_URL);
  // const response = await fetch(`${process.env.INVENTORY_URL}?variants=${variants}`);
  const response = await fetch(
    `https://sitkasalmontest.ngrok.io/api/checkout/validateInventory?variants=${variants}`
  );
  let inventory = await response.json();
  data.application_state.inventory = inventory;

  return { props: { data } };
}

const checkoutIssues = (props) => {
  // console.log("from issues:",props.data);
  return (
    <NoSSRWrapper>
      <StateBasedCheckout data={props.data} />
    </NoSSRWrapper>
  );
};

export default checkoutIssues;
