import React, { memo, useCallback, useState } from 'react';
import { useCustomer } from '@boldcommerce/checkout-react-components';
import { InputField } from '../InputField';
import { useAnalytics, useErrorLogging } from '@/hooks/index.js';
import { useTranslation } from 'react-i18next';
import IconSelectArrow from '@/svgs/select-arrow.svg'
import IconCheckmark from '@/svgs/checkmark.svg'
import Checkbox from "react-custom-checkbox";

const Customer = ({children}) => {
  const { data, submitCustomer } = useCustomer();

  return <MemoizedCustomer children={children} customer={data} submitCustomer={submitCustomer} />;
};

const MemoizedCustomer = memo(({ customer, submitCustomer, children }) => {
  const trackEvent = useAnalytics();
  const logError = useErrorLogging();
  const [email, setEmail] = useState(customer?.email_address);
  const [errors, setErrors] = useState(null);
  const [acceptsMarketing, setAcceptsMarketing] = useState(false);
  const [isGift, setIsGift] = useState(false)
  const [openPanel, setPanel] = useState(false)
  const { t } = useTranslation();
  //console.log("customer", customer);

  const handleSubmit = useCallback(async () => {
    try {
      await submitCustomer({
        email_address: email,
        accepts_marketing: acceptsMarketing
      });
      trackEvent('set_customer');
      setErrors(null);
    } catch (e) {
      setErrors(e.body.errors);
      logError('customer', e);
    }
  }, [email, acceptsMarketing]);

  return (
    <div className="order-info">
      <div className="order-customer">
        <div onClick={() => setPanel(!openPanel)} className={`order-customer__header checkout__row ${openPanel ? 'order-customer__header--open' : 'order-customer__header--closed'}`}>
          <h3>Customer Info</h3>
          <div className="order-customer__header-links">
            {customer?.email_address ? (
              <div className="order-customer__header-link">
                {t('customer.not_you')}
                <a href={process.env.LOGIN_URL}>{t('customer.logout')}</a>
              </div>
            ): (
              <div className="order-customer__header-link">
                {t('customer.already_have_account')}
                <a href={process.env.LOGIN_URL}>{t('customer.login')}</a>
              </div>
            )}
            <IconSelectArrow />
          </div>
        </div>
        {!!openPanel &&
          <>
            <InputField
              className="order-customer__email"
              placeholder={t('customer.email')}
              type="email"
              name="email"
              autoComplete="email"
              messageType={errors && 'alert'}
              messageText={errors && errors[0].message}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={customer.isAuthenticated}
              onBlur={handleSubmit}
            />
            <div className="order-customer__checkbox-wrapper">
              <Checkbox
                className="order-customer__checkbox"
                icon={<div className="checkbox--checked"><IconCheckmark /></div>}
                label={t('customer.subscribe')}
                checked={acceptsMarketing}
                onChange={() => setAcceptsMarketing(!acceptsMarketing)}
              />
            </div>
            <div className="order-customer__checkbox-wrapper">
              <Checkbox
                className="order-customer__checkbox"
                icon={<div className="checkbox--checked"><IconCheckmark /></div>}
                label={'This order is a gift shipping directly to the recipient'}
                checked={isGift}
                onChange={() => setIsGift(!isGift)}
              />
            </div>
          </>
        }
      </div>
      {!!openPanel &&
        children
      }
    </div>

  );
});

export default Customer;
