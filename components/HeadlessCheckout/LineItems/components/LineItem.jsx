import React from 'react';
import PropTypes from 'prop-types';
// import { Price } from '@boldcommerce/stacks-ui';
import { useTranslation } from 'react-i18next';
import { LineItemProduct } from '../..';
import IconPlus from '@/svgs/plus.svg'
import IconMinus from '@/svgs/minus.svg'
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext';

const LineItem = ({ title, image, quantity, totalPrice, variants, lineItemKey }) => {
  const {
    updateLineItem,
    removeLineItem
  } = useHeadlessCheckoutContext()
  const { t } = useTranslation();

  const increment = () => {
    updateLineItem({
      quantity: quantity + 1,
      line_item_key: lineItemKey
    })
  }

  const decrement = () => {
    if (quantity <= 1) {
      removeLineItem({
        line_item_key: lineItemKey
      })
    } else {
      updateLineItem({
        quantity: quantity - 1,
        line_item_key: lineItemKey
      })
    }
  }

  return (
    <div className="SummaryBlock CartItem">
      <LineItemProduct title={title} image={image} variants={variants} />
      <div className="CartItem__QuantityPriceWrapper">
        <div className="CartItem__ProductQuantityWrapper">
          <button onClick={() => decrement()} className="CartItem__DecrementBtn">
            <IconMinus />
          </button>
          <div className="ProductQuantity" aria-label="product quantity">
            {quantity}
          </div>
          <button onClick={() => increment()} className="CartItem__IncrementBtn">
            <IconPlus />
          </button>
        </div>
        <div className="CartItem__ProductPrice">
          {/* <Price amount={totalPrice} moneyFormatString={t('currency_format')} /> */}
          <p>{totalPrice}</p>
        </div>
      </div>
    </div>
  );
};

LineItem.propTypes = {
  title: PropTypes.string,
  image: PropTypes.string,
  quantity: PropTypes.number,
  lineItemKey: PropTypes.string,
  variants: PropTypes.array
};

export default LineItem;
