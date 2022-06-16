import React, { useCallback, useEffect, useState } from 'react';
import {
  useShippingAddress,
  useCheckoutStore
} from '@boldcommerce/checkout-react-components';
import { useAnalytics, useErrorLogging } from '@/hooks/index.js';
import {
  OrderErrors,
  Customer,
  ShippingAddress,
  BillingAddress,
  ShippingLines,
  PaymentMethod,
  CheckoutButton,
  OrderSummary
} from '../..';
import { useTranslation } from 'react-i18next';

const IndexPage = () => {
  const { state } = useCheckoutStore();
  const { submitShippingAddress } = useShippingAddress();
  const trackEvent = useAnalytics();
  const logError = useErrorLogging();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const setDefaultAddress = useCallback(async () => {
    setLoading(true);
    try {
      await submitShippingAddress(
        state.applicationState.customer.saved_addresses[0]
      );
    } catch (e) {
      logError('shipping_address', e);
      setLoading(false);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    // If customer is logged in with saved addresses, default the shipping address to the first one.
    if (state.applicationState.customer.saved_addresses.length > 0) {
      setDefaultAddress();
    }

    trackEvent('landing_page');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="checkout__layout checkout__main" role="main">
        <div className="checkout__panel-wrapper">
          <div className="checkout__panel">
            <OrderSummary />
            <OrderErrors />
          </div>
        </div>
        <div className="checkout__panel-wrapper">
          <div className="checkout__panel">
            <Customer />
            <ShippingAddress applicationLoading={loading} />
            <BillingAddress applicationLoading={loading} />
            <ShippingLines applicationLoading={loading} />
            <PaymentMethod applicationLoading={loading} />
          </div>
          <div className="checkout__navigation">
            <CheckoutButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default IndexPage;
