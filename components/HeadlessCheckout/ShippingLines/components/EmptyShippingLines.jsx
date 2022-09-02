import { EmptyState } from '@/components/HeadlessCheckout/EmptyState';

export const EmptyShippingLines = ({ title, icon }) => (
  <div className="field-set__content">
    <EmptyState title={title} icon={icon} />
  </div>
);
