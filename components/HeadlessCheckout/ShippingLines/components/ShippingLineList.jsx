import Checkbox from "react-custom-checkbox";
import { formatPrice } from '@/utils/formatPrice';

export const ShippingLineList = ({
  shippingLines,
  selectedShippingLine,
  onChange,
  disabled,
  selectedStandardShipWeek,
  onShipWeekChange,
  shipOptionMetadata
}) => {
  const displayedShippingLines = shippingLines
    .map(line => {
      if (line.description.indexOf('Ship with Next Order') > -1) {
        if (!!shipOptionMetadata.bundled) {
          line.showOption = true;
          line.display = `Shipping between ${shipOptionMetadata.bundled.shipWeekDisplay}`;
          line.shipWeekPreference = shipOptionMetadata.bundled.shipWeekPreference;
        }
        else line.showOption = false;
      } else if (line.description.indexOf('Free Standard Shipping') > -1) {
        line.showOption = true;
        line.options = shipOptionMetadata.standard;
        } else if (line.description.indexOf('Expedited Shipping') > -1) {
        line.showOption = true;
        line.display = `Estimated delivery on ${shipOptionMetadata.expedited.estimatedDeliveryDateDisplay}`;
        }

      return line;
    });

  // Don't select a shipping line that is not visible
  if (!displayedShippingLines.find(line => line.description === selectedShippingLine.description)?.showOption) {
    // Currently defaults to automatically select the first option (which is the lowest price)
    // should only be hiding the bundled ship line, so for now we can just move to the next one
    const selectedLine = displayedShippingLines.find(line => line.showOption);
    onChange(selectedLine, shippingLines);
    selectedShippingLine = selectedLine;
  }

  return (
    <div className="shipping-method-selector">
      {displayedShippingLines && displayedShippingLines.map((method, index) => {
        if (method.showOption) {
          const lineSelected = selectedShippingLine.description === method.description;
          let label;
          let extraOptions;

          if (method.description.indexOf('Free Standard Shipping') > -1) {
            extraOptions = (
              <div className={`secondary-shipping-method-selector ${lineSelected ? 'is-visible' : ''}`}>
                {method.options.map((o, i) => {
                  const shipWeekOptionSelected = selectedStandardShipWeek === o.shipWeekPreference
                  return (
                    // eslint-disable-next-line react/no-unknown-property
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
            // eslint-disable-next-line react/no-unknown-property
            <div key={index}>
              <div className={`checkout__radio-wrapper ${lineSelected ? 'is-selected' : ''}`}>
                <Checkbox
                  className="checkout__radio"
                  icon={<div className="radio--checked"></div>}
                  label={label}
                  name="shipping-method"
                  checked={lineSelected}
                  disabled={disabled || lineSelected}
                  onChange={() => {
                    if (method.description.indexOf('Ship with Next Order') > -1) {
                      onShipWeekChange(method.shipWeekPreference);
                    } else {
                      onShipWeekChange(null);
                    }
                    onChange(method);
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
