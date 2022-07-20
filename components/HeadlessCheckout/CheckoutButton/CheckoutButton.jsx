import {
  useBillingAddress,
  useCheckoutStore,
  useLineItems,
  usePaymentIframe
} from '@boldcommerce/checkout-react-components';
// import { useNavigate } from 'react-router-dom';
import { useRouter } from 'next/router';
import React, { memo, useCallback, useState, useContext } from 'react';
import { useAnalytics, useErrorLogging } from '@/hooks/index.js';
import { useTranslation } from 'react-i18next';
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext';

const CheckoutButton = () => {
  const { processPaymentIframe } = usePaymentIframe();
  const { state } = useCheckoutStore();
  const { data: lineItems } = useLineItems();
  const { data: billingAddress } = useBillingAddress();
  const { orderStatus } = state.orderInfo;
  const processing =
    orderStatus === 'processing' || orderStatus === 'authorizing';

  return (
    <MemoizedCheckoutButton
      processOrder={processPaymentIframe}
      processing={processing}
      hasBillingAddress={!!billingAddress.country_code}
      lineItems={lineItems}
      appLoading={state.loadingStatus.isLoading}
    />
  );
};

// eslint-disable-next-line react/display-name
const MemoizedCheckoutButton = memo(
  ({ processOrder, processing, hasBillingAddress, lineItems, appLoading }) => {
    const trackEvent = useAnalytics();
    const logError = useErrorLogging();
    const navigate = useRouter();
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const { processBoldOrder } = useHeadlessCheckoutContext();

    const validateInventory = useCallback(async () => {
      const variants = lineItems
        .map((lineItem) => lineItem.product_data.variant_id)
        .join(',');
      // const response = await fetch(`${process.env.checkoutUrl}${process.env.NEXT_PUBLIC_INVENTORY_URL}?variants=${variants}`);
      const response = await fetch(
        `${process.env.checkoutUrl}/api/checkout/validateInventory?variants=${variants}`
      );
      const responseData = await response.json();
      let inventory = Array.from(responseData).reduce(
        (acc, curr) => ((acc[curr.platform_id] = curr.inventory_quantity), acc),
        {}
      );
      let inventoryIssues = false;

      lineItems.forEach((lineItem) => {
        inventory[lineItem.product_data.variant_id] -=
          lineItem.product_data.quantity;
        if (inventory[lineItem.product_data.variant_id] < 0) {
          inventoryIssues = true;
        }
      });

      if (inventoryIssues) {
        return responseData.inventory;
      } else {
        return null;
      }
    }, [lineItems]);

    const handleProcessPayment = useCallback(async () => {
      trackEvent('click_complete_order');
      setLoading(true);
      try {
        const inventoryIssues = await validateInventory();
        if (inventoryIssues) {
          setLoading(false);
          navigate('/inventory_issues', { state: inventoryIssues });
        } else {
          setLoading(false);
          await processOrder();
          await processBoldOrder();
        }
      } catch (e) {
        logError('process_order', e);
        setLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [logError, trackEvent, processOrder, validateInventory]);

    return (
      <button
        type="button"
        className="checkout__cta-btn btn salmon"
        onClick={handleProcessPayment}
        loading={loading.toString() || processing.toString()}
        disabled={!hasBillingAddress || processing || appLoading}
      >
        {t('complete_order')}
      </button>
    );
  }
);

export default CheckoutButton;
