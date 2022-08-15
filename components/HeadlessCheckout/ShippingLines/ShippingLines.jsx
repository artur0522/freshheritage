import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  useShippingLines,
  useLoadingStatus,
  useErrors,
  useShippingAddress
} from '@boldcommerce/checkout-react-components';
import { LoadingState } from '../LoadingState';
import { ShippingLineList, EmptyShippingLines } from './components';
import { useAnalytics, useErrorLogging } from '@/hooks/index.js';
import { useTranslation } from 'react-i18next';
import IconSelectArrow from '@/svgs/select-arrow.svg';
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext';
import { useCustomerContext } from '@/context/CustomerContext';
import { useOrderMetadata } from '@boldcommerce/checkout-react-components';
import moment from 'moment';
import { map } from 'traverse';

const ShippingLines = ({ applicationLoading }) => {
  const { data, updateShippingLine, getShippingLines } = useShippingLines();
  const { data: shippingAddress } = useShippingAddress();
  const { data: loadingStatus } = useLoadingStatus();
  const { data: errors } = useErrors();
  const shippingAddressErrors = errors.shippingAddress;
  const selectedCountryCode = shippingAddress?.country_code;
  const shippingAddressLoadingStatus = loadingStatus.shippingAddress;
  const { shipOptionMetadata } = useHeadlessCheckoutContext();
  const showShippingLines =
    selectedCountryCode &&
    !shippingAddressErrors &&
    shippingAddressLoadingStatus !== 'incomplete' &&
    !!shipOptionMetadata;
  const loading =
    loadingStatus.shippingAddress === 'setting' ||
    loadingStatus.shippingLines === 'fetching' ||
    applicationLoading;

  return (
    <MemoizedShippingLines
      shippingLines={data.shippingLines}
      selectedShippingLine={data.selectedShippingLineIndex}
      updateShippingLine={updateShippingLine}
      getShippingLines={getShippingLines}
      showShippingLines={showShippingLines}
      appLoading={loading}
    />
  );
};

const MemoizedShippingLines = memo(
  ({
    shippingLines,
    selectedShippingLine,
    updateShippingLine,
    getShippingLines,
    showShippingLines,
    appLoading
  }) => {
    const trackEvent = useAnalytics();
    const logError = useErrorLogging();
    const [shippingLineIndex, setShippingLineIndex] =
      useState(selectedShippingLine);
    const [shipWeekPreference, setShipWeekPreference] = useState('');
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const [shippingMethodOpen, setShippingMethodOpen] = useState(true);
    const { t } = useTranslation();
    const { shipOptionMetadata } = useHeadlessCheckoutContext();
    const { customer, subsData } = useCustomerContext();
    const { appendOrderMetadata } = useOrderMetadata();

    // Only ever called on checkout page load - not called each time shipping lines are updated
    const refreshShippingLines = useCallback(async () => {
      if (showShippingLines) {
        try {
          await getShippingLines();
          trackEvent('set_shipping_line');
          setErrors(null);
        } catch (e) {
          logError('shipping_lines', e);
          setErrors(e.body.errors);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showShippingLines]);

    /**
     * If this component rendered and shipping address is already selected.
     * This usually means that a shipping address was preselected on the server and therefor we need to fetch shipping lines manually.
     */
    useEffect(() => {
      refreshShippingLines();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Keep local state for selected shipping line in sync with server app state
    useEffect(() => {
      // TODO: make sure this does not select an option that is not visible
      setShippingLineIndex(selectedShippingLine);
    }, [selectedShippingLine]);

    const handleChange = useCallback(async (index) => {
      setShippingLineIndex(index);
      setLoading(true);
      try {
        await updateShippingLine(index);
        setErrors(null);
      } catch (e) {
        // If there was an error, reset the selected shipping line to the previous selected shipping line.
        setShippingLineIndex(selectedShippingLine);
        setErrors(e.body.errors);
      }
      setLoading(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleShipWeekChange = useCallback(async (shipWeek) => {
      setShipWeekPreference(shipWeek);
      await appendOrderMetadata({
        "note_attributes": {
          "ship_week_preference": shipWeek
        }
      });
    }, [appendOrderMetadata]);

    let content = null;

    if (appLoading) {
      content = <LoadingState />;
    } else if (!showShippingLines) {
      content = (
        <EmptyShippingLines title={t('shipping.options_description')} icon={'box'} />
      );
    } else if (shippingLines.length === 0) {
      content = (
        <EmptyShippingLines title={t('shipping.no_options_description')} icon={'box'} />
      );
    } else {
      content = (
        <ShippingLineList
          shippingLines={shippingLines
            .map(line => {
              switch(line.description) {
                case 'Bundle with Next Order':
                  if (!!shipOptionMetadata.bundled && !!customer && (!!subsData || subsData.length < 1)) {
                    line.showOption = true;
                    line.display = shipOptionMetadata.bundled.shipWeekDisplay;
                    line.shipWeekPreference = shipOptionMetadata.bundled.shipWeekPreference;
                  }
                  else line.showOption = false;
                  break;
                case 'Standard':
                  line.showOption = true;
                  line.options = shipOptionMetadata.standard;
                  break;
                case 'Expedited':
                  line.showOption = true;
                  line.display = shipOptionMetadata.expedited.estimatedDeliveryDateDisplay;
                  break;
              }
              return line;
            })}
          selectedShippingLine={shippingLineIndex}
          onChange={handleChange}
          disabled={loading}
          selectedStandardShipWeek={shipWeekPreference}
          onShipWeekChange={handleShipWeekChange}
        />
      );
    }

    return (
      <div className="order-shipping-method">
        <div className={`checkout__header checkout__header--border-on-closed checkout__row ${shippingMethodOpen ? 'checkout__header--open' : 'checkout__header--closed'}`}>
          <h3>Shipping Method</h3>
        </div>
        {!!shippingMethodOpen &&
          <>
            {errors && <p type="alert">{errors[0].message}</p>}
            {content}
          </>
        }
      </div>
    );
  }
);

export default ShippingLines;
