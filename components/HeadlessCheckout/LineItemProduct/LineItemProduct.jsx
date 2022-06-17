import React from 'react';
import ResponsiveImage from '@/components/ResponsiveImage';
import IconPlus from '@/svgs/plus.svg'
import IconMinus from '@/svgs/minus.svg'
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext';
import { useVariants } from '@/hooks/index.js';
import { formatPrice } from '@/utils/formatPrice';
import Link from 'next/link';

const LineItemProduct = ({ item, children, readOnly }) => {

  const handleVariants = useVariants();
  const variants = handleVariants(item.title)

  const {
    updateLineItem,
    removeLineItem
  } = useHeadlessCheckoutContext()

  const increment = () => {
    updateLineItem({
      quantity: item.quantity + 1,
      line_item_key: item.line_item_key
    })
  }

  const decrement = () => {
    if (item.quantity <= 1) {
      removeLineItem({
        line_item_key: item.line_item_key
      })
    } else {
      updateLineItem({
        quantity: item.quantity - 1,
        line_item_key: item.line_item_key
      })
    }
  }

  return (
    <div className="order-item checkout__row">
      <div className="order-item__main">
        <div className="order-item__image">
          <ResponsiveImage src={item.image_url} alt={item.product_title} />
        </div>

        <div className="order-item__details">
          <div className="order-item__detail-item">
            <h3 className="order-item__title">{item.product_title}</h3>
            <div className="order-item__price">
              <span className="price">${formatPrice(item.total_price)}</span>
              {item.tags.includes('Subscription Box') &&
                <span className="price-per-unit">{` ($${formatPrice(item.price)}/box)`}</span>
              }
            </div>
          </div>

          <div className="order-item__detail-item">
            <div className="order-item__preference">{item.properties.preference}</div>
            {item.tags.includes('Subscription Box') &&
              <div className="order-item__weight">
                <span className="weight-per-unit">4.5lbs / box</span>
              </div>
            }
          </div>

          <div className="order-item__detail-item">
            {readOnly ? (
              <div className="order-item__quantity-wrapper order-item__quantity-wrapper--quantity-only">
                <div className="order-item__quantity" aria-label="product quantity">
                  {item.quantity}
                </div>
              </div>
            ):(
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
            )}
            {item.properties.membership_type &&
              <ul className="order-item__delivery hide-on-mobile">
                {item.properties.membership_type === 'prepaid' &&
                  <li>{item.properties.shipments} {item.properties.shipments === 1 ? 'delivery' : 'deliveries'} prepaid</li>
                }
                {item.properties.membership_type === 'regular' &&
                  <li>{item.properties.shipments} {item.properties.shipments === 1 ? 'box' : 'boxes'}</li>
                }
                <li>Ships {item.properties.frequency}</li>
              </ul>
            }
          </div>
       </div>
      </div>

      {item.tags.includes("Subscription Box") &&
        <div className="order-item__mobile">
          <div className="checkout__row">
            <div className="order-item__details">
              <div className="order-item__detail-item">
                <div>Delivery Schedule</div>
                <div>Ships {item.properties.frequency}</div>
              </div>
            </div>
          </div>
          <div className="checkout__row">
            <div className="order-item__details">
              {item.properties.membership_type === 'prepaid' &&
                <div className="order-item__detail-item">
                  <div>Payment Plan</div>
                  <div>{item.properties.shipments} {item.properties.shipments === 1 ? 'delivery' : 'deliveries'} prepaid</div>
                </div>
              }
              {item.properties.membership_type === 'regular' &&
                <div className="order-item__detail-item">
                  <div>Shipments</div>
                  <div>{item.properties.shipments} {item.properties.shipments === 1 ? 'box' : 'boxes'}</div>
                </div>
              }
            </div>
          </div>
        </div>
      }
      {children}
    </div>
  )
};

export default LineItemProduct;
