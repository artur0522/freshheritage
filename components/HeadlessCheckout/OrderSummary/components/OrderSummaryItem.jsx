// import Price from '@boldcommerce/stacks-ui/lib/components/price/Price';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '@/utils/formatPrice';

const OrderSummaryItem = ({ title, amount, lines }) => {
  const { t } = useTranslation();
  return (
    <div
      className={classNames(
        'order-summary__item',
        lines ? 'order-summary__item--removable' : ''
      )}
    >
      <span className="order-summary__item-title">{title}</span>
      {lines
        ? lines
        : (amount > 0 ? (
            <span className="order-summary__item-amount">${formatPrice(amount, true)}</span>
          ):(
            <div>-</div>
          )
      )}
    </div>
  );
};

OrderSummaryItem.propTypes = {
  title: PropTypes.string,
  amount: PropTypes.number,
  lines: PropTypes.node
};

export default OrderSummaryItem;
