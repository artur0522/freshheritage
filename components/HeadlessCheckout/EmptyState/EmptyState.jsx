import React from 'react';
import PropTypes from 'prop-types';
import { EmptyStateIcon } from './components';
import IconShippingBox from '@/svgs/shipping-box.svg'
import IconMoney from '@/svgs/money.svg'

// import './EmptyState.css';


const getIcon = (icon) => {
  switch(icon) {
    case 'box':
      return <IconShippingBox />
    case 'money':
      return <IconMoney />
    default:
      return <EmptyStateIcon />
  }
}

const EmptyState = ({ title, icon }) => (
  <div className="field-set--empty-state">
    {getIcon(icon)}
    { title }
  </div>
);

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
};

export default EmptyState;