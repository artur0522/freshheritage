import { EmptyState } from '@/components/HeadlessCheckout/EmptyState';

const EmptyShippingLines = ({ title, icon }) => (
  <div className="field-set__content">
    <EmptyState title={title} icon={icon} />
  </div>
);

export default EmptyShippingLines;
