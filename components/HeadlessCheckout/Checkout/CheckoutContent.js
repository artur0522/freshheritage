import { useRouter } from 'next/router'
import { StateBasedCheckout } from './StateBasedCheckout'
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext'
import LoadingState from '@/components/LoadingState';

const CheckoutContent = ({data}) => {
  const router = useRouter()
  const { setFlyoutState, isLoading, setIsLoading, initializeCheckout } = useHeadlessCheckoutContext()

  if (isLoading) {
    return <div className="checkout__loading-state" role="main">
      <LoadingState />
    </div>
  }

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
                setIsLoading(true)
                await initializeCheckout()
              }
              setIsLoading(false)
              setFlyoutState(false)
            }}
            className="checkout__continue-shopping-btn btn sitkablue">Continue Shopping</button>
      </header>
    )
  }
};

export default CheckoutContent;