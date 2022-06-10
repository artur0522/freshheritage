import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useLineItems } from '@boldcommerce/checkout-react-components';
import { LineItemProduct } from '../';
import { useVariants } from '@/hooks/index.js';

const LineItems = () => {
  const { data: lineItems } = useLineItems();
  return (
    <MemoizedLineItems
      lineItems={lineItems}
    />
  );
};

const MemoizedLineItems = memo(({
  lineItems
}) => {
  const handleVariants = useVariants();

  // console.log(lineItems)
  const explicitTC = lineItems.filter((item) => {return item.product_data.tags.includes("Subscription Box")}).length > 0;
  //console.log("line items",lineItems);

  return (
    <div className="order-item-list">
      {lineItems.map(item => (
        <div className="order-item checkout__row">
          <LineItemProduct
            title={item.product_data.product_title}
            variants={handleVariants(item.product_data.title)}
            image={item.product_data.image_url}
            quantity={item.product_data.quantity}
            price={item.product_data.price}
            totalPrice={item.product_data.total_price}
            key={item.product_data.line_item_key}
            lineItemKey={item.product_data.line_item_key} />
            {item.product_data.tags.includes("Subscription Box") &&
              <div className="order-item__disclaimer">
                <h3>Membership Info</h3>
                <p>I acknowledge that my subscription is continuous until canceled. My credit card will be charged at the payment intervals I have chosen above. I can manage my subscription preferences or cancel the subscription anytime in my user portal.</p>
                <p>By making this purchase, <a href={process.env.TERMS_URL} target="_blank">I agree to these terms and conditions</a>.</p>
              </div>
            }
        </div>
      ))}
    </div>
  );
});

LineItems.propTypes = {
  lineItems: PropTypes.array,
};

export default LineItems;
