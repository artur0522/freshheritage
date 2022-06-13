import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useLineItems } from '@boldcommerce/checkout-react-components';
import { LineItemProduct } from '../';

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
  return (
    <div className="order-item-list">
      {lineItems.map(item => (
          <LineItemProduct item={item.product_data} key={item.product_data.line_item_key} >
            {item.product_data.tags.includes("Subscription Box") &&
              <div className="order-item__disclaimer">
                <h3>Membership Info</h3>
                <p>I acknowledge that my subscription is continuous until canceled. My credit card will be charged at the payment intervals I have chosen above. I can manage my subscription preferences or cancel the subscription anytime in my user portal.</p>
                <p>By making this purchase, <a href={process.env.TERMS_URL} target="_blank">I agree to these terms and conditions</a>.</p>
              </div>
            }
          </LineItemProduct>
      ))}
    </div>
  );
});

LineItems.propTypes = {
  lineItems: PropTypes.array,
};

export default LineItems;
