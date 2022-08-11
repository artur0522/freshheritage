import Checkbox from "react-custom-checkbox";
import { formatPrice } from '@/utils/formatPrice';
const ShippingLineList = ({
  shippingLines,
  selectedShippingLine,
  onChange,
  disabled,
  selectedStandardShipWeek,
  onStandardShipWeekChange
}) => {
  return (
    <div className="shipping-method-selector">
      {shippingLines && shippingLines.map((method, index) => {
        if (method.showOption) {
          let label;

          if (method.description === 'Standard') {
            label = (
              <div>
                <div className="checkout__radio-label">
                  <span>{method.description}</span>
                  <span>{`$${formatPrice(method.amount, true)}`}</span>
                </div>
                <div className="checkout__radio-label">
                  {method.options.map((o, i) => {
                      return (
                          <Checkbox
                            key={i}
                            class="checkout__radio"
                            icon={<div className="radio--checked"></div>}
                            label={o.estimatedDeliveryDate}
                            name="standard-shipping-option"
                            checked={selectedStandardShipWeek === o.shipWeekPreference}
                            disabled={disabled || selectedStandardShipWeek === o.shipWeekPreference}
                            onChange={() => onStandardShipWeekChange(o.shipWeekPreference)}
                          />
                      );
                    })
                  }
                </div>
              </div>
            );
          } else {
            label = (
              <div className="checkout__radio-label">
                <span>{method.description}</span><span>{method.estimatedDeliveryDate}</span><span>{`$${formatPrice(method.amount, true)}`}</span>
              </div>
            );
          }

          return (<div className={`checkout__radio-wrapper ${selectedShippingLine === parseInt(method.id, 10) ? 'is-selected' : ''}`} key={index}>
            <Checkbox
              className="checkout__radio"
              icon={<div className="radio--checked"></div>}
              label={label}
              name="shipping-method"
              checked={selectedShippingLine === parseInt(method.id, 10)}
              disabled={disabled || selectedShippingLine === parseInt(method.id, 10)}
              onChange={() => onChange(index)}
            />
          </div>);
        } else {
          return undefined;
        }
      })}
    </div>
  );
};

export default ShippingLineList;
