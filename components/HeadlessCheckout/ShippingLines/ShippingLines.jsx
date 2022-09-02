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
    const [shipWeekPreference, setShipWeekPreference] = useState('');
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const [shippingMethodOpen] = useState(true);
    const { t } = useTranslation();
    const { shipOptionMetadata } = useHeadlessCheckoutContext();
    const { appendOrderMetadata } = useOrderMetadata();
    const [displayedShippingLines, setDisplayedShippingLines] = useState(shippingLines);
    const [selectedShippingLine, setSelectedShippingLine] = useState(shippingLines[selectedShippingLineIndex]);

    // need to refresh shipping lines when cart line item updates
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
    }, [lineItems]);

    useEffect(() => {
      setSelectedShippingLine(shippingLines[selectedShippingLineIndex]);
      const displayedShippingLines = [];
      displayedShippingLines.push(shippingLines.find(line => line.description === 'Free Standard Shipping'));
      const productIds = lineItems.map(li => li.product_data.product_id);
      const expeditedProductIds = Array.from(JSON.parse(process.env.NEXT_PUBLIC_AUTOMATICALLY_EXPEDITED_PRODUCTS));
      if (productIds.some(id => expeditedProductIds.indexOf(id) > -1)) {
        displayedShippingLines.push(shippingLines.find(line => line.description === 'Expedited Shipping'));
      }
      setDisplayedShippingLines(displayedShippingLines);
    }, [shippingLines]);

    // // Keep local state for selected shipping line in sync with server app state
    useEffect(() => {
      setSelectedShippingLine(shippingLines[selectedShippingLineIndex]);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedShippingLineIndex]);

    const handleChange = useCallback(async (line) => {
      setLoading(true);
      try {
        const index = shippingLines.findIndex(l => l.description === line.description);
        setSelectedShippingLine(line);
        await updateShippingLine(index);
        setErrors(null);
      } catch (e) {
        console.error(e);
        setErrors(e.body?.errors);
        // If there was an error, reset the selected shipping line to the previous selected shipping line.
        setSelectedShippingLine(shippingLines[selectedShippingLineIndex]);
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

    if (appLoading || (shippingLines.length > 0 && !shipOptionMetadata)) {
      content = <LoadingState />;
    } else if (!showShippingLines || !shipOptionMetadata) {
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
          shippingLines={displayedShippingLines}
          selectedShippingLine={selectedShippingLine}
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
