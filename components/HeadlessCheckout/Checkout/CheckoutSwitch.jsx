import React, { useEffect, useCallback, useState } from 'react';
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext';
import { useCheckoutStore, useApplicationState } from '@boldcommerce/checkout-react-components';
import { useInventory } from '@/hooks/index.js';
import StartStep from './Steps/StartStep';
import ProcessingStep from './Steps/ProcessingStep';
import ConfirmationStep from './Steps/ConfirmationStep';
import { useRouter } from 'next/router';

const SinglePageLayout = () => {
  const { state } = useCheckoutStore();
  const { data: checkoutData } = useHeadlessCheckoutContext();
  const { updateApplicationState } = useApplicationState();
  const router = useRouter();
  const validateInventory = useInventory();
  const orderStatus = state.orderInfo.orderStatus;

  const checkInventory = useCallback(async () => {
    const inventory_issues = await validateInventory(
      state.applicationState.line_items
    );

    if (inventory_issues) {
      console.log('inventory issues detected');
      // handle error when there are inventory issues
    }
  }, []);
  const [component, setComponent] = useState(<StartStep />);

  useEffect(() => {
    checkInventory();
  }, []);

  useEffect(() => {
    console.log("update application state")
    updateApplicationState(checkoutData.application_state)
  }, [checkoutData])

  // let component = <IndexPage />;
  useEffect(() => {
    console.log("orderStatus:", orderStatus)
    if (orderStatus === 'error') {
      router.push('/');
    } else if (orderStatus === 'processing') {
      setComponent(<ProcessingStep />);
    } else if (orderStatus === 'completed') {
      setComponent(<ConfirmationStep />);
    }
  }, [orderStatus]);

  return <div className="Checkout">{component}</div>;
};

export default SinglePageLayout;
