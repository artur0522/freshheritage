import React, { useContext, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@nacelle/react-components';
import * as styles from './Checkout.styles';
import { StateBasedCheckout } from '../Checkout/StateBasedCheckout';
import { useHeadlessCheckoutContext } from '../../context/HeadlessCheckoutContext';

const Checkout = () => {
  const {
    data,
    initializeCheckout,
    resumeCheckout,
    // getLineItemsFromOrder,
    // updateLineItem,
    // addLineItem,
    // removeLineItem
    flyoutState,
    setFlyoutState
  } = useHeadlessCheckoutContext();

  useEffect(() => {
    const localStorageCheckoutData =
      JSON.parse(localStorage.getItem('checkout_data')) || '';
    // resume checkout if there's a checkout saved otherwise initialize it
    if (Object.keys(localStorageCheckoutData).length) {
      resumeCheckout(localStorageCheckoutData);
    } else {
      initializeCheckout({
        products: [{ id: '39396153295034', quantity: 2 }]
      });
    }
  }, []);

  const checkoutStateStyle = flyoutState ? styles.show : styles.hide;

  return (
    <div css={[styles.cart, checkoutStateStyle]}>
      <header css={styles.cartHeader}>
        <h3 css={styles.cartTitle}>Flyout Checkout</h3>
        <Button
          styles={styles.closeButton}
          onClick={() => setFlyoutState(false)}
        >
          {/* <Image
            alt="cross for closing the cart"
            src="https://nacelle-assets.s3-us-west-2.amazonaws.com/default-close-icon.svg"
            width="15"
            height="25"
            css={styles.closeIcon}
          /> */}
        </Button>
      </header>
      <section css={styles.cartItems}>
        {data && <StateBasedCheckout data={data} />}
      </section>
      <footer css={styles.subTotalFooter}>
        <h4 css={styles.subTotal}>
          <span>Total:</span>
        </h4>
      </footer>
    </div>
  );
};

export default Checkout;
