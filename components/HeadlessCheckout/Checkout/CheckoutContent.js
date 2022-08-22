import { useRouter } from 'next/router'
import { StateBasedCheckout } from './StateBasedCheckout'
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext'

const CheckoutContent = ({data}) => {
  const router = useRouter()
  const { setFlyoutState, initializeCheckout } = useHeadlessCheckoutContext()

  if (data?.application_state?.line_items.length > 0) {
    return <StateBasedCheckout data={data} />
  } else {
    return (
      <header className="checkout__header-main checkout__header-main--empty-cart">
        <h4>Your Cart Is Empty</h4>
          <button
            onClick={async() => {
              if (router.pathname === '/checkout') {
                router.push('/')
                return
              }
              const localStorageCheckoutData = JSON.parse(localStorage.getItem('checkout_data'));
              if (!localStorageCheckoutData) {
                await initializeCheckout()
              }

              setFlyoutState(false)
            }}
            className="checkout__continue-shopping-btn btn sitkablue">Continue Shopping</button>
      </header>
    )
  }
};

export default CheckoutContent;