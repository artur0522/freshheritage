import React from 'react';

const RedactedCreditCard = ({ brand, lineText }) => (
  <span className="redacted-card">
    <span className="redacted-card__brand">{brand}</span>
    <span className="redacted-card__number">
      {' '}
      &bull;&bull;&bull;&bull;
      {' '}
      &bull;&bull;&bull;&bull;
      {' '}
      &bull;&bull;&bull;&bull;
      {' '}
      {lineText}
    </span>
  </span>
);

export default RedactedCreditCard;
