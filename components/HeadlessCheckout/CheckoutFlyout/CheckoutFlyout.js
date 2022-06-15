import { useState, useEffect, useRef } from 'react';
import classes from './CheckoutFlyout.module.scss';
import { StateBasedCheckout } from '../Checkout/StateBasedCheckout';
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext';
import Link from 'next/link';
import { CSSTransition } from 'react-transition-group';
import IconClose from '@/svgs/close.svg';

const CheckoutFlyout = () => {
  const nodeRef = useRef(null);
  const timeout = 200
  const [drawerOpen, setDrawerOpen] = useState(false)
  const {
    data,
    flyoutState,
    setFlyoutState
  } = useHeadlessCheckoutContext();

  const closeDrawer = () => {
    setDrawerOpen(false)
    setTimeout(() => {
      setFlyoutState(false)
    }, timeout)
  }

  useEffect(() => {
    if (flyoutState) {
      setTimeout(() => {
        setDrawerOpen(true)
      }, timeout)
    }
  }, [flyoutState]);

  const checkoutStateStyle = flyoutState ? classes['show'] : classes['hide'];

  return (
    <div className={`${classes['checkout-flyout']} ${checkoutStateStyle}`}>
      <div onClick={() => closeDrawer()} className={classes['checkout-flyout__overlay']}></div>
      <CSSTransition in={drawerOpen} timeout={timeout} nodeRef={nodeRef} unmountOnExit classNames={{
          'enter': classes['checkout-flyout__content--enter'],
          'enterActive': classes['checkout-flyout__content--enter-active'],
          'enterDone': classes['checkout-flyout__content--enter-done'],
          'exit': classes['checkout-flyout__content--exit'],
        }}>
        <div ref={nodeRef} className={classes['checkout-flyout__content']}>
          <button
            onClick={() => closeDrawer()}
            className={classes['checkout-flyout__close-btn']}><IconClose /></button>
          {data?.application_state?.line_items.length > 0 ? (
            <>
              <header className="checkout__header-main">
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
      </CSSTransition>
    </div>
  );
};

export default CheckoutFlyout;
