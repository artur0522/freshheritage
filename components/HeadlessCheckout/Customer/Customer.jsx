import React, { memo, useState, useEffect } from 'react';
import { useOrderMetadata } from '@boldcommerce/checkout-react-components';
import { useCustomerContext } from '@/context/CustomerContext'
import { useModalContext } from '@/context/ModalContext'
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext';
import { InputField } from '../InputField';
import { useTranslation } from 'react-i18next';
import IconSelectArrow from '@/svgs/select-arrow.svg'
import IconCheckmark from '@/svgs/checkmark.svg'
import Checkbox from "react-custom-checkbox";
import LoginAccountForm from '@/components/Forms/LoginAccountForm'
import ForgotPasswordForm from '@/components/Forms/ForgotPasswordForm'
import { GiftOrder } from '../GiftOrder';

/*
  2 things to know:
  - there is the customer context we get for logged in shopify customers
  - then there are customers that are associated to bold's checkout order.

  We use these two objects to determine if customer is logged, if so, automatically
  add shopify customer to bold checkout's order. If customer is not logged in, and
  a customer is added to bold checkout's order, remove that customer. However, if
  customer is a guest and doesn't have a shopify account, they need to be added to
  bold checkout's order to be able to "complete their order". More information of
  the life cycle of updating bold checkout's application state regarding customer and
  order meta data needed for discounts and prepaid prices can be found in
  HeadlessCheckoutContext.js in useEffect hook
*/

const Customer = () => {
  const { customer: data, logout } = useCustomerContext()
  const { data: orderMetaData } = useOrderMetadata()
  const modalContext = useModalContext()
  return <MemoizedCustomer customer={data} orderMetaData={orderMetaData} logout={logout} modalContext={modalContext} />;
};

const MemoizedCustomer = memo(({ customer, orderMetaData, logout, modalContext }) => {
  const [email, setEmail] = useState(customer?.email);
  const [errors, setErrors] = useState(null);
  const [acceptsMarketing, setAcceptsMarketing] = useState(false);
  const { updateOrderMetaData, addCustomerToOrder, removeCustomerFromOrder, updateCustomerInOrder, validateEmailAddress, data: checkoutData} = useHeadlessCheckoutContext()
  const [customerOpen, setCustomerOpen] = useState(true)
  const [accountFormType, setAccountFormType] = useState('login')
  const { t } = useTranslation();

  const addGuestCustomer = async () => {
    if (email && email.includes('@')) {

      const response = await validateEmailAddress({
        email_address: email
      })

      if (response.errors) {
        setErrors(response.errors)
        return
      }

      // add order meta data to indicate guest

      updateOrderMetaData({
        cart_parameters: {
          pre: {
            customer_data: {
              tags: ['guest']
            }
          }
        }
      }).then(() => {
        addCustomerToOrder({
          email_address: email
        })
      })

    }
  }

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
            onBlur={() => addGuestCustomer()}
          />
        )
    }
  }

  return (
    <div className="order-info">
      <div className="order-customer">
        <div className={`checkout__header checkout__header--border-on-closed checkout__row ${customerOpen ? 'checkout__header--open' : 'checkout__header--closed'}`}>
          <h3>Customer Info</h3>
          <div className="order-customer__header-links">
            {(customer?.email || checkoutData?.application_state?.customer?.email_address) ? (
              <div className="order-customer__header-link">
                {t('customer.not_you')}
                <button onClick={() => {
                  if (customer?.email) {
                    logout().then(() => setEmail(''))
                  } else {
                    removeCustomerFromOrder().then(() => setEmail(''))
                  }
                }} className="btn-link-underline">{t('customer.logout')}</button>
              </div>
            ):(
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
            {accountFormType != 'default' && !customer?.email && !checkoutData?.application_state?.customer?.email_address &&
              <div className="order-customer__header-link">
                {`Checkout as a `}
                <button onClick={() => setAccountFormType('default')} className="btn-link-underline">Guest</button>
              </div>
            }
          </div>
        </div>
        {!!customerOpen &&
          <>
            {customer?.email ? (
              <div>{customer.email}</div>
            ):(checkoutData?.application_state?.customer?.email_address ? (
              <div>{checkoutData.application_state.customer.email_address}</div>
            ):(
              <div className="order-customer-account-form">{getAccountFormContent(accountFormType)}</div>

            ))}

            <div className="checkout__checkbox-wrapper">
              <Checkbox
                className="checkout__checkbox"
                icon={<div className="checkbox--checked"><IconCheckmark /></div>}
                label={t('customer.subscribe')}
                checked={acceptsMarketing}
                onChange={async() => {
                  await updateCustomerInOrder({
                    first_name: checkoutData.application_state.customer.first_name,
                    last_name: checkoutData.application_state.customer.last_name,
                    email_address: checkoutData.application_state.customer.email_address,
                    accepts_marketing: !acceptsMarketing
                  })
                  setAcceptsMarketing(!acceptsMarketing)}
                }
              />
            </div>
            <div className="checkout__checkbox-wrapper">
              <Checkbox
                className="checkout__checkbox"
                icon={<div className="checkbox--checked"><IconCheckmark /></div>}
                label={'This order is a gift shipping directly to the recipient'}
                checked={orderMetaData.note_attributes.is_gift_order == 'true' ? true : false}
                onChange={() => updateOrderMetaData({
                  note_attributes: {
                    ...orderMetaData.note_attributes,
                    is_gift_order: (orderMetaData.note_attributes.is_gift_order == 'true' ? 'false' : 'true')
                  }
                })}
              />
            </div>
            {orderMetaData.note_attributes.is_gift_order == 'true' &&
              <GiftOrder orderMetaData={orderMetaData} updateOrderMetaData={updateOrderMetaData} />
            }
          </>
        }
      </div>
    </div>

  );
});

export default Customer;
