import React, { memo, useCallback, useEffect, useState } from 'react';
import { useCountryInfo, useLoadingStatus, useSavedAddresses, useShippingAddress } from '@boldcommerce/checkout-react-components';
import { Address } from '@/components/HeadlessCheckout/Address';
import { SavedAddressList } from './components';
import { useAnalytics, useErrorLogging } from '@/hooks/index.js';
import { useTranslation } from 'react-i18next';
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext';

const ShippingAddress = ({ applicationLoading }) => {

  const requiredAddressFields = ['first_name', 'last_name', 'address_line_1', 'city'];
  const { data: shippingAddress, submitShippingAddress } = useShippingAddress(requiredAddressFields);
  const { data: savedAddresses } = useSavedAddresses();
  const { data: loadingStatus } = useLoadingStatus();
  const setting = loadingStatus.shippingAddress === 'setting';

  return (
    <MemoizedShippingAddress
      shippingAddress={shippingAddress}
      submitAddress={submitShippingAddress}
      savedAddresses={savedAddresses}
      setting={setting}
      applicationLoading={applicationLoading}
      requiredAddressFields={requiredAddressFields}
    />
  );
};

const MemoizedShippingAddress = memo(({
  shippingAddress,
  submitAddress,
  savedAddresses,
  setting,
  applicationLoading,
  requiredAddressFields,
}) => {
  const [loading, setLoading] = useState(false);
  const trackEvent = useAnalytics();
  const logError = useErrorLogging();
  const [address, setAddress] = useState(Array.isArray(shippingAddress) ? {'country_code': 'US'} : shippingAddress);
  const { data } = useCountryInfo(address);
  const [addressOpen, setAddressOpen] = useState(true);
  const {
    countries,
    provinces,
    showProvince,
    showPostalCode,
    provinceLabel,
  } = data;
  const [errors, setErrors] = useState(null);
  const { t } = useTranslation();
  const { refreshShipOptionData } = useHeadlessCheckoutContext();

  let provincePlaceholder = provinceLabel;

  useEffect(() => {
    setAddress(Array.isArray(shippingAddress) ? {'country_code': 'US'} : shippingAddress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSelectedShippingAddress = useCallback(async (currentAddress) => {

    if (currentAddress && currentAddress.city && currentAddress.address_line_1) {
      currentAddress.country_code = 'US'
    }

    setAddress(currentAddress);
    setLoading(true);
    try {
      await submitAddress(currentAddress);
      await refreshShipOptionData(currentAddress.postal_code);
      trackEvent('set_shipping_address');
      setErrors(null);
    } catch(e) {
      logError('shipping_address', e);
      setErrors(e.body.errors);
      // If there is a server error, reset shipping address
      if (e.body.errors[0].field === 'order') {
        setAddress(shippingAddress);
      }
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippingAddress]);

  return (
    <div className="order-address">
      <div className={`checkout__header checkout__header--border-on-closed checkout__row ${addressOpen ? 'checkout__header--open' : 'checkout__header--closed'}`}>
        <h3>{t('shipping.address')}</h3>
      </div>
      <SavedAddressList
        savedAddresses={savedAddresses}
        selectedAddress={applicationLoading ? savedAddresses[0].id : address?.id}
        onChange={updateSelectedShippingAddress}
        disabled={loading || applicationLoading || setting}
      />
      { addressOpen && !applicationLoading && (address?.id === undefined || address?.id === null) && (
        <Address
          className={(savedAddresses && savedAddresses.length > 0) ? 'FieldSet--AddressNew' : ''}
          address={address}
          onChange={(data) => {
            setAddress((prevAddress) => ({
            ...prevAddress,
            ...data,
          }
          ))}}
          errors={errors}
          countries={countries}
          provinces={provinces}
          showPostalCode={showPostalCode}
          showProvince={true}
          provinceLabel={provincePlaceholder}
          submit={() => updateSelectedShippingAddress(address)}
          requiredAddressFields={requiredAddressFields}
        />
      )}
    </div>
  );
});

export default ShippingAddress