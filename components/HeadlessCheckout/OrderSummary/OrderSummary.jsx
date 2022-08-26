import React, { useState } from 'react';
import { useBreakdown } from '@boldcommerce/checkout-react-components';
import PropTypes from 'prop-types';
import { LineItems } from '../LineItems';
import { DiscountForm } from '../DiscountForm';
import { OrderSummaryBreakdown } from '.';
import IconSelectArrow from '@/svgs/select-arrow.svg'
import { formatPrice } from '@/utils/formatPrice';

const OrderSummary = ({ readOnly }) => {
  const [summaryOpen, setSummaryOpen] = useState(true);
  const { data } = useBreakdown();
  const { subTotal } = data;
  return (
    <div className="order-summary">
      <div className={`checkout__header checkout__row ${summaryOpen ? 'checkout__header--open' : 'checkout__header--closed'}`}>
        <div className="checkout__header-wrap">
          <h3>Order Summary</h3>
          <span className="checkout__header-subtotal hide-on-desktop">${formatPrice(subTotal)}</span>
        </div>
        <button onClick={() => setSummaryOpen(!summaryOpen)} className="checkout__header-toggle-btn">
          <IconSelectArrow />
        </button>
      </div>
      {!!summaryOpen &&
        <LineItems readOnly={readOnly} />
      }
      {!readOnly && <DiscountForm /> }
      <OrderSummaryBreakdown readOnly={readOnly} />
    </div>
  );
};

OrderSummary.propTypes = {
  readOnly: PropTypes.bool,
};

export default OrderSummary;
