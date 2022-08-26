import Checkbox from "react-custom-checkbox";
import { formatPrice } from '@/utils/formatPrice';

export const ShippingLineList = ({
  shippingLines,
  selectedShippingLineIndex,
  onChange,
  disabled,
  selectedStandardShipWeek,
  onShipWeekChange,
  shipOptionMetadata
}) => {
  const displayedShippingLines = shippingLines
    .map(line => {
      switch(line.description) {
        case 'Ship with Next Order':
          if (!!shipOptionMetadata.bundled) {
            line.showOption = true;
            line.display = `Shipping between ${shipOptionMetadata.bundled.shipWeekDisplay}`;
            line.shipWeekPreference = shipOptionMetadata.bundled.shipWeekPreference;
          }
          else line.showOption = false;
          break;
        case 'Free Standard Shipping':
          line.showOption = true;
          line.options = shipOptionMetadata.standard;
          break;
        case 'Expedited Shipping':
          line.showOption = true;
          line.display = `Estimated delivery on ${shipOptionMetadata.expedited.estimatedDeliveryDateDisplay}`;
          break;
      }
      return line;
    });

  // Don't select a shipping line that is not visible
  if (selectedShippingLineIndex !== -1 && !displayedShippingLines[selectedShippingLineIndex].showOption) {
    // Currently defaults to automatically select the first option (which is the lowest price)
    // should only be hiding the bundled ship line, so for now we can just move to the next one
    const newIndex = displayedShippingLines.findIndex(line => line.showOption);
    onChange(newIndex);
    selectedShippingLineIndex = newIndex;
  }

  return (
    <div className="shipping-method-selector">
      {displayedShippingLines && displayedShippingLines.map((method, index) => {
        if (method.showOption) {
          const lineSelected = selectedShippingLineIndex === parseInt(method.id, 10);
          let label;
          let extraOptions;

          if (method.description === 'Free Standard Shipping') {
            extraOptions = (
              <div className={`secondary-shipping-method-selector ${lineSelected ? 'is-visible' : ''}`}>
                {method.options.map((o, i) => {
                  const shipWeekOptionSelected = selectedStandardShipWeek === o.shipWeekPreference
                  return (
                    <div key={i} className={`checkout__secondary-radio-wrapper ${shipWeekOptionSelected ? 'is-selected' : ''}`}>
                      <Checkbox
                        className="checkout__radio"
                        icon={<div className="radio--checked"></div>}
                        label={<div className="checkout__secondary-radio-label"><span>{`Ship week of ${o.shipWeekDisplay}`}</span></div>}
                        name="standard-shipping-option"
                        checked={shipWeekOptionSelected}
                        disabled={disabled || !lineSelected}
                        onChange={() => {
                          if (!shipWeekOptionSelected) {
                            onShipWeekChange(o.shipWeekPreference)
                          } else {
                            onShipWeekChange(null)
                          }
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )

            label = (
              <div>
                <div className="checkout__radio-label">
                  <span>{method.description}</span>
                  <span>{`$${formatPrice(method.amount, true)}`}</span>
                </div>
              </div>
            );
          } else {
            const secondaryLabel = (
              <div className="checkout__secondary-radio-label">
                <span>{method.display}</span>
              </div>
            );

            label = (
              <div>
                <div className="checkout__radio-label">
                  <span>{method.description}</span><span>{`$${formatPrice(method.amount, true)}`}</span>
                </div>
                {secondaryLabel}
              </div>
            );
          }

          return (
            <div key={index}>
              <div className={`checkout__radio-wrapper ${lineSelected ? 'is-selected' : ''}`}>
                <Checkbox
                  className="checkout__radio"
                  icon={<div className="radio--checked"></div>}
                  label={label}
                  name="shipping-method"
                  checked={selectedShippingLineIndex === parseInt(method.id, 10)}
                  disabled={disabled || lineSelected}
                  onChange={() => {
                    if (method.description === 'Ship with Next Order') {
                      onShipWeekChange(method.shipWeekPreference);
                    } else {
                      onShipWeekChange(null);
                    }
                    onChange(index);
                  }}
                />
              </div>
              {extraOptions}
            </div>
          );
        } else {
          return undefined;
        }
      })}
    </div>
  );
};
