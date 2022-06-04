import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useLineItems } from '@boldcommerce/checkout-react-components';
import { LineItem } from './components';
import { useVariants } from '../../hooks';

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

  const lineItemList = lineItems.map((item) => (
    <LineItem
      title={item.product_data.product_title}
      variants={handleVariants(item.product_data.title)}
      image={item.product_data.image_url}
      quantity={item.product_data.quantity}
      price={item.product_data.price}
      totalPrice={item.product_data.total_price}
      key={item.product_data.line_item_key}
    />
  ));

  // console.log(lineItems)
  const explicitTC = lineItems.filter((item) => {return item.product_data.tags.includes("Subscription Box")}).length > 0;
  //console.log("line items",lineItems);

  return (
    <div className="CartItem__List">
      {lineItemList}
      {/* <div class="SummaryBlock CartItem"><div class="stx-details__description">By making this purchase, I agree to these <a href={process.env.TERMS_URL} target="_blank">terms and conditions</a>.</div></div>
      {(explicitTC)&&
        <div>
          <div class="SummaryBlock CartItem"><div class="stx-details__description">I acknowledge that my subscription is continuous until canceled. My credit card will be charged at the payment intervals I have chosen above. I can cancel the subscription anytime by contacting Member Services.</div></div>
        </div>
      } */}
    </div>
  );
});

LineItems.propTypes = {
  lineItems: PropTypes.array,
};

export default LineItems;
