import { useDiscount } from '@boldcommerce/checkout-react-components';
import { InputField } from '../InputField';
import React, { memo, useCallback, useState } from 'react';
import { useAnalytics, useErrorLogging } from '@/hooks/index.js';
import { useTranslation } from 'react-i18next';
import IconPlus from '@/svgs/plus.svg'
import IconMinus from '@/svgs/minus.svg'

const DiscountForm = () => {
  const { data, applyDiscount } = useDiscount();
  const { discountApplied, discountCode } = data;

  return (
    <MemoizedDiscountForm
      discountCode={discountCode}
      discountApplied={discountApplied}
      applyDiscount={applyDiscount}
    />
  );
};

const MemoizedDiscountForm = memo(
  ({ discountCode, discountApplied, applyDiscount }) => {
    const trackEvent = useAnalytics();
    const logError = useErrorLogging();
    const [discount, setDiscount] = useState(discountCode);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formOpen, setFormOpen] = useState(true);
    const { t } = useTranslation();

    const handleApply = useCallback(async () => {
      setLoading(true);
      try {
        await applyDiscount(discount);
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

    return (
      <div className="order-discount-form checkout__row">
        <div onClick={() => setFormOpen(!formOpen)} className="order-discount-form__header">
          <h3>Have a discount code?</h3>
          {formOpen ? (
            <IconMinus />
          ):(
            <IconPlus />
          )}
        </div>
        {!!formOpen &&
          <div className="discount-form">
            <InputField
              className="discount-form__field"
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
              primary={discountApplied || discount.length > 0}
              disabled={discount.length === 0 || discountApplied || loading}
              onClick={handleApply}
              loading={loading}
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
