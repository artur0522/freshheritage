const ErrorPage = ({ backToStarStep }) => {
  return (
    <div className="checkout__error">
      {/* <LoadingSpinner /> */}
      <h3>Oh no, something went wrong!</h3>
      <p className="secondary--body">Please try again by clicking <button onClick={() => backToStarStep()} className="btn-link-underline">here</button> or email salmonsupport@sitkasalmonshares.com for assistance</p>
    </div>
  );
};

export default ErrorPage;
