
import Checkbox from "react-custom-checkbox";
const BillingSameAsShipping = ({
  billingSameAsShipping,
  setBillingSameAsShipping,
  disabled
}) => {
  return (
    <div className="checkout__radio-list billing-address-selector">
      <div className={`checkout__radio-wrapper ${billingSameAsShipping ? 'is-selected' : ''}`}>
        <Checkbox
          className="checkout__radio"
          icon={<div className="radio--checked"></div>}
          label={'Same as shipping address'}
          checked={billingSameAsShipping}
          value="SAME_AS_SHIPPING_ADDRESS"
          disabled={disabled || billingSameAsShipping}
          onChange={() => setBillingSameAsShipping(true)}
        />
      </div>
      <div className={`checkout__radio-wrapper ${!billingSameAsShipping ? 'is-selected' : ''}`}>
        <Checkbox
          className="checkout__radio"
          icon={<div className="radio--checked"></div>}
          label={'Use a different billing address'}
          checked={!billingSameAsShipping}
          value="DIFFERENT_BILLING_ADDRESS"
          disabled={disabled || !billingSameAsShipping}
          onChange={() => setBillingSameAsShipping(false)}
        />
      </div>
    </div>
  );
};

export default BillingSameAsShipping;
