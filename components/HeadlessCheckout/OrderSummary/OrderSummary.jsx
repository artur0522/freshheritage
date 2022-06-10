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
      <div onClick={() => setSummaryOpen(!summaryOpen)} className={`order-summary__header checkout__row ${summaryOpen ? 'order-summary__header--open' : 'order-summary__header--closed'}`}>
        <h3>Order Summary</h3>
        <IconSelectArrow />
      </div>
      {!!summaryOpen &&
        <>
          <LineItems readOnly={readOnly} />
          {!readOnly && <DiscountForm /> }
          <OrderSummaryBreakdown />
        </>
      }
    </div>
  );
};

OrderSummary.propTypes = {
  readOnly: PropTypes.bool,
};

export default OrderSummary;
