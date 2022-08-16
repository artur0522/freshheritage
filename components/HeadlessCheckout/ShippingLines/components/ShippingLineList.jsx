import Checkbox from "react-custom-checkbox";
import { formatPrice } from '@/utils/formatPrice';
import { useEffect } from "react";
const ShippingLineList = ({
  shippingLines,
  selectedShippingLine,
  onChange,
  disabled,
  selectedStandardShipWeek,
  onShipWeekChange
}) => {
  return (
    <div className="shipping-method-selector">
      {shippingLines && shippingLines.map((method, index) => {
        if (method.showOption) {
          const lineSelected = selectedShippingLine === parseInt(method.id, 10);
          let label;
          let extraOptions;
          let href;

          if (method.description === 'Standard') {
            
            extraOptions = (
              <div id='standard-ship-options' className={`secondary-shipping-method-selector ${lineSelected ? 'is-visible' : ''}`}>
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
                            onShipWeekChange(undefined)
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

            href = '#standard-ship-options';
          } else {
            label = (
              <div>
                <div className="checkout__radio-label">
                  <span>{method.description}</span><span>{`$${formatPrice(method.amount, true)}`}</span>
                </div>
                <div className="checkout__secondary-radio-label">
                  <span>{method.display}</span>
                </div>
              </div>
            );
          }

          return (
            <div key={index}>
              <div className={`checkout__radio-wrapper ${lineSelected ? 'is-selected' : ''}`} href={href}>
                <Checkbox
                  className="checkout__radio"
                  icon={<div className="radio--checked"></div>}
                  label={label}
                  name="shipping-method"
                  checked={selectedShippingLine === parseInt(method.id, 10)}
                  disabled={disabled || lineSelected}
                  onChange={() => {
                    if (method.description === 'Bundle with Next Order') {
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

export default ShippingLineList;
