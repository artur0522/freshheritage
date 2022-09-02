import { HeadlessCheckoutContext } from "@/context/HeadlessCheckoutContext";
import { render } from "@testing-library/react";
import ShippingLines from "./ShippingLines"
import userEvent from '@testing-library/user-event';
import { randomUUID } from 'crypto';

const useLoadingStatus = jest.fn(() => {});
const useShippingLines = jest.fn(() => {});
const useShippingAddress = jest.fn(() => {});
const useErrors = jest.fn(() => {});
const useOrderMetadata = jest.fn(() => {});
const useLineItems = jest.fn(() => {});

const updateShippingLine = jest.fn(() => {});
const appendOrderMetadata = jest.fn(() => {});

jest.mock('@/components/HeadlessCheckout/CheckoutFlyout/index.js', () => {
  return {
    __esModule: true,
    default: () => {
      return <div></div>;
    }
  };
});

jest.mock('../LoadingState', () => {
  return {
    __esModule: true,
    LoadingState: () => {
      return <div>THIS IS LOADING...</div>;
    }
  };
});

jest.mock('@boldcommerce/checkout-react-components', () => {
  return {
    __esModule: true,
    useShippingAddress: () => useShippingAddress(),
    useShippingLines: () => useShippingLines(),
    useLoadingStatus: () => useLoadingStatus(),
    useErrors: () => useErrors(),
    useOrderMetadata: () => useOrderMetadata(),
    useLineItems: () => useLineItems()
  }
});

jest.mock('./components', () => {
  return {
    ShippingLineList: ({
      shippingLines,
      shipOptionMetadata,
      selectedShippingLine,
      selectedStandardShipWeek,
      onChange,
      onShipWeekChange
    }) => {
      return (
        <div>
          <p>THIS IS SHIPPING LINES LIST</p>
          <p>{JSON.stringify(shippingLines)}</p>
          <p>{JSON.stringify(shipOptionMetadata)}</p>
          <p>{`Selected Shipping Line: ${selectedShippingLine.description}`}</p>
          <p>{`Selected Standard Ship Week: ${selectedStandardShipWeek}`}</p>
          <button onClick={() => onChange(shippingLines[1])}>
            onChange
          </button>
          <button onClick={() => onShipWeekChange(35)}>
            onShipWeekChange
          </button>
        </div>
      )
    },
    EmptyShippingLines: () => {
      return (
        <div>
          <p>SO EMPTY</p>
        </div>
      )
    }
  }
});

describe('<ShippingLines />', () => {
  const expeditedProductId = randomUUID();
  const lineItems = [{product_data: {product_id: expeditedProductId}}];

  const shippingLines = [
    {description: 'Free Standard Shipping'},
    {description: 'Expedited Shipping'}
  ];

  const shipOptionMetadata = {
    expedited: {
      estimatedDeliveryDateDisplay: 'ESTIMATEDDELIVERYDATE'
    },
    bundled: {
      shipWeekDisplay: 'SHIPWEEKDISPLAY',
      shipWeekPreference: 35
    },
    standard: [{dumb: true}]
  };

  beforeEach(() => {
    useLoadingStatus.mockReturnValue({
      data: {}
    });
    useShippingLines.mockReturnValue({
      data: {
        shippingLines,
        selectedShippingLineIndex: 0
      },
      updateShippingLine,
      getShippingLines: jest.fn(),
    });
    useShippingAddress.mockReturnValue({
      data: {
        country_code: 'US'
      }
    });
    useErrors.mockReturnValue({
      data: {}
    });
    useOrderMetadata.mockReturnValue({
      appendOrderMetadata
    });
    useLineItems.mockReturnValue({
      data: lineItems
    });

    process.env.NEXT_PUBLIC_AUTOMATICALLY_EXPEDITED_PRODUCTS = `["${expeditedProductId}"]`;
  });

  it('should show loading state when app loading', () => {
    const wrapper = render(
      <HeadlessCheckoutContext.Provider value={{
        shipOptionMetadata
      }}>
        <ShippingLines
          applicationLoading={true}
          />
      </HeadlessCheckoutContext.Provider>
    )
    expect(wrapper.getByText('THIS IS LOADING...')).toBeVisible();
  });

  it('should show loading state when shipping lines loaded but metadata still not loaded', () => {
    useShippingLines.mockReturnValue({
      data: {
        shippingLines,
        selectedShippingLineIndex: 0
      },
      updateShippingLine,
      getShippingLines: jest.fn(),
    });
    const wrapper = render(
      <HeadlessCheckoutContext.Provider value={{
        shipOptionMetadata: undefined
      }}>
        <ShippingLines
          applicationLoading={false}
          />
      </HeadlessCheckoutContext.Provider>
    )
    expect(wrapper.getByText('THIS IS LOADING...')).toBeVisible();
  });

  it('should show loading state when shipping address loading', () => {
    useLoadingStatus.mockReturnValue({data: {shippingAddress: 'setting'}});
    const wrapper = render(
      <HeadlessCheckoutContext.Provider value={{
        shipOptionMetadata
      }}>
        <ShippingLines
          applicationLoading={false}
          />
      </HeadlessCheckoutContext.Provider>
    )
    expect(wrapper.getByText('THIS IS LOADING...')).toBeVisible();
  });

  it('should show loading state when shipping lines loading', () => {
    useLoadingStatus.mockReturnValue({data: {shippingLines: 'fetching'}});
    const wrapper = render(
      <HeadlessCheckoutContext.Provider value={{
        shipOptionMetadata
      }}>
        <ShippingLines
          applicationLoading={false}
          />
      </HeadlessCheckoutContext.Provider>
    )
    expect(wrapper.getByText('THIS IS LOADING...')).toBeVisible();
  });

  it('should show loading state when no shipOptionMetadata', () => {
    const wrapper = render(
      <HeadlessCheckoutContext.Provider value={{}}>
        <ShippingLines
          applicationLoading={false}
          />
      </HeadlessCheckoutContext.Provider>
    )
    expect(wrapper.getByText('THIS IS LOADING...')).toBeVisible();
  });

  it('should show empty state when no selected country code', () => {
    useShippingAddress.mockReturnValue({
      data: {}
    });
    const wrapper = render(
      <HeadlessCheckoutContext.Provider value={{
        shipOptionMetadata
      }}>
        <ShippingLines
          applicationLoading={false}
          />
      </HeadlessCheckoutContext.Provider>
    );
    expect(wrapper.getByText('SO EMPTY')).toBeVisible();
  });

  it('should show empty state when shipping address errors', () => {
    useErrors.mockReturnValue({
      data: {
        shippingAddress: [
          'Something bad happened'
        ]
      }
    });
    const wrapper = render(
      <HeadlessCheckoutContext.Provider value={{
        shipOptionMetadata
      }}>
        <ShippingLines
          applicationLoading={false}
          />
      </HeadlessCheckoutContext.Provider>
    );
    expect(wrapper.getByText('SO EMPTY')).toBeVisible();
  });

  it('should show empty state when shipping address loading incomplete', () => {
    useLoadingStatus.mockReturnValue({
      data: {
        shippingAddress: 'incomplete'
      }
    });
    const wrapper = render(
      <HeadlessCheckoutContext.Provider value={{
        shipOptionMetadata
      }}>
        <ShippingLines
          applicationLoading={false}
          />
      </HeadlessCheckoutContext.Provider>
    );
    expect(wrapper.getByText('SO EMPTY')).toBeVisible();
  });

  it('should show empty state when empty shipping lines array', () => {
    useShippingLines.mockReturnValue({
      data: {shippingLines: []},
      updateShippingLine: jest.fn(),
      getShippingLines: jest.fn(),
    });
    const wrapper = render(
      <HeadlessCheckoutContext.Provider value={{
        shipOptionMetadata
      }}>
        <ShippingLines
          applicationLoading={false}
          />
      </HeadlessCheckoutContext.Provider>
    );
    expect(wrapper.getByText('SO EMPTY')).toBeVisible();
  });

  it('should show shipping line list when set to display', () => {
    const displayedLines = [{description: 'Free Standard Shipping'}, {description: 'Expedited Shipping'}];

    useShippingLines.mockReturnValue({
      data: {
        shippingLines: displayedLines,
        selectedShippingLineIndex: 0
      },
      updateShippingLine: jest.fn(),
      getShippingLines: jest.fn(),
    });

    const wrapper = render(
      <HeadlessCheckoutContext.Provider value={{
        shipOptionMetadata
      }}>
        <ShippingLines
          applicationLoading={false}
          />
      </HeadlessCheckoutContext.Provider>
    );
    expect(wrapper.getByText(JSON.stringify(displayedLines))).toBeVisible();
  });

  it('should filter out expedited shipping when no expedited product', () => {
    const displayedLines = [{description: 'Free Standard Shipping'}, {description: 'Expedited Shipping'}];

    useShippingLines.mockReturnValue({
      data: {
        shippingLines: displayedLines,
        selectedShippingLineIndex: 0
      },
      updateShippingLine: jest.fn(),
      getShippingLines: jest.fn(),
    });

    useLineItems.mockReturnValue({
      data: [{product_data: {product_id: randomUUID()}}]
    });

    const wrapper = render(
      <HeadlessCheckoutContext.Provider value={{
        shipOptionMetadata
      }}>
        <ShippingLines
          applicationLoading={false}
          />
      </HeadlessCheckoutContext.Provider>
    );
    expect(wrapper.getByText('[{"description":"Free Standard Shipping"}]')).toBeVisible();
  })

  describe('handleChange', () => {
    it('should update the local selected shipping line', async () => {
      const wrapper = render(
        <HeadlessCheckoutContext.Provider value={{
          shipOptionMetadata
        }}>
          <ShippingLines
            applicationLoading={false}
            />
        </HeadlessCheckoutContext.Provider>
      );
      expect(wrapper.getByText('Selected Shipping Line: Free Standard Shipping')).toBeVisible();
      await userEvent.click(wrapper.getByText('onChange'));
      expect(wrapper.getByText('Selected Shipping Line: Expedited Shipping')).toBeVisible();
    });

    it('should update the shipping line with bold', async () => {
      const wrapper = render(
        <HeadlessCheckoutContext.Provider value={{
          shipOptionMetadata
        }}>
          <ShippingLines
            applicationLoading={false}
            />
        </HeadlessCheckoutContext.Provider>
      );
      await userEvent.click(wrapper.getByText('onChange'));
      expect(updateShippingLine).toHaveBeenCalledWith(1);
    });
  });

  describe('handleShipWeekChange', () => {
    it('should update the ship week preference', async () => {
      const wrapper = render(
        <HeadlessCheckoutContext.Provider value={{
          shipOptionMetadata
        }}>
          <ShippingLines
            applicationLoading={false}
            />
        </HeadlessCheckoutContext.Provider>
      );
      expect(wrapper.getByText('Selected Standard Ship Week:')).toBeVisible();
      await userEvent.click(wrapper.getByText('onShipWeekChange'));
      expect(wrapper.getByText('Selected Standard Ship Week: 35')).toBeVisible();
    });

    it('should update the ship week preference on the order', async () => {
      const wrapper = render(
        <HeadlessCheckoutContext.Provider value={{
          shipOptionMetadata
        }}>
          <ShippingLines
            applicationLoading={false}
            />
        </HeadlessCheckoutContext.Provider>
      );
      await userEvent.click(wrapper.getByText('onShipWeekChange'));
      expect(appendOrderMetadata).toHaveBeenCalledWith({
        "note_attributes": {
          "ship_week_preference": 35
        }
      });
    });
  });
});