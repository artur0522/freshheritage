import React from 'react';
import PropTypes from 'prop-types';
import ResponsiveImage from '@/components/ResponsiveImage';
import IconPlus from '@/svgs/plus.svg'
import IconMinus from '@/svgs/minus.svg'
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext';
import Link from 'next/link';

const LineItemProduct = ({ title, image, variants, quantity, totalPrice, price, lineItemKey }) => {

  const {
    updateLineItem,
    removeLineItem
  } = useHeadlessCheckoutContext()

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
    <>
      <div className="order-item__image">
        <ResponsiveImage src={image} alt={title} />
      </div>
      <div className="order-item__details">
        <div className="order-item__title-quantity">
          <h3 className="order-item__title">{title}</h3>
          <div className="order-item__description">
            {variants.map((variant, i) => {
              return <div key={i}>{variant}</div>;
            })}
          </div>
          <div className="order-item__quantity-wrapper">
            <button onClick={() => decrement()} className="order-item__decrement-btn">
              <IconMinus />
            </button>
            <div className="order-item__quantity" aria-label="product quantity">
              {quantity}
            </div>
            <button onClick={() => increment()} className="order-item__increment-btn">
              <IconPlus />
            </button>
          </div>
        </div>
        <div className="order-item__price-delivery">
          {/* <Price amount={totalPrice} moneyFormatString={t('currency_format')} /> */}
          <p>{totalPrice}</p>
        </div>
      </div>
    </>
  )
};

LineItemProduct.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
  variants: PropTypes.array
};

export default LineItemProduct;
