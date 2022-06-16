import { useState, useEffect, useRef } from 'react';
import classes from './CheckoutFlyout.module.scss';
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext';
import { CSSTransition } from 'react-transition-group';
import IconClose from '@/svgs/close.svg';
import Checkout from '../Checkout/checkout';

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
          <Checkout data={data} />
        </div>
      </CSSTransition>
    </div>
  );
};

export default CheckoutFlyout;
