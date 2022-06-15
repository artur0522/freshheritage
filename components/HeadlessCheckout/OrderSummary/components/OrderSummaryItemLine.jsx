import React from 'react';
import { RemoveIcon } from '../../Icons';
import { formatPrice } from '@/utils/formatPrice';

const OrderSummaryItemLine = ({ description, amount, onRemove }) => {
  return (
    <div className="order-summary-item__description">
      {onRemove && (
        <button
          className="order-summary-item__action"
          type="button"
          onClick={onRemove}
        >
          <RemoveIcon />
        </button>
      )}
      <span className="order-summary-item__label">{description}</span>
      <span className="order-summary-item__amount">
        <p>${formatPrice(amount, true)}</p>
      </span>
    </div>
  );
};

export default OrderSummaryItemLine;
