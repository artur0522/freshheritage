import React from 'react';

const ConfirmationListItem = ({ title, children }) => (
  <div className="confirmation__list-item">
    <h3>{ title }</h3>
    { children }
  </div>
);

export default ConfirmationListItem;
