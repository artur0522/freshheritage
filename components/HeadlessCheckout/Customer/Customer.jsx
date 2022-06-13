import React, { memo, useState } from 'react';
import { useCustomerContext } from '@/context/CustomerContext'
import { useModalContext } from '@/context/ModalContext'
import { InputField } from '../InputField';
import { useTranslation } from 'react-i18next';
import IconSelectArrow from '@/svgs/select-arrow.svg'
import IconCheckmark from '@/svgs/checkmark.svg'
import Checkbox from "react-custom-checkbox";

const Customer = () => {
  const { customer: data, logout } = useCustomerContext()
  const modalContext = useModalContext()
  console.log("modalContext:", modalContext)
  return <MemoizedCustomer customer={data} logout={logout} modalContext={modalContext} />;
};

const MemoizedCustomer = memo(({ customer, logout, modalContext }) => {
  const [email, setEmail] = useState(customer?.email);
  const [errors, setErrors] = useState(null);
  const [acceptsMarketing, setAcceptsMarketing] = useState(false);
  const [isGift, setIsGift] = useState(false)
  const [customerOpen, setCustomerOpen] = useState(true)
  const { t } = useTranslation();
  console.log("customer", customer);

  return (
    <div className="order-info">
      <div className="order-customer">
        <div onClick={() => setCustomerOpen(!customerOpen)} className={`checkout__header checkout__header--border-on-closed checkout__row ${customerOpen ? 'checkout__header--open' : 'checkout__header--closed'}`}>
          <h3>Customer Info</h3>
          <div className="order-customer__header-links">
            {customer?.email ? (
              <div className="order-customer__header-link">
                {t('customer.not_you')}
                <button onClick={() => logout()} className="btn-link-underline">{t('customer.logout')}</button>
              </div>
            ): (
              <div className="order-customer__header-link">
                {t('customer.already_have_account')}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    modalContext.setModalType('login')
                    modalContext.setIsOpen(true)
                  }}
                  className="btn-link-underline">{t('customer.login')}</button>
              </div>
            )}
            <IconSelectArrow />
          </div>
        </div>
        {!!customerOpen &&
          <>
            {customer?.email ? (
              <div>{customer.email}</div>
            ):(
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
              />
            )}
            <div className="checkout__checkbox-wrapper">
              <Checkbox
                className="checkout__checkbox"
                icon={<div className="checkbox--checked"><IconCheckmark /></div>}
                label={t('customer.subscribe')}
                checked={acceptsMarketing}
                onChange={() => setAcceptsMarketing(!acceptsMarketing)}
              />
            </div>
            <div className="checkout__checkbox-wrapper">
              <Checkbox
                className="checkout__checkbox"
                icon={<div className="checkbox--checked"><IconCheckmark /></div>}
                label={'This order is a gift shipping directly to the recipient'}
                checked={isGift}
                onChange={() => setIsGift(!isGift)}
              />
            </div>
          </>
        }
      </div>
    </div>

  );
});

export default Customer;
