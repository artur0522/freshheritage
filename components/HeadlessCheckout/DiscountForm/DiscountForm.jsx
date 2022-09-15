import { useDiscount, useApplicationState } from '@boldcommerce/checkout-react-components';
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext';
import { InputField } from '../InputField';
import React, { memo, useCallback, useState, useEffect } from 'react';
import { useAnalytics, useErrorLogging } from '@/hooks/index.js';
import { useTranslation } from 'react-i18next';
import { useCustomerContext } from '@/context/CustomerContext'
import IconPlus from '@/svgs/plus.svg'
import IconMinus from '@/svgs/minus.svg'


const DiscountForm = () => {
  const { data, applyDiscount } = useDiscount();
  const { customer: customerData } = useCustomerContext()
  const { discountApplied, discountCode } = data;
  const { refreshApplicationState } = useHeadlessCheckoutContext();
  const { updateApplicationState } = useApplicationState();

  return (
    <MemoizedDiscountForm
      discountCode={discountCode}
      discountApplied={discountApplied}
      applyDiscount={applyDiscount}
      customer={customerData}
      refreshApplicationState={refreshApplicationState}
      updateApplicationState={updateApplicationState}
    />
  );
};

const MemoizedDiscountForm = memo(
  ({ discountCode, discountApplied, applyDiscount, customer, refreshApplicationState, updateApplicationState }) => {
    const trackEvent = useAnalytics();
    const logError = useErrorLogging();
    const [discount, setDiscount] = useState(discountCode);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const { t } = useTranslation();

    const handleApply = useCallback(async () => {
      setLoading(true);
      try {
        await applyDiscount(discount);
        await refreshApplicationState()
        // await updateApplicationState(response.data.application_state)
        trackEvent('apply_discount_code');
        setErrors(null);
      } catch (e) {
        logError('discount_code', e);
        if (e.body.errors[0].type !== 'authorization.expired_jwt') {
          setErrors(e.body.errors);
        }
      }
      setLoading(false);
    }, [discount, applyDiscount, logError, trackEvent]);

    useEffect(() => {
      setDiscount(discountCode)
    }, [discountCode])

    return (
      <div className="order-discount-form checkout__row">
        <div className="order-discount-form__header">
          <h3>Have a discount code?</h3>
          <button onClick={() => setFormOpen(!formOpen)} className="checkout__header-toggle-btn">
            {formOpen ? (
              <IconMinus />
            ):(
              <IconPlus />
            )}
          </button>
        </div>
        {!!formOpen &&
          <div className="discount-form">
            <InputField
              className="input discount-form__field"
              type="text"
              placeholder={t('discount.enter_code')}
              value={discount}
              messageText={errors && errors[0].message}
              messageType={errors && 'alert'}
              onChange={(e) => setDiscount(e.target.value)}
              disabled={discountApplied || loading}
            />
            <button
              className="discount-form__btn btn sitkablue"
              disabled={discount.length === 0 || discountApplied || loading}
              onClick={handleApply}
              loading={loading.toString()}
            >
              {t('discount.apply')}
            </button>
          </div>
        }
      </div>
    );
  }
);

export default DiscountForm;