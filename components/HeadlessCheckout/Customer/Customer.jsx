import React, { memo, useState, useEffect } from 'react';
import { useCustomer } from '@boldcommerce/checkout-react-components';
import { useCustomerContext } from '@/context/CustomerContext'
import { useModalContext } from '@/context/ModalContext'
import { InputField } from '../InputField';
import { useTranslation } from 'react-i18next';
import IconSelectArrow from '@/svgs/select-arrow.svg'
import IconCheckmark from '@/svgs/checkmark.svg'
import Checkbox from "react-custom-checkbox";
import LoginAccountForm from '@/components/Forms/LoginAccountForm'
import ForgotPasswordForm from '@/components/Forms/ForgotPasswordForm'

const Customer = () => {
  const { submitCustomer } = useCustomer();
  const { customer: data, logout } = useCustomerContext()
  const modalContext = useModalContext()
  return <MemoizedCustomer customer={data} logout={logout} submitCustomer={submitCustomer} modalContext={modalContext} />;
};

const MemoizedCustomer = memo(({ customer, logout, modalContext, submitCustomer }) => {
  const [email, setEmail] = useState(customer?.email);
  const [errors, setErrors] = useState(null);
  const [acceptsMarketing, setAcceptsMarketing] = useState(false);
  const [isGift, setIsGift] = useState(false)
  const [customerOpen, setCustomerOpen] = useState(true)
  const [accountFormType, setAccountFormType] = useState('default')
  const { t } = useTranslation();

  const getAccountFormContent = (type) => {
    switch(type) {
      case 'login':
        return <LoginAccountForm isCheckout={true} onForgotPasswordClick={() => setAccountFormType('forgot_password')}  />
      case 'forgot_password':
        return <ForgotPasswordForm isCheckout={true} />
      default:
        return (
          <InputField
            className="order-customer__email"
            placeholder="Email"
            type="email"
            name="email"
            autoComplete="email"
            messageType={errors && 'alert'}
            messageText={errors && errors[0].message}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )
    }
  }

  useEffect(() => {
    if (customer?.email) {
      setAccountFormType('default')
      submitCustomer({
        platform_id: customer.id.replace('gid://shopify/Customer/', ''),
        first_name: customer.firstName,
        last_name: customer.lastName,
        email_address: customer.email,
        accepts_marketing: customer.acceptsMarketing
      })
      // console.log("submitting customer")
    }
  }, [customer])

  return (
    <div className="order-info">
      <div className="order-customer">
        <div className={`checkout__header checkout__header--border-on-closed checkout__row ${customerOpen ? 'checkout__header--open' : 'checkout__header--closed'}`}>
          <h3>Customer Info</h3>
          <div className="order-customer__header-links">
            {customer?.email ? (
              <div className="order-customer__header-link">
                {t('customer.not_you')}
                <button onClick={() => logout()} className="btn-link-underline">{t('customer.logout')}</button>
              </div>
            ): (
              (accountFormType === 'login' ? (
                <div className="order-customer__header-link">
                  {`Don't have an account? `}
                  <button
                    onClick={() => {
                      modalContext.setModalType('create')
                      modalContext.setIsOpen(true)
                    }}
                    className="btn-link-underline">Sign Up</button>
                </div>
              ):(
                <div className="order-customer__header-link">
                  {t('customer.already_have_account')}
                  <button onClick={() => setAccountFormType('login')} className="btn-link-underline">{t('customer.login')}</button>
                </div>
              ))

            )}
          </div>
        </div>
        {!!customerOpen &&
          <>
            {customer?.email ? (
              <div>{customer.email}</div>
            ):(
              <div className="order-customer-account-form">{getAccountFormContent(accountFormType)}</div>
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
            {isGift &&
              <div className="order-giftnote-form">
                <div className="input-group--wrapper">
                  <InputField
                    className="input"
                    placeholder="recipient@email.com"
                    type="email"
                    name="recipient_email"
                    autoComplete="email"
                    label="Recipient Email"
                    // value={email}
                    // onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputField
                    className="input"
                    placeholder="Recipient Name"
                    type="text"
                    name="recipient_name"
                    label="Recipient Name"
                    // value={email}
                    // onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <InputField
                  className="input"
                  placeholder="gift message"
                  type="textarea"
                  name="gift_message"
                  // value={email}
                  // onChange={(e) => setEmail(e.target.value)}
                />
                <p className="order-giftnote-disclaimer">*We will alert the recipient of their delivery via email one week before they receive it, and include your gift message along with delivery information!</p>
              </div>
            }
          </>
        }
      </div>
    </div>

  );
});

export default Customer;
