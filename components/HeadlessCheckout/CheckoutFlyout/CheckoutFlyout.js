import React, { useEffect } from 'react';
import classes from './CheckoutFlyout.module.scss';
import { StateBasedCheckout } from '../Checkout/StateBasedCheckout';
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext';
import Link from 'next/link';
import IconClose from '@/svgs/close.svg'

const CheckoutFlyout = () => {
  const {
    data,
    initializeCheckout,
    resumeCheckout,
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
      initializeCheckout()
    }
  }, []);

  const checkoutStateStyle = flyoutState ? classes['show'] : classes['hide'];

  return (
    <div className={`${classes['checkout-flyout']} ${checkoutStateStyle}`}>
      <div onClick={() => setFlyoutState(false)} className={classes['checkout-flyout__overlay']}></div>
      <div className={classes['checkout-flyout__content']}>
        {data?.application_state?.line_items.length > 0 ? (
          <>
            <header className={classes['checkout-flyout__header']}>
              <h4>Checkout</h4>
            </header>
            <StateBasedCheckout data={data} />
          </>
        ):(
          <header className={classes['checkout-flyout__header']}>
            <h4>Your Cart Is Empty</h4>
            <Link href="/">
              <a className={`${classes['checkout-flyout__continue-shopping-btn']} btn sitkablue`}>Continue Shopping</a>
            </Link>
          </header>
        )}
      </div>
    </div>
  );
};

export default CheckoutFlyout;
