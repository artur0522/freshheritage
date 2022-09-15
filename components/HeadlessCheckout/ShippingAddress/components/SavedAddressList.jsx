import React, { useCallback, useEffect, useMemo, useState } from 'react';
import SavedAddress from './SavedAddress';
import { useTranslation } from 'react-i18next';
import Checkbox from "react-custom-checkbox";

const SavedAddressList = ({
  savedAddresses,
  selectedAddress,
  disabled,
  onChange
}) => {
  const [prevAddress, setPrevAddress] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (selectedAddress) {
      setPrevAddress(selectedAddress);
    }
  }, [selectedAddress]);

  const lastSelectedAddress = useMemo(() => {
    if (prevAddress) {
      return savedAddresses.find((address) => address.id === prevAddress);
    } else {
      return savedAddresses ? savedAddresses[0] : {};
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevAddress]);

  const handleNewAddressChange = useCallback(() => {
    onChange({
      ...lastSelectedAddress,
      id: null
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastSelectedAddress]);

  if (!savedAddresses || savedAddresses.length === 0) return null;

  const savedAddressList = savedAddresses.map((method, index) => {
    return (
      <div key={index} className={`checkout__radio-wrapper ${selectedAddress === method.id ? 'is-selected' : ''}`}>
        <Checkbox
          className="checkout__radio"
          icon={<div className="radio--checked"></div>}
          label={<SavedAddress addressInfo={method} />}
          checked={selectedAddress === method.id}
          value="shipping-addres"
          disabled={disabled}
          onChange={() => {
            onChange(method);
          }}
        />
      </div>
    );
  });

  return (
    <div className="checkout__radio-list shipping-address-selector">
      {savedAddressList}
      <div className={`checkout__radio-wrapper ${!selectedAddress ? 'is-selected' : ''}`}>
        <Checkbox
          className="checkout__radio"
          icon={<div className="radio--checked"></div>}
          label={t('shipping.add_new_address')}
          checked={!selectedAddress}
          value="shipping-addres"
          disabled={disabled}
          onChange={handleNewAddressChange}
        />
      </div>
    </div>
  );
};

export default SavedAddressList;
