import { render, screen } from '@testing-library/react';
import { HeadlessCheckoutProvider, useHeadlessCheckoutContext } from './HeadlessCheckoutContext';
import { randomUUID } from 'crypto';

const useCustomerContext = jest.fn(() => {});

jest.mock('@/components/HeadlessCheckout/CheckoutFlyout/index.js', () => {
  return {
    __esModule: true,
    default: () => {
      return <div></div>;
    }
  };
});

jest.mock('next/router', () => require('next-router-mock'));

jest.mock('./CustomerContext', () => {
  return {
    __esModule: true,
    useCustomerContext: () => useCustomerContext()
  }
});

describe('HeadlessCheckoutContext', () => {
  const fetch = jest.fn();
  let public_order_id;
  let jwt_token;
  let checkout_data;

  const Consumer = () => {
    const { refreshShipOptionData } = useHeadlessCheckoutContext();
  
    return (
      <div>
        <button onClick={() => refreshShipOptionData('12345')}>refreshShipOptionData</button>
      </div>
    );
  };

  beforeEach(() => {
    useCustomerContext.mockReturnValue(() => {
      customer: {}
    });

    public_order_id = randomUUID();
    jwt_token = randomUUID();
    checkout_data = {
      jwt_token,
      public_order_id,
      application_state: {}
    };

    localStorage.setItem('checkout_data', JSON.stringify(checkout_data))

    global.fetch = fetch;

    fetch.mockImplementation((url, req) => {
      if (url.includes('checkout/initialize-otp') || url.includes('checkout/resume-order')) {
        return {
          json: () => {
            return {
              data: checkout_data
            }
          }
        }
      } else if (url.includes(`${public_order_id}/payments/styles`)) {
        return {
          json: () => {
            return {
              data: {
                style_sheet: {}
              }
            }
          }
        }
      } else {
        return {
          status: 404,
        }
      }
    });
  });

  afterEach(() => {
    delete global.fetch;
  });
  
  describe('refreshShipOptionData', () => {
    it('should call the checkout api for loading extra ship option data', () => {
      const wrapper = render(
        <HeadlessCheckoutProvider>
          <Consumer/>
        </HeadlessCheckoutProvider>
      );
      screen.debug();
    });

    it('should include bundled ship week in payload when available', () => {});

    it('should not include bundled ship week in payload when not available', () => {});

    it('should include zip in payload', () => {});

    it('should update ship option metadata with response', () => {});
  });
});