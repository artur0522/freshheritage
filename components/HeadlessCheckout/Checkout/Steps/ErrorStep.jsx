import { useEffect } from 'react'
import { useErrors } from '@boldcommerce/checkout-react-components';

const ErrorPage = ({ backToStarStep }) => {
  const { data } = useErrors();
  useEffect(() => {
    if (window) window.scrollTo(0,0)
  }, [])
  return (
    <div className="checkout__error">
      {/* <LoadingSpinner /> */}
      {data.order && data.order.length > 0 ? (
        <h3>{data.order[0].message}</h3>
      ):(
        <h3>Oh no, something went wrong!</h3>
      )}
      <p className="secondary--body">Please try again by clicking <button onClick={() => backToStarStep()} className="btn-link-underline">here</button> or email salmonsupport@sitkasalmonshares.com for assistance</p>
    </div>
  );
};

export default ErrorPage;
