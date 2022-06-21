import { CheckoutProvider } from '@boldcommerce/checkout-react-components';
import CheckoutSwitch from './CheckoutSwitch';
import '@/i18n/config';
// this component should receive the data from the parent component which is the CheckoutFlyout
export function StateBasedCheckout({data}) {

  if (data?.application_state.line_items.length === 0) {
    return ''
  }

  return (
    <CheckoutProvider
      applicationState={data.application_state}
      initialData={data.initial_data}
      publicOrderId={data.public_order_id}
      token={data.jwt_token}
      storeIdentifier={data.storeIdentifier}
      apiBase="https://api.boldcommerce.com/checkout/storefront"
    >
      <CheckoutSwitch />
    </CheckoutProvider>
  );
}

export default StateBasedCheckout;
