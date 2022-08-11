import { render, screen } from "@testing-library/react";

jest.mock('@/components/HeadlessCheckout/CheckoutFlyout/index.js', () => {
  return {
    __esModule: true,
    default: () => {
      return <div></div>;
    }
  };
});

jest.mock('@/context/CustomerContext', () => {
  return {
    __esModule: true,
    useCustomerContext: () => {
      return {
        customer: {}
      }
    }
  }
});

jest.mock('@boldcommerce/checkout-react-components', () => {
  return {
    __esModule: true,
    useSavedAddresses: () => {
      return {
        data: []
      }
    },
    useShippingAddress: () => {
      return {
        data: {},
        submitShippingAddress: () => {},
      }
    },
    useLoadingStatus: () => {
      return {
        data: {}
      }
    },
    useCountryInfo: () => {
      return {
        data: {
          countries: [],
          provinces: [],
          showProvince: true,
          shopPostalCode: true,
          provinceLabel: 'zip code',
        }
      }
    }
  }
});

import { HeadlessCheckoutProvider } from "@/context/HeadlessCheckoutContext";
import ShippingAddress from "./ShippingAddress";

describe('ShippingAddress', () => {
  describe('updateSelectedShippingAddress', () => {
    it('should set address for ShippingAddress component', () => {
      render(
        // <HeadlessCheckoutProvider>
          <ShippingAddress
            applicationLoading={false}
          />
        // </HeadlessCheckoutProvider>
      );
      screen.debug();
    });
    
    it('should submit updated address to bold handler', () => {});
    
    it('should refresh ship option data', () => {});
  });
});
