import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  useShippingLines,
  useLoadingStatus,
  useErrors,
  useShippingAddress,
  useOrderMetadata,
  useLineItems
} from '@boldcommerce/checkout-react-components';
import { LoadingState } from '../LoadingState';
import { ShippingLineList, EmptyShippingLines } from './components';
import { useAnalytics, useErrorLogging } from '@/hooks/index.js';
import { useTranslation } from 'react-i18next';
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext';

const ShippingLines = ({ applicationLoading }) => {
  const { data, updateShippingLine, getShippingLines } = useShippingLines();
  const { data: shippingAddress } = useShippingAddress();
  const { data: loadingStatus } = useLoadingStatus();
  const { data: errors } = useErrors();
  const { data: lineItems } = useLineItems();
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
    applicationLoading ||
    !shipOptionMetadata;

  return (
    <MemoizedShippingLines
      shippingLines={data.shippingLines}
      selectedShippingLineIndex={data.selectedShippingLineIndex}
      updateShippingLine={updateShippingLine}
      getShippingLines={getShippingLines}
      showShippingLines={showShippingLines}
      appLoading={loading}
      lineItems={lineItems}
    />
  );
};

const MemoizedShippingLines = memo(
  ({
    shippingLines,
    selectedShippingLineIndex,
    updateShippingLine,
    getShippingLines,
    showShippingLines,
    appLoading,
    lineItems
  }) => {
    const trackEvent = useAnalytics();
    const logError = useErrorLogging();
    const [shippingLineIndex, setShippingLineIndex] =
      useState(selectedShippingLineIndex);
    const [shipWeekPreference, setShipWeekPreference] = useState('');
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const [shippingMethodOpen] = useState(true);
    const { t } = useTranslation();
    const { shipOptionMetadata } = useHeadlessCheckoutContext();
    const { appendOrderMetadata } = useOrderMetadata();

    // need to refresh shipping lines when cart line item updates
    const refreshShippingLines = useCallback(async () => {
      if (showShippingLines) {
        try {
          await getShippingLines()
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
    }, [lineItems]);

    // Keep local state for selected shipping line in sync with server app state
    useEffect(() => {
      setShippingLineIndex(selectedShippingLineIndex);
    }, [selectedShippingLineIndex]);

    const handleChange = useCallback(async (index) => {
      setShippingLineIndex(index);
      setLoading(true);
      try {
        await updateShippingLine(index);
        setErrors(null);
      } catch (e) {
        // If there was an error, reset the selected shipping line to the previous selected shipping line.
        setShippingLineIndex(selectedShippingLineIndex);
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
          shippingLines={shippingLines}
          selectedShippingLineIndex={shippingLineIndex}
          onChange={handleChange}
          disabled={loading}
          selectedStandardShipWeek={shipWeekPreference}
          onShipWeekChange={handleShipWeekChange}
          shipOptionMetadata={shipOptionMetadata}
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
