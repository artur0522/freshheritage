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
    {id: 0, description: 'Ship with Next Order', amount: 0},
    {id: 1, description: 'Free Standard Shipping', amount: 2000},
    {id: 2, description: 'Expedited Shipping', amount: 10000}
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
      selectedShippingLine={0}
      onChange={onChange}
      onShipWeekChange={onShipWeekChange}
      disabled={false}
    />);
    expect(wrapper.getByText('Ship with Next Order')).toBeVisible();
    expect(wrapper.getByText('$0.00')).toBeVisible();
    expect(wrapper.getByText('Free Standard Shipping')).toBeVisible();
    expect(wrapper.getByText('$20.00')).toBeVisible();
    expect(wrapper.getByText('Expedited Shipping')).toBeVisible();
    expect(wrapper.getByText('$100.00')).toBeVisible();
  });

  it('should display additional standard shipping line week options', () => {
    const wrapper = render(<ShippingLineList 
      shippingLines={shippingLines}
      shipOptionMetadata={shipOptionMetadata}
      selectedShippingLine={0}
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
      selectedShippingLine={shippingLines[0]}
      onChange={onChange}
      onShipWeekChange={onShipWeekChange}
      disabled={false}
    />);
    expect(wrapper.getByText('Shipping between NOW AND LATER')).toBeVisible();
  });

  it('should map proper values for expedited order', () => {
    const wrapper = render(<ShippingLineList 
      shippingLines={shippingLines}
      shipOptionMetadata={shipOptionMetadata}
      selectedShippingLine={shippingLines[0]}
      onChange={onChange}
      onShipWeekChange={onShipWeekChange}
      disabled={false}
    />);
    expect(wrapper.getByText('Estimated delivery on TOMORROW')).toBeVisible();
  });

  it('should update shipping line when one selected', async () => {
    let selectedOption = shippingLines[0];
    onChange.mockImplementation((value) => selectedOption = value);
    const wrapper = render(<ShippingLineList 
      shippingLines={shippingLines}
      shipOptionMetadata={shipOptionMetadata}
      selectedShippingLine={selectedOption}
      onChange={onChange}
      onShipWeekChange={onShipWeekChange}
      disabled={false}
    />);
    await userEvent.click(wrapper.getByText('Expedited Shipping'));
    expect(selectedOption).toBe(shippingLines[2]);
    expect(onChange).toHaveBeenCalledWith(shippingLines[2]);
  });

  it('should update view when selected shipping line changes', () => {
    const wrapper = render(<ShippingLineList 
      shippingLines={shippingLines}
      shipOptionMetadata={shipOptionMetadata}
      selectedShippingLine={shippingLines[0]}
      onChange={onChange}
      onShipWeekChange={onShipWeekChange}
      disabled={false}
    />);
    expect(
      wrapper.container
        .querySelector('.checkout__radio-wrapper.is-selected')
        .querySelector('.checkout__radio-label')
        .textContent
    ).toBe('Ship with Next Order$0.00');
    wrapper.rerender(
      <ShippingLineList 
        shippingLines={shippingLines}
        shipOptionMetadata={shipOptionMetadata}
        selectedShippingLine={shippingLines[2]}
        onChange={onChange}
        onShipWeekChange={onShipWeekChange}
        disabled={false}
      />
    );
    expect(
      wrapper.container
        .querySelector('.checkout__radio-wrapper.is-selected')
        .querySelector('.checkout__radio-label')
        .textContent
    ).toBe('Expedited Shipping$100.00');
  });

  it('should start without a selected standard ship week option', () => {
    const {container} = render(<ShippingLineList 
      shippingLines={shippingLines}
      shipOptionMetadata={shipOptionMetadata}
      selectedShippingLine={shippingLines[0]} // start with standard option
      selectedStandardShipWeek={-1}
      onChange={onChange}
      onShipWeekChange={onShipWeekChange}
      disabled={false}
    />);
    expect(
      container
        .querySelector('.checkout__secondary-radio-wrapper.is-selected')
    ).toBeNull();
  });

  it('should update ship week when a standard ship week option selected', async () => {
    let shipWeekOption = '';
    onShipWeekChange.mockImplementation((value) => shipWeekOption = value);
    const wrapper = render(<ShippingLineList 
      shippingLines={shippingLines}
      shipOptionMetadata={shipOptionMetadata}
      selectedShippingLine={shippingLines[1]}
      selectedStandardShipWeek={shipWeekOption}
      onChange={onChange}
      onShipWeekChange={onShipWeekChange}
      disabled={false}
    />);
    await userEvent.click(wrapper.getByText('CHRISTMAS', {exact: false}));
    expect(shipWeekOption).toBe(25);
    expect(onShipWeekChange).toHaveBeenCalledWith(25);
  });

  it('should update view when ship week option index changes', () => {
    const wrapper = render(<ShippingLineList 
      shippingLines={shippingLines}
      shipOptionMetadata={shipOptionMetadata}
      selectedShippingLine={shippingLines[1]}
      selectedStandardShipWeek={''}
      onChange={onChange}
      onShipWeekChange={onShipWeekChange}
      disabled={false}
    />);
    expect(
      wrapper.container
        .querySelector('.checkout__secondary-radio-wrapper.is-selected')
    ).toBeNull();
    wrapper.rerender(<ShippingLineList 
      shippingLines={shippingLines}
      shipOptionMetadata={shipOptionMetadata}
      selectedShippingLine={shippingLines[1]}
      selectedStandardShipWeek={25}
      onChange={onChange}
      onShipWeekChange={onShipWeekChange}
      disabled={false}
    />);
    expect(
      wrapper.container
        .querySelector('.checkout__secondary-radio-wrapper.is-selected')
        .querySelector('.checkout__secondary-radio-label')
        .textContent
    ).toBe('Ship week of CHRISTMAS');
  })

  it('should unset ship week when non-standard line selected', async () => {
    let shipWeekOption = 25;
    let selectedOption = shippingLines[1];
    onShipWeekChange.mockImplementation((value) => shipWeekOption = value);
    onChange.mockImplementation((value) => selectedOption = value);
    const wrapper = render(<ShippingLineList 
      shippingLines={shippingLines}
      shipOptionMetadata={shipOptionMetadata}
      selectedShippingLine={selectedOption}
      selectedStandardShipWeek={shipWeekOption}
      onChange={onChange}
      onShipWeekChange={onShipWeekChange}
      disabled={false}
    />);
    await userEvent.click(wrapper.getByText('Expedited Shipping'));
    expect(shipWeekOption).toBe(null);
    expect(onShipWeekChange).toHaveBeenCalledWith(null);
    expect(selectedOption).toBe(shippingLines[2]);
    expect(onChange).toHaveBeenCalledWith(shippingLines[2]);
  });

  it('should unset ship week when currently selected ship week selected', async () => {
    let shipWeekOption = 25;
    let selectedOption = shippingLines[1];
    onShipWeekChange.mockImplementation((value) => shipWeekOption = value);
    onChange.mockImplementation((value) => selectedOption = value);
    const wrapper = render(<ShippingLineList 
      shippingLines={shippingLines}
      shipOptionMetadata={shipOptionMetadata}
      selectedShippingLine={selectedOption}
      selectedStandardShipWeek={shipWeekOption}
      onChange={onChange}
      onShipWeekChange={onShipWeekChange}
      disabled={false}
    />);
    await userEvent.click(wrapper.getByText('CHRISTMAS', {exact: false}));
    expect(shipWeekOption).toBeNull();
    expect(onShipWeekChange).toHaveBeenCalledWith(null);
    expect(selectedOption).toBe(shippingLines[1]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should set ship week preference for bundled order', async () => {
    let shipWeekOption = 25;
    let selectedOption = shippingLines[1];
    onShipWeekChange.mockImplementation((value) => shipWeekOption = value);
    onChange.mockImplementation((value) => selectedOption = value);
    const wrapper = render(<ShippingLineList 
      shippingLines={shippingLines}
      shipOptionMetadata={shipOptionMetadata}
      selectedShippingLine={selectedOption}
      selectedStandardShipWeek={shipWeekOption}
      onChange={onChange}
      onShipWeekChange={onShipWeekChange}
      disabled={false}
    />);
    await userEvent.click(wrapper.getByText('Ship with Next Order'));
    expect(shipWeekOption).toBe(35);
    expect(onShipWeekChange).toHaveBeenCalledWith(35);
    expect(selectedOption).toBe(shippingLines[0]);
    expect(onChange).toHaveBeenCalledWith(shippingLines[0]);
  });

  it('should remove focus from selected Standard ship week option when changed', () => {
    const wrapper = render(<ShippingLineList 
      shippingLines={shippingLines}
      shipOptionMetadata={shipOptionMetadata}
      selectedShippingLine={shippingLines[1]}
      selectedStandardShipWeek={25}
      onChange={onChange}
      onShipWeekChange={onShipWeekChange}
      disabled={false}
    />);
    expect(
      wrapper.container
        .querySelector('.checkout__secondary-radio-wrapper.is-selected')
        .querySelector('.checkout__secondary-radio-label')
        .textContent
    ).toBe('Ship week of CHRISTMAS');
    wrapper.rerender(<ShippingLineList 
      shippingLines={shippingLines}
      shipOptionMetadata={shipOptionMetadata}
      selectedShippingLine={shippingLines[1]}
      selectedStandardShipWeek={null}
      onChange={onChange}
      onShipWeekChange={onShipWeekChange}
      disabled={false}
    />);
    expect(
      wrapper.container
        .querySelector('.checkout__secondary-radio-wrapper.is-selected')
    ).toBeNull();
  });
});