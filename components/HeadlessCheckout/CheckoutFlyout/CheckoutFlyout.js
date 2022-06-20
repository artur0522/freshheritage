import { useState, useEffect, useRef } from 'react';
import classes from './CheckoutFlyout.module.scss';
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext';
import { CSSTransition } from 'react-transition-group';
import IconClose from '@/svgs/close.svg';
import CheckoutContent from '../Checkout/CheckoutContent';

const CheckoutFlyout = () => {
  const nodeRef = useRef(null);
  const timeout = 200
  const [flyoutOpen, setFlyoutOpen] = useState(false)
  const [overlayOpen, setOverLayOpen] = useState(false)
  const {
    data,
    flyoutState
  } = useHeadlessCheckoutContext();

  const closeDrawer = () => {
    setFlyoutOpen(false)
    setTimeout(() => {
      setOverLayOpen(false)
    }, timeout)
  }

  const openDrawer = () => {
    setOverLayOpen(true)
    setTimeout(() => {
      setFlyoutOpen(true)
    }, timeout)
  }

  useEffect(() => {
    if (flyoutState) {
      openDrawer()
    } else {
      closeDrawer()
    }
  }, [flyoutState])

  return (
    <div className={`${classes['checkout-flyout']} ${overlayOpen ? classes['show'] : classes['hide']}`}>
      <div onClick={() => closeDrawer()} className={classes['checkout-flyout__overlay']}></div>
      <CSSTransition in={flyoutOpen} timeout={timeout} nodeRef={nodeRef} unmountOnExit classNames={{
          'enter': classes['checkout-flyout__content--enter'],
          'enterActive': classes['checkout-flyout__content--enter-active'],
          'enterDone': classes['checkout-flyout__content--enter-done'],
          'exit': classes['checkout-flyout__content--exit'],
        }}>
        <div ref={nodeRef} className={classes['checkout-flyout__content']}>
          <button
            onClick={() => closeDrawer()}
            className={classes['checkout-flyout__close-btn']}><IconClose /></button>
          <CheckoutContent data={data} />
        </div>
      </CSSTransition>
    </div>
  );
};

export default CheckoutFlyout;
