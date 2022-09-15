import React from 'react';
import PropTypes from 'prop-types';
import { useLineItems } from '@boldcommerce/checkout-react-components';
import { LineItemProduct } from '../';

const LineItems = ({readOnly}) => {
  const { data: lineItems } = useLineItems();

  return (
    <div className="order-item-list">
      {lineItems.map(item => (
          <LineItemProduct readOnly={readOnly} item={item.product_data} key={item.product_data.line_item_key}>
            {item.product_data.tags.includes("Subscription Box") && !readOnly &&
              <div className="order-item__disclaimer">
                <h3>Membership Info</h3>
                {item.product_data.properties.is_gift_order !== 'true' && <p>I acknowledge that my subscription is continuous until canceled. My credit card will be charged at the payment intervals I have chosen above. I can manage my subscription preferences or cancel the subscription anytime in my user portal.</p>}
                <p>By making this purchase, I agree to these <a href={process.env.NEXT_PUBLIC_TERMS_URL} target="_blank" rel="noreferrer">terms and conditions</a>.</p>
              </div>
            }
          </LineItemProduct>
      ))}
    </div>
  )
};

LineItems.propTypes = {
  lineItems: PropTypes.array,
};

export default LineItems;
