import React from 'react';
import PropTypes from 'prop-types';
import ResponsiveImage from '@/components/ResponsiveImage';
import IconPlus from '@/svgs/plus.svg'
import IconMinus from '@/svgs/minus.svg'
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext';
import { useVariants } from '@/hooks/index.js';
import { formatPrice } from '@/utils/formatPrice';
import Link from 'next/link';

const LineItemProduct = ({ item }) => {

  const handleVariants = useVariants();
  const variants = handleVariants(item.title)

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
        <ResponsiveImage src={item.image_url} alt={item.product_title} />
      </div>
      <div className="order-item__details">
        <div className="order-item__title-quantity">
          <h3 className="order-item__title">{item.product_title}</h3>
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
              {item.quantity}
            </div>
            <button onClick={() => increment()} className="order-item__increment-btn">
              <IconPlus />
            </button>
          </div>
        </div>
        <div className="order-item__price-delivery">
          {/* 3 types of prices to render subscriptions (prepaid & monthly) vs one-time */}
          <div className="order-item__price">
            <span className="price">${formatPrice(item.total_price)}</span>
            {item.tags.includes('Subscription Box') &&
              <span className="price-per-unit">{`($${formatPrice(item.price)}/box)`}</span>
            }
          </div>
          {item.tags.includes('Subscription Box') &&
            <div className="order-item__weight">
             <span className="weight-per-unit">4.5lbs / box</span>
            </div>
          }
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
