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
    applicationLoading;
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
      // Make sure we have a selected ship line
      if (!selectedShippingLine) {
        setSelectedShippingLine(shippingLines[selectedShippingLineIndex]);
      }
      
      // get the ship lines that will actually end up being displayed
      // This section can be removed once we start allowing all ship options for all products
      const lines = [];
      const standardShipping = shippingLines.find(line => line.description.indexOf('Free Standard Shipping') > -1);
      if (standardShipping) {
        lines.push(standardShipping);
      }
      const productIds = lineItems.map(li => li.product_data.product_id);
      const expeditedProductIds = Array.from(JSON.parse(process.env.NEXT_PUBLIC_AUTOMATICALLY_EXPEDITED_PRODUCTS));
      if (productIds.some(id => expeditedProductIds.indexOf(id) > -1)) {
        const expeditedShipping = shippingLines.find(line => line.description.indexOf('Expedited Shipping') > -1)
        if (expeditedShipping) {
          lines.push(expeditedShipping);
        }
      }

      setDisplayedShippingLines(lines);
    }, [shippingLines]);

    useEffect(() => {
      // Don't automatically select a shipping line that is not visible
      if (
        selectedShippingLine
        && !displayedShippingLines.find(line => line.description === selectedShippingLine.description)
        && displayedShippingLines.length > 0
      ) {
        handleChange(displayedShippingLines[0]);
      }
    }, [displayedShippingLines]);

    // ZJ: this causes some weird UI when selecting a new shipping line
    // Keep local state for selected shipping line in sync with server app state
    // useEffect(() => {
    //   setSelectedShippingLine(shippingLines[selectedShippingLineIndex]);
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [selectedShippingLineIndex]);

    const handleChange = useCallback(async (line) => {
      setLoading(true);
      try {
        setSelectedShippingLine(line);
        await updateShippingLine(line.id);
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

    if (appLoading || (displayedShippingLines.length > 0 && !shipOptionMetadata)) {
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
