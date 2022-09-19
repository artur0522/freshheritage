import { render } from "@testing-library/react";
import { randomUUID } from "crypto";
import userEvent from '@testing-library/user-event';

let postal_code = randomUUID();
const submitShippingAddress = jest.fn(() => {});

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

jest.mock('@/context/MemberAccountContext', () => {
  return {
    __esModule: true,
    useMemberAccountContext: () => {
      return {
        subsData: []
      }
    }
  }
});

jest.mock('@/components/HeadlessCheckout/Address', () => {
  return {
    __esModule: true,
    Address: ({submit, address}) => {
      return <div>
        <button
          onClick={() => {
            submit()
          }}
        >
          Address Component
        </button>
        <p>{JSON.stringify(address)}</p>
      </div>;
    }
  }
});

jest.mock('./components', () => {
  return {
    __esModule: true,
    SavedAddressList: () => {
      return <div>nothing</div>;
    }
  }
})

jest.mock('@boldcommerce/checkout-react-components', () => {
  return {
    __esModule: true,
    useShippingAddress: () => {
      return {
        data: {postal_code},
        submitShippingAddress
      }
    },
    useSavedAddresses: () => {
      return {
        data: []
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
    },
    useShippingLines: () => {
      return {
        data: {
          shippingLines: []
        }
      }
    }
  }
});

import { HeadlessCheckoutContext } from "@/context/HeadlessCheckoutContext";
import ShippingAddress from "./ShippingAddress";

describe('<ShippingAddress />', () => {
  const refreshShipOptionData = jest.fn(() => {});

  describe('updateSelectedShippingAddress', () => {
    it('should submit updated address to bold handler', async () => {
      const wrapper = render(
        <HeadlessCheckoutContext.Provider value={{
          refreshShipOptionData
        }}>
          <ShippingAddress
            applicationLoading={false}
          />
        </HeadlessCheckoutContext.Provider>
      );
      await userEvent.click(wrapper.getByText('Address Component'));
      expect(submitShippingAddress).toHaveBeenCalledWith({postal_code});
    });
    
    it('should refresh ship option data', async () => {
      const wrapper = render(
        <HeadlessCheckoutContext.Provider value={{
          refreshShipOptionData
        }}>
          <ShippingAddress
            applicationLoading={false}
          />
        </HeadlessCheckoutContext.Provider>
      );
      await userEvent.click(wrapper.getByText('Address Component'));
      expect(refreshShipOptionData).toHaveBeenCalledWith(postal_code);
    });
  });
});
