import React from 'react';
import { useCheckoutStore } from '@boldcommerce/checkout-react-components';
import {
  OrderSummary,
  ConfirmationList,
  ConfirmationListItem,
  RedactedCreditCard
} from '../..';
// import './ConfirmationPage.css';
// import { ConfirmationList, ConfirmationListItem } from './components';
// import { RedactedCreditCard } from './components/RedactedCreditCard';
import { useTranslation } from 'react-i18next';
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext';
import { useRouter } from 'next/router'

const ConfirmationPage = () => {
  const router = useRouter();
  const { state } = useCheckoutStore();
  const customer = state.applicationState.customer;
  const shippingAddress = state.applicationState.addresses.shipping;
  const billingAddress = state.applicationState.addresses.billing;
  const shippingMethod =
    state.applicationState.shipping.selected_shipping.description;
  const payments = state.applicationState.payments;
  const { t } = useTranslation();
  const { setFlyoutState, initializeCheckout } = useHeadlessCheckoutContext()

  // const continueShopping = () => {
  //   location.href = `https://${state.initialData.shop_name}`;
  // };

  const continueShopping = () => {
    // location.href = `https://${state.initialData.shop_name}/cart/clear?return_to=/`;
    location.href = `${process.env.checkoutUrl}/api/checkout/clearCart?return_to=/`;
  };

  const paymentList = payments.map((payment) => {
    return (
      <li className="payment__list-item" key={payment.id}>
        <RedactedCreditCard
          brand={payment.friendly_brand}
          lineText={payment.lineText}
        />
      </li>
    );
  });

  return (
    <>
      <div className="checkout__layout checkout__confirmation" role="main">
        <div className="checkout__panel-wrapper">
          <div className="checkout__panel">
            <OrderSummary readOnly />
          </div>
          <header className="checkout__header-main">
            <h4>{`${t('confirmation.thank_you')}, ${
              customer.first_name || shippingAddress.first_name
            }!`}</h4>
          </header>
        </div>
        <div className="checkout__panel-wrapper">
          <div className="checkout__panel">
            <div className="checkout__header checkout__header--flex-direction-column checkout__row">
              <h3>{t('confirmation.order_confirmed')}</h3>
              <p>{t('confirmation.order_accepted')}</p>
            </div>
            <div className="checkout__header checkout__row">
              <h3>{t('customer.info')}</h3>
            </div>
            <ConfirmationList>
              <ConfirmationListItem title={t('shipping.address')}>
                <p>{`${shippingAddress.first_name} ${shippingAddress.last_name}`}</p>
                <p>
                  {`
                    ${shippingAddress.address_line_1},
                    ${
                      shippingAddress.address_line_2 &&
                      shippingAddress.address_line_2 + ','
                    }
                    ${shippingAddress.city},
                    ${shippingAddress.province && shippingAddress.province + ','}
                    ${
                      shippingAddress.postal_code &&
                      shippingAddress.postal_code + ','
                    }
                    ${shippingAddress.country},
                    ${
                      shippingAddress.phone_number && shippingAddress.phone_number
                    }
                  `}
                </p>
              </ConfirmationListItem>
              <ConfirmationListItem title={t('billing.address')}>
                <p>{`${billingAddress.first_name} ${billingAddress.last_name}`}</p>
                <p>
                  {`
                    ${billingAddress.address_line_1},
                    ${
                      billingAddress.address_line_2 &&
                      billingAddress.address_line_2 + ','
                    }
                    ${billingAddress.city},
                    ${billingAddress.province && billingAddress.province + ','}
                    ${
                      billingAddress.postal_code &&
                      billingAddress.postal_code + ','
                    }
                    ${billingAddress.country},
                    ${billingAddress.phone_number && billingAddress.phone_number}
                  `}
                </p>
              </ConfirmationListItem>
              <ConfirmationListItem title={t('shipping.method')}>
                <p>{shippingMethod}</p>
              </ConfirmationListItem>
              <ConfirmationListItem title={t('payment.method')}>
                <ul className="payment__list">{paymentList}</ul>
              </ConfirmationListItem>
            </ConfirmationList>
          </div>
        </div>
        <div className="checkout__navigation">
          <button
            onClick={async () => {
              await initializeCheckout()
              if (router.pathname === '/checkout') {
                router.push('/')
                return
              }
              setFlyoutState(false)
            }}
            className="checkout__cta-btn btn sitkablue">Continue Shopping</button>
        </div>
      </div>
    </>
  );
};

export default ConfirmationPage;
