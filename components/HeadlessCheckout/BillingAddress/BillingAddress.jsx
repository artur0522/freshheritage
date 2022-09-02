import { useBillingAddress, useBillingSameAsShipping, useCountryInfo } from '@boldcommerce/checkout-react-components';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { BillingSameAsShipping } from './components';
import { Address } from '../Address';
import { useAnalytics, useErrorLogging } from '@/hooks/index.js';
import { useTranslation } from 'react-i18next';
import IconSelectArrow from '@/svgs/select-arrow.svg'

const BillingAddress = ({ applicationLoading }) => {
  const { data, submitBillingAddress } = useBillingAddress();
  const { data: sameAsShipping, setBillingSameAsShipping } = useBillingSameAsShipping();

  return (
    <MemoizedBillingAddress
      billingAddress={data}
      billingSameAsShipping={sameAsShipping}
      submitAddress={submitBillingAddress}
      setBillingSameAsShipping={setBillingSameAsShipping}
      applicationLoading={applicationLoading}
    />
  );
};

const MemoizedBillingAddress = memo(({
  billingAddress,
  billingSameAsShipping,
  submitAddress,
  setBillingSameAsShipping,
  applicationLoading,
}) => {
  const trackEvent = useAnalytics();
  const logError = useErrorLogging();
  const [address, setAddress] = useState({'country_code': 'US'});
  const { data } = useCountryInfo(address);
  const {
    countries,
    provinces,
    showProvince,
    showPostalCode,
    provinceLabel,
  } = data;
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(billingSameAsShipping);
  const [addressOpen, setAddressOpen] = useState(true);
  const { t } = useTranslation();

  let provincePlaceholder = provinceLabel;

  useEffect(() => {
    setAddress(Array.isArray(billingAddress) ? {'country_code': 'US'} : billingAddress);
  }, [billingAddress])

  const updateBillingAddress = useCallback(async (currentAddress) => {
    setAddress(currentAddress);
    try {
      await submitAddress(currentAddress);
      setErrors(null);
      trackEvent('set_billing_address');
    } catch(e) {
      setErrors(e.body.errors);
      logError('billing_address', e);

      // If there is a server error, reset billing address
      if (e.body.errors[0].field === 'order') {
        setAddress(billingAddress);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingAddress]);

  const updateBillingSameAsShipping = useCallback(async (value) => {
    setLoading(true);
    setSameAsShipping(value);
    try {
      await setBillingSameAsShipping(value);
      setErrors(null);
      trackEvent('set_billing_address');
    } catch(e) {
      setErrors(e.body.errors);
      logError('billing_address', e);

      // If there is a server error, reset billing same as shipping
      if (e.body.errors[0].field === 'order') {
        setSameAsShipping(billingSameAsShipping);
      }
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingSameAsShipping]);

  const handleChange = useCallback((data) => {
    setAddress({
      ...address,
      ...data
    });
  }, [address]);

  return (
    <div className="order-address">
      <div className={`checkout__header checkout__header--border-on-closed checkout__row ${addressOpen ? 'checkout__header--open' : 'checkout__header--closed'}`}>
        <h3>Billing Address</h3>
      </div>
      {!!addressOpen &&
        <>
          <BillingSameAsShipping
            billingSameAsShipping={sameAsShipping}
            setBillingSameAsShipping={updateBillingSameAsShipping}
            disabled={loading || applicationLoading}
          />
          { !billingSameAsShipping && (
            <Address
              address={address}
              onChange={handleChange}
              errors={errors}
              countries={countries}
              provinces={provinces}
              showPostalCode={showPostalCode}
              showProvince={true}
              provinceLabel={provincePlaceholder}
              submit={() => updateBillingAddress(address)}
            />
          )}
        </>
      }
    </div>
  );
});

export default BillingAddress;
