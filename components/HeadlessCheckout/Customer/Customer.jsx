import React, { memo, useState } from 'react';
import { useOrderMetadata, useCustomer } from '@boldcommerce/checkout-react-components';
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

const Customer = () => {
  const { customer: data, logout } = useCustomerContext()
  const { data: orderMetaData } = useOrderMetadata()
  const { data: customerFromOrder } = useCustomer()
  const modalContext = useModalContext()
  return <MemoizedCustomer customer={data} orderMetaData={orderMetaData} customerFromOrder={customerFromOrder} logout={logout} modalContext={modalContext} />;
};

const MemoizedCustomer = memo(({ customer, orderMetaData, customerFromOrder, logout, modalContext }) => {
  const [email, setEmail] = useState(customer?.email);
  const [errors, setErrors] = useState(null);
  const [acceptsMarketing, setAcceptsMarketing] = useState(false);
  const { updateOrderMetaData, addCustomerToOrder, removeCustomerFromOrder } = useHeadlessCheckoutContext()
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
          <form onSubmit={(e) => {
            e.preventDefault();
            updateOrderMetaData({
              cart_parameters: {
                pre: {
                  customer_data: {
                    tags: ['guest customer']
                  }
                }
              }
            })
            .then(() => {
              addCustomerToOrder({
                email_address: email,
                accepts_marketing: acceptsMarketing
              })
            })
          }}>
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
          </form>
        )
    }
  }

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
            ):(orderMetaData.cart_parameters.pre.customer_data.tags.includes('guest customer')) ? (
              <div className="order-customer__header-link">
                {t('customer.not_you')}
                <button onClick={() => {
                  removeCustomerFromOrder()
                    .then(() => {
                      updateOrderMetaData({
                        cart_parameters: {
                          pre: {
                            customer_data: {
                              tags: ''
                            }
                          }
                        }
                      })
                    })
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
            {accountFormType != 'default' &&
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
            ):(orderMetaData.cart_parameters.pre.customer_data.tags.includes('guest customer')) && customerFromOrder ? (
              <div>{customerFromOrder.email_address}</div>
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
                checked={orderMetaData.note_attributes.is_gift_order == 'true' ? true : false}
                onChange={() => updateOrderMetaData({
                  note_attributes: {
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
