import { useBreakdown, useDiscount } from '@boldcommerce/checkout-react-components';
import React, { memo, useCallback } from 'react';
import { useAnalytics, useErrorLogging } from '@/hooks/index.js';
import { RedactedCreditCard } from '../../RedactedCreditCard';
import OrderSummaryItem from './OrderSummaryItem';
import OrderSummaryItemLine from './OrderSummaryItemLine';
import { useCustomerContext } from '@/context/CustomerContext'
import { useTranslation } from 'react-i18next';

const OrderSummaryBreakdown = ({ readOnly }) => {
  const { data } = useBreakdown();
  const { data: { discountTotal, discountCode }, removeDiscount } = useDiscount();
  const { customer: customerData } = useCustomerContext()
  const {
    subTotal,
    shippingTotal,
    taxesTotal,
    total,
    payments,
  } = data;

  return (
    <MemoizedOrderSummaryBreakdown
      subTotal={subTotal}
      shippingTotal={shippingTotal}
      taxesTotal={taxesTotal}
      total={total}
      discountTotal={discountTotal}
      discountCode={discountCode}
      payments={payments}
      onRemoveDiscount={removeDiscount}
      customer={customerData}
      readOnly={readOnly}
    />
  );
};

const MemoizedOrderSummaryBreakdown = memo(({
  subTotal,
  shippingTotal,
  taxesTotal,
  total,
  discountTotal,
  discountCode,
  payments,
  onRemoveDiscount,
  customer,
  readOnly,
}) => {
  const trackEvent = useAnalytics();
  const logError = useErrorLogging();
  const { t } = useTranslation();
  const handleRemoveDiscount = useCallback(async () => {
    try {
      await onRemoveDiscount(discountCode)
      trackEvent('remove_discount_code');
    } catch(e) {
      logError('discount_code', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountCode]);

  const discountLines = discountCode && (
    <OrderSummaryItemLine
      description={`${t('discount.code')}: ${discountCode}`}
      amount={-discountTotal}
      onRemove={readOnly ? null : handleRemoveDiscount}
      type={'discount'}
    />
  );

  const paymentLines = payments.map((payment) => (
    <OrderSummaryItemLine
      description={<RedactedCreditCard brand={payment.friendly_brand} lineText={payment.lineText} />}
      amount={payment.value}
      key={payment.id}
    />
  ));

  return (
    <div className="order-summary__breakdown">
      <div className="breakdown__section checkout__row">
        <OrderSummaryItem
          title={t('summary.subtotal')}
          amount={subTotal}
        />
        <OrderSummaryItem
          title={t('discount.title')}
          lines={discountLines}
        />
        <OrderSummaryItem
          title={t('shipping.title')}
          amount={shippingTotal}
        />
        <OrderSummaryItem
          title={t('summary.taxes')}
          amount={taxesTotal}
        />
      </div>
      <div className="breakdown__section checkout__row breakdown__section--total">
        <OrderSummaryItem
          title={t('summary.total')}
          amount={total}
        />
      </div>
      { (paymentLines && paymentLines.length > 0) && (
        <div className="breakdown__section">
          <OrderSummaryItem
            title={t('payment.title')}
            lines={paymentLines}
          />
        </div>
      )}
    </div>
  )
});

export default OrderSummaryBreakdown;