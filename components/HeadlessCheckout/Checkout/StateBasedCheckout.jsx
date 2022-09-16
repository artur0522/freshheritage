import { CheckoutProvider } from '@boldcommerce/checkout-react-components';
import CheckoutSwitch from './CheckoutSwitch';
import '@/i18n/config';
// this component should receive the data from the parent component which is the CheckoutFlyout
export function StateBasedCheckout({data}) {

  const localStorageCheckoutData = JSON.parse(localStorage.getItem('checkout_data')) || '';

  if (data?.application_state.line_items.length === 0) {
    return ''
  }

  if (localStorageCheckoutData === '') {
    return ''
  }

  return (
    <CheckoutProvider
      applicationState={data.application_state}
      initialData={localStorageCheckoutData.initial_data}
      publicOrderId={localStorageCheckoutData.public_order_id}
      token={localStorageCheckoutData.jwt}
      storeIdentifier={process.env.NEXT_PUBLIC_SHOP_IDENTIFIER}
      apiBase="https://api.boldcommerce.com/checkout/storefront"
    >
      <CheckoutSwitch />
    </CheckoutProvider>
  );
}

export default StateBasedCheckout;
