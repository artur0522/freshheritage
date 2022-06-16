import Link from 'next/link';
import { StateBasedCheckout } from '../Checkout/StateBasedCheckout';

const Checkout = ({data}) => {

  if (data?.application_state?.line_items.length > 0) {
    return (
      <>
        <header className="checkout__header-main">
          <h4>Checkout</h4>
        </header>
        <StateBasedCheckout data={data} />
      </>
    )
  } else {
    return (
      <header className="checkout__header-main checkout__header-main--empty-cart">
        <h4>Your Cart Is Empty</h4>
        <Link href="/">
          <a className="checkout__continue-shopping-btn btn sitkablue">Continue Shopping</a>
        </Link>
      </header>
    )
  }
};

export default Checkout;