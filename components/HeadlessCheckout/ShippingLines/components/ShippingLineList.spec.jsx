import { render } from '@testing-library/react';
import { ShippingLineList } from './ShippingLineList';
import userEvent from '@testing-library/user-event';

jest.mock('@/components/HeadlessCheckout/CheckoutFlyout/index.js', () => {
  return {
    __esModule: true,
    default: () => {
      return <div></div>;
    }
  };
});

describe('<ShippingLineList />', () => {
  const onChange = jest.fn(() => {});
  const onShipWeekChange = jest.fn(() => {});

  const shippingLines = [
    {id: 0, description: 'Bundle with Next Order', amount: 0},
    {id: 1, description: 'Standard', amount: 2000},
    {id: 2, description: 'Expedited', amount: 10000}
  ];

  const shipOptionMetadata = {
    expedited: {
      estimatedDeliveryDateDisplay: 'TOMORROW'
    },
    standard: [
      {shipWeekDisplay: 'NEXT WEEK', shipWeekPreference: 23},
      {shipWeekDisplay: 'THE WEEK AFTER NEXT', shipWeekPreference: 24},
      {shipWeekDisplay: 'CHRISTMAS', shipWeekPreference: 25}
    ],
    bundled: {
      shipWeekDisplay: 'NOW AND LATER',
      shipWeekPreference: 35
    }
  };

  it('should display available shipping lines', () => {
    const wrapper = render(<ShippingLineList 
      shippingLines={shippingLines}
      shipOptionMetadata={shipOptionMetadata}
      selectedShippingLineIndex={0}
      onChange={onChange}
      onShipWeekChange={onShipWeekChange}
      disabled={false}
    />);
    expect(wrapper.getByText('Bundle with Next Order')).toBeVisible();
    expect(wrapper.getByText('$0.00')).toBeVisible();
    expect(wrapper.getByText('Standard')).toBeVisible();
    expect(wrapper.getByText('$20.00')).toBeVisible();
    expect(wrapper.getByText('Expedited')).toBeVisible();
    expect(wrapper.getByText('$100.00')).toBeVisible();
  });

  it('should display additional standard shipping line week options', () => {
    const wrapper = render(<ShippingLineList 
      shippingLines={shippingLines}
      shipOptionMetadata={shipOptionMetadata}
      selectedShippingLineIndex={0}
      onChange={onChange}
      onShipWeekChange={onShipWeekChange}
      disabled={false}
    />);
    expect(wrapper.getByText('Ship week of NEXT WEEK')).toBeVisible();
    expect(wrapper.getByText('Ship week of THE WEEK AFTER NEXT')).toBeVisible();
    expect(wrapper.getByText('Ship week of CHRISTMAS')).toBeVisible();
  });

  it('should map proper values for bundled order', () => {
    const wrapper = render(<ShippingLineList 
      shippingLines={shippingLines}
      shipOptionMetadata={shipOptionMetadata}
      selectedShippingLineIndex={0}
      onChange={onChange}
      onShipWeekChange={onShipWeekChange}
      disabled={false}
    />);
    expect(wrapper.getByText('Shipping between NOW AND LATER')).toBeVisible();
  });

  it('should hide bundled order when no bundled order metadata', () => {
    const wrapper = render(<ShippingLineList 
      shippingLines={shippingLines}
      shipOptionMetadata={{
        expedited: {
          estimatedDeliveryDateDisplay: 'TOMORROW'
        },
        standard: [],
      }}
      selectedShippingLineIndex={0}
      onChange={onChange}
      onShipWeekChange={onShipWeekChange}
      disabled={false}
    />);
    expect(wrapper.queryByText('Bundle with Next Order')).toBeNull();
  });

  it('should map proper values for expedited order', () => {
    const wrapper = render(<ShippingLineList 
      shippingLines={shippingLines}
      shipOptionMetadata={shipOptionMetadata}
      selectedShippingLineIndex={0}
      onChange={onChange}
      onShipWeekChange={onShipWeekChange}
      disabled={false}
    />);
    expect(wrapper.getByText('Estimated delivery on TOMORROW')).toBeVisible();
  });

  it('should not start with hidden option selected', () => {
    let selectedOption = 0;
    onChange.mockImplementation((value) => selectedOption = value);
    const {container} = render(<ShippingLineList 
      shippingLines={shippingLines}
      shipOptionMetadata={{
        expedited: {
          estimatedDeliveryDateDisplay: 'TOMORROW'
        },
        standard: [
          {shipWeekDisplay: 'NEXT WEEK'},
          {shipWeekDisplay: 'THE WEEK AFTER NEXT'},
          {shipWeekDisplay: 'CHRISTMAS'}
        ]
      }}
      selectedShippingLineIndex={selectedOption}
      onChange={onChange}
      onShipWeekChange={onShipWeekChange}
      disabled={false}
    />);
    expect(selectedOption).toBe(1);
    expect(
      container
        .querySelector('.checkout__radio-wrapper.is-selected')
        .querySelector('.checkout__radio-label')
        .textContent
    ).toBe('Standard$20.00')
  });

  it('should update shipping line index when one selected', async () => {
    let selectedOption = 0;
    onChange.mockImplementation((value) => selectedOption = value);
    const wrapper = render(<ShippingLineList 
      shippingLines={shippingLines}
      shipOptionMetadata={shipOptionMetadata}
      selectedShippingLineIndex={selectedOption}
      onChange={onChange}
      onShipWeekChange={onShipWeekChange}
      disabled={false}
    />);
    await userEvent.click(wrapper.getByText('Expedited'));
    expect(selectedOption).toBe(2);
    expect(onChange).toHaveBeenCalledWith(2);
    expect(
      wrapper.container
        .querySelector('.checkout__radio-wrapper.is-selected')
        .querySelector('.checkout__radio-label')
        .textContent
    ).toBe('Expedited$100.00')
  });

  it('should start without a selected standard ship week option', () => {
    const {container} = render(<ShippingLineList 
      shippingLines={shippingLines}
      shipOptionMetadata={shipOptionMetadata}
      selectedShippingLineIndex={1} // start with standard option
      selectedStandardShipWeek={-1}
      onChange={onChange}
      onShipWeekChange={onShipWeekChange}
      disabled={false}
    />);
    expect(
      container
        .querySelector('.checkout__secondary-radio-wrapper.is-selected')
    ).toBeNull()
  });

  it('should update ship week when a standard ship week option selected', async () => {
    let shipWeekOption = -1;
    onShipWeekChange.mockImplementation((value) => shipWeekOption = value);
    const wrapper = render(<ShippingLineList 
      shippingLines={shippingLines}
      shipOptionMetadata={shipOptionMetadata}
      selectedShippingLineIndex={1}
      selectedStandardShipWeek={shipWeekOption}
      onChange={onChange}
      onShipWeekChange={onShipWeekChange}
      disabled={false}
    />);
    await userEvent.click(wrapper.getByText('CHRISTMAS', {exact: false}));
    expect(shipWeekOption).toBe(25);
    expect(onChange).toHaveBeenCalledWith(2);
    expect(
      wrapper.container
        .querySelector('.checkout__secondary-radio-wrapper.is-selected')
        .querySelector('.checkout__secondary-radio-label')
        .textContent
    ).toBe('CHRISTMAS')
  });

  it('should unset ship week when non-standard line selected', () => {});

  it('should unset ship week when currently selected ship week selected', () => {});

  it('should set ship week preference for bundled order', () => {});
});