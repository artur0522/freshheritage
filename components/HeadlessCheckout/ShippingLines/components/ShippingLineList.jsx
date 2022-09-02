import Checkbox from "react-custom-checkbox";
import { formatPrice } from '@/utils/formatPrice';
const ShippingLineList = ({
  shippingLines,
  selectedShippingLine,
  onChange,
  disabled
}) => {
  return (
    <div className="shipping-method-selector">
      {shippingLines &&
        shippingLines.map((method, index) => (
          <div className={`checkout__radio-wrapper ${selectedShippingLine === parseInt(method.id, 10) ? 'is-selected' : ''}`} key={index}>
            <Checkbox
              className="checkout__radio"
              icon={<div className="radio--checked"></div>}
              label={<div className="checkout__radio-label"><span>{method.description}</span><span>{`$${formatPrice(method.amount, true)}`}</span></div>}
              name="shipping-method"
              checked={selectedShippingLine === parseInt(method.id, 10)}
              value="SAME_AS_SHIPPING_ADDRESS"
              disabled={disabled || selectedShippingLine === parseInt(method.id, 10)}
              onChange={() => onChange(index)}
            />
          </div>

        ))}
    </div>
  );
};

export default ShippingLineList;
