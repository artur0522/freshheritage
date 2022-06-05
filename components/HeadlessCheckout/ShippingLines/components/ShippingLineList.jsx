// import { RadioField, Price } from '@boldcommerce/stacks-ui';
import React from 'react';
// import { useTranslation } from 'react-i18next';

const ShippingLineList = ({
  shippingLines,
  selectedShippingLine,
  onChange,
  disabled
}) => {
  // const { t } = useTranslation();
  return (
    <div className="FieldSet__Content">
      {shippingLines &&
        shippingLines.map((method, index) => (
          <div className="RadioButton" key={index}>
            <input
              type="radio"
              label={method.description}
              name="shipping-method"
              checked={selectedShippingLine === parseInt(method.id, 10)}
              className="RadioField"
              disabled={disabled}
              onChange={() => onChange(index)}
            />
            {/* <Price className="ShippingMethod__Price" amount={method.amount} moneyFormatString={t('currency_format')} /> */}
            <p>{method.amount}</p>
          </div>
        ))}
    </div>
  );
};

export default ShippingLineList;
