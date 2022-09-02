import React from 'react';
import ResponsiveImage from '@/components/ResponsiveImage';
import IconPlus from '@/svgs/plus.svg'
import IconMinus from '@/svgs/minus.svg'
import IconTrashCan from '@/svgs/trash-can.svg'
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext';
import { useVariants } from '@/hooks/index.js';
import { formatPrice } from '@/utils/formatPrice';
import Link from 'next/link';

const LineItemProduct = ({ item, children, readOnly }) => {

  const handleVariants = useVariants();
  const variants = handleVariants(item.title)

  let url = `/products/${item.properties.product_handle}`
  const isSubscription = item.tags.includes("Subscription Box")
  const isGiftCard = item.properties.product_handle === 'digital-gift-card'

  if (item.properties.membership_type && isSubscription) {
    url = `/products/gift-subscription-box`
  }

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

  const buildQtySelector = (item) => {
    if (readOnly) {
      return <div className="order-item__quantity-wrapper order-item__quantity-wrapper--quantity-only">
        <div className="order-item__quantity" aria-label="product quantity">
          {item.quantity}
        </div>
      </div>
    }

    return <div className="order-item__quantity-wrapper">
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
  }

  // console.log("item:", item)

  return (
    <div className="order-item checkout__row">
      <div className="order-item__main">
        <div className="order-item__image">
        <Link href={url}>
            <a>
              <ResponsiveImage src={item.image_url} alt={item.product_title} />
            </a>
          </Link>
        </div>

        <div className="order-item__details">
          <div className="order-item__detail-item">
            <Link href={url}>
              <a className="order-item__title-link">
                <h3 className="order-item__title">{item.product_title}</h3>
              </a>
            </Link>
            <div className="order-item__price">
              <span className="price">${formatPrice(item.price)}</span>
              {item.tags.includes('Subscription Box') &&
                <>
                  {item.properties.membership_type === 'prepaid' ?
                    <span className="price-per-unit">{` ($${formatPrice(item.price / item.properties.shipments)}/box)`}</span>
                  :
                    <span className="price-per-unit">{` ($${formatPrice(item.price)}/box)`}</span>
                  }
                </>
              }
            </div>
          </div>

          {isGiftCard ? (
            <div>
              <button onClick={() => removeLineItem({line_item_key: item.line_item_key})} className="order-item__remove-btn">
                <IconTrashCan />
              </button>
            </div>
          ):(
            <div className="order-item__detail-item">
              {item.properties.preference ? (
                <div className="order-item__preference">{item.properties.preference}</div>
              ):(!isSubscription ? (
                buildQtySelector(item)
              ):(
                <div></div>
              ))}
              {item.properties.product_weight && item.properties.product_weight != '' &&
                <div className="order-item__weight">
                  <span className="weight-per-unit">4.5lbs {isSubscription && <>/ box </>}</span>
                </div>
              }
            </div>
          )}

          {isSubscription && !isGiftCard &&
            <div className="order-item__detail-item">
              <button onClick={() => removeLineItem({line_item_key: item.line_item_key})} className="order-item__remove-btn">
                <IconTrashCan />
              </button>
              {item.properties.membership_type &&
                <ul className="order-item__delivery hide-on-mobile">
                  {item.properties.membership_type === 'prepaid' && item.properties.shipments &&
                    <li>{item.properties.shipments} {item.properties.shipments === 1 ? 'delivery' : 'deliveries'} prepaid</li>
                  }
                  {item.properties.membership_type === 'regular' && item.properties.shipments &&
                    <li>{item.properties.shipments} {item.properties.shipments === 1 ? 'box' : 'boxes'}</li>
                  }
                  <li>Ships {item.properties.interval_text}</li>
                </ul>
              }
            </div>
          }

          {!isGiftCard &&
            <div className="order-item__detail-item">
              { isSubscription ? (
                <div></div>
              ):(item.properties.preference ? (
                buildQtySelector(item)
              ):(
                <button onClick={() => removeLineItem({line_item_key: item.line_item_key})} className="order-item__remove-btn">
                  <IconTrashCan />
                </button>
              ))}
            </div>
          }
       </div>
      </div>

      {isGiftCard && item.properties.recipient_email &&
        <div className="order-item__gift-details">
          <div className="checkout__row">
            <div className="order-item__details">
              <div className="order-item__detail-item">
                <div>Delivering to</div>
                <div>
                  <div>{item.properties.recipient_name}</div>
                  <div>{item.properties.recipient_email}</div>
                </div>
              </div>
            </div>
          </div>
          {item.properties.gift_message &&
            <div className="checkout__row">
              <div className="order-item__details">
                <div className="order-item__detail-item">
                  <div>Message</div>
                  <div>{item.properties.gift_message}</div>
                </div>
              </div>
            </div>
          }
        </div>
      }

      {isSubscription &&
        <div className="order-item__mobile">
          <div className="checkout__row">
            <div className="order-item__details">
              <div className="order-item__detail-item">
                <div>Delivery Schedule</div>
                <div>Ships {item.properties.interval_text}</div>
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
