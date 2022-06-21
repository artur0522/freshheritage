import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LineItems } from '../LineItems';
import { DiscountForm } from '../DiscountForm';
import { OrderSummaryBreakdown } from '.';
import IconSelectArrow from '@/svgs/select-arrow.svg'

const OrderSummary = ({ readOnly }) => {
  const [summaryOpen, setSummaryOpen] = useState(true);
  return (
    <div className="order-summary">
      <div className={`checkout__header checkout__row ${summaryOpen ? 'checkout__header--open' : 'checkout__header--closed'}`}>
        <h3>Order Summary</h3>
        <button onClick={() => setSummaryOpen(!summaryOpen)} className="checkout__header-toggle-btn">
          <IconSelectArrow />
        </button>
      </div>
      {!!summaryOpen &&
        <LineItems readOnly={readOnly} />
      }
      {!readOnly && <DiscountForm /> }
      <OrderSummaryBreakdown />
    </div>
  );
};

OrderSummary.propTypes = {
  readOnly: PropTypes.bool,
};

export default OrderSummary;
