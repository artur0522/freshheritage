import React from 'react';
import { EmptyState } from '@/components/HeadlessCheckout/EmptyState';

const EmptyShippingLines = ({ title }) => (
  <div className="FieldSet__Content">
    <EmptyState title={title} />
  </div>
);

export default EmptyShippingLines;
