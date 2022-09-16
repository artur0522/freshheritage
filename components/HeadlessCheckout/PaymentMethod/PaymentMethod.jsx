import {
  useBillingAddress,
  useBillingSameAsShipping,
  useCheckoutStore,
  usePaymentIframe,
  useShippingAddress,
  useShippingLines,
  useLineItems,
  useErrors,
  useCustomer
} from '@boldcommerce/checkout-react-components';
import React, { memo, useEffect, useState } from 'react';
import { EmptyState } from '@/components/HeadlessCheckout/EmptyState';
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext';
import { LoadingState } from '../LoadingState';
import { useTranslation } from 'react-i18next';
import IconSelectArrow from '@/svgs/select-arrow.svg'
import {
  useOrderMetadata,
  useDiscount
} from '@boldcommerce/checkout-react-components';

const PaymentMethod = ({ applicationLoading }) => {
  const { state } = useCheckoutStore();
  const { data: shippingAddress } = useShippingAddress();
  const { data: billingAddress } = useBillingAddress();
  const { data: billingSameAsShipping } = useBillingSameAsShipping();
  const {
    data: paymentIframe,
    loadingStatus,
    errors,
    paymentIframeOnLoaded
  } = usePaymentIframe();
  const { data } = useShippingLines();
  const { data: lineItems } = useLineItems();
  const { data: customer } = useCustomer()
  const { PIGIMediaRules, flyoutState } = useHeadlessCheckoutContext()
  const shippingLines = data.shippingLines;
  const orderStatus = state.orderInfo.orderStatus;
  const loading =
    (loadingStatus !== 'fulfilled' && orderStatus !== 'authorizing') ||
    applicationLoading;
  const paymentErrors = useErrors();
  return (
    <MemoizedPaymentMethod
      applicationState={state}
      billingAddress={billingAddress}
      shippingAddress={shippingAddress}
      shippingLines={shippingLines}
      billingSameAsShipping={billingSameAsShipping}
      paymentIframeUrl={paymentIframe.url}
      paymentIframeHeight={paymentIframe.height}
      onPaymentIframeLoaded={paymentIframeOnLoaded}
      loading={loading}
      PIGIMediaRules={PIGIMediaRules}
      customer={customer}
      lineItems={lineItems}
    />
  );
};

const MemoizedPaymentMethod = memo(
  ({
    applicationState,
    billingAddress,
    shippingAddress,
    shippingLines,
    billingSameAsShipping,
    paymentIframeUrl,
    paymentIframeHeight,
    onPaymentIframeLoaded,
    loading,
    PIGIMediaRules,
    customer,
    lineItems
  }) => {
    const [disabled, setDisabled] = useState();
    const [paymentMethodOpen, setPaymentMethodOpen] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
      if (billingSameAsShipping && Array.isArray(shippingAddress)) {
        setDisabled(true);
      } else if (!billingSameAsShipping && Array.isArray(billingAddress)) {
        setDisabled(true);
      } else if (shippingLines.length === 0) {
        setDisabled(true);
      } else {
        setDisabled(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [billingAddress, shippingAddress, billingSameAsShipping]);

    const clearCart = async () => {
      //method to delete shopify cart
      // return await fetch(`${process.env.checkoutUrl}${process.env.NEXT_PUBLIC_SERVER_BASE}/clearCart`, {
      // commented out to stop getting an error
      // return await fetch(`https://sitkasalmontest.ngrok.io/api/checkout/clearCart`, {
      //   method: "POST",
      //   credentials: "same-origin",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify({cart_token: applicationState.initialData.cart_id}),
      // })
      // .then(response => response.json());
    };

    useEffect(() => {
      const handleMessageReceived = async (event) => {
        const message = event.data;

        if (
          message.responseType === 'PIGI_ADD_PAYMENT' &&
          message.payload.success
        ) {
          await clearCart();
        }
      };

      window.addEventListener('message', handleMessageReceived);
      return () => {
        window.removeEventListener('message', handleMessageReceived);
      };
    }, []);

    const style = {
      height: `${paymentIframeHeight}px`,
      display: disabled || loading ? 'none' : null
    };

    let content = '';

    if (disabled) {
      content = <EmptyState title={t('payment.empty')} icon="money" />;
    } else if (loading) {
      content = <LoadingState />;
    }

    const { data: orderMetaData } = useOrderMetadata();
    const { data: appliedDiscounts, errors: discountErrors, loadingStatus, applyDiscount, removeDiscount } = useDiscount();

    useEffect(() => {
      const applyMembershipDiscount = async () => {
        const hasSub =
          applicationState.applicationState.line_items.filter((item) => {
            return item.product_data.tags.includes('Subscription Box');
          }).length > 0;
        const hasFb =
          applicationState.applicationState.line_items.filter((item) => {
            return item.product_data.tags.includes('freezer');
          }).length > 0;
        //const isTest = applicationState.applicationState.line_items.filter((item) => {return item.product_data.tags.includes("Testing")}).length > 0;
        //const isTest = applicationState.applicationState.order_meta_data.cart_parameters.pre.customer_data.tags.filter((item) => {return item.includes("Test")}).length > 0;
        var customerTags = '';
        if (
          'pre' in
          applicationState.applicationState.order_meta_data.cart_parameters &&
          applicationState.applicationState.order_meta_data.cart_parameters.pre.customer_data.tags != ''
        ) {
          customerTags =
            applicationState.applicationState.order_meta_data.cart_parameters
              .pre.customer_data.tags;
        }

        console.log('customer tags', customerTags);
        console.log('has sub: ' + hasSub);
        console.log('has fb: ' + hasFb);

        //DETERMIN MEMBERHIP TIER
        var membership = 'guest';
        if (customerTags.includes('Employee')) {
          membership = 'Employee';
        } else if (customerTags.includes('KingSustainer')) {
          membership = 'KingSustainer';
        } else if (customerTags.includes('SockeyeSustainer')) {
          membership = 'SockeyeSustainer';
        } else if (customerTags.includes('Prepaid')) {
          membership = 'PrepaidMember';
        } else if (customerTags.includes('PremiumMember')) {
          membership = 'PremiumMember';
        } else if (customerTags.includes('Member')) {
          membership = 'Member';
        }
        console.log('membership: ' + membership);

        // to use as a reference to remove discount codes if not a member
        const memberDiscountLists = ['10% King Sustainer Discount', '10% Sustainer Discount', '5% Sustainer Discount', '5% Member Discount']

        //AUTO DISCOUNTS FOR OTP
        var discounts = [];
        if (hasFb && membership === 'Employee') {
          discounts.push('30% Employee Discount');
        } else if (hasFb && membership === 'KingSustainer') {
          discounts.push('20% King Sustainer Discount');
        } else if (hasFb && membership === 'SockeyeSustainer') {
          discounts.push('15% Sustainer Discount');
        } else if (hasFb && membership === 'PrepaidMember') {
          discounts.push('15% Member Discount');
        } else if (hasFb && (membership === "PremiumMember" || membership === "Member")) {
          discount = "10% Member Discount";
        }

        //AUTO DISCOUNTS FOR SUBSCRIPTIONS
        if (hasSub && membership === 'KingSustainer') {
          discounts.push('10% King Sustainer Discount');
        } else if (hasSub && membership === 'SockeyeSustainer') {
          discounts.push('5% Sustainer Discount');
        }

        discounts = discounts.sort((a, b) => {
          return parseInt(b) - parseInt(a)
        })

        // AUTO DISCOUNT FOR REFERREES
        if (sessionStorage.getItem("utm_source") === "member_referral" && membership === "") {
          if (hasSub){
            discounts.push('$25 Refer a Friend');
          }
        }

        console.log('discounts:', discounts);
        console.log('appliedDiscounts?.discountCode:', appliedDiscounts?.discountCode);

        // applying membership discounts
        if (discounts.length) {
          if (appliedDiscounts?.discountCode !== '' && memberDiscountLists.includes(appliedDiscounts.discountCode) && appliedDiscounts?.discountCode !== discounts[0]) {
            try {
              const removeResults = await removeDiscount(appliedDiscounts.discountCode);
              console.log("applying discount code by removing then adding:", discounts[0])
              const addResults = await applyDiscount(discounts[0]);
            } catch (e) {
              //console.log(e)
            }
          } else {
            try {
              console.log("applying discount code:", discounts[0])
              const results = await applyDiscount(discounts[0]);
              //console.log(results)
            } catch (e) {
              //console.log(e)
            }
          }
        // removes discount membership code if not a member
        } else if (membership === 'guest' && appliedDiscounts?.discountCode !== '' && memberDiscountLists.includes(appliedDiscounts.discountCode)) {
          try {
            const removeResults = await removeDiscount(appliedDiscounts.discountCode);
          } catch (e) {
            //console.log(e)
          }
        // if no member discount is available, remove discount code if applied to order
        } else if (appliedDiscounts?.discountCode !== '' && memberDiscountLists.includes(appliedDiscounts.discountCode)) {
          try {
            console.log("removing discount code")
            const removeResults = await removeDiscount(appliedDiscounts.discountCode);
          } catch (e) {
            //console.log(e)
          }
        }

      };

      if (loadingStatus !== 'setting') {
        applyMembershipDiscount();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderMetaData, lineItems.length]);

    return (
      <div className="order-payment-method">
        <div className={`checkout__header checkout__header--border-on-closed checkout__row ${paymentMethodOpen ? 'checkout__header--open' : 'checkout__header--closed'}`}>
          <h3>Payment Method</h3>
        </div>
        {!!paymentMethodOpen &&
          <>
            <iframe
              title="payments"
              data-bold-pigi-iframe
              className="PaymentMethod__Iframe"
              src={paymentIframeUrl}
              style={style}
              onLoad={() => {
                onPaymentIframeLoaded()
                function updateMediaMatch(event) {
                  const payload = {
                    conditionText: event.media,
                    matches: event.matches,
                  };
                  const iframeElement = document.querySelector("iframe.PaymentMethod__Iframe");
                  if (!iframeElement) {
                    return false
                  }
                  const iframeWindow = iframeElement.contentWindow;
                  const action = { actionType: "PIGI_UPDATE_MEDIA_MATCH", payload };
                  iframeWindow.postMessage(action, "*");
                }

                PIGIMediaRules.forEach((rule) => {
                  const mediaMatch = window.matchMedia(rule.conditionText);
                  mediaMatch.addListener(updateMediaMatch);
                  updateMediaMatch(mediaMatch);
                });


              }}
            />
            {content}
          </>
        }
      </div>
    );
  }
);

export default PaymentMethod;
