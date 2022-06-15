import React from 'react';
import { useTranslation } from 'react-i18next';

const ProcessingPage = () => {
  const { t } = useTranslation();
  return (
    <div className="Checkout__Processing">
      {/* <LoadingSpinner /> */}
      <h1>{t('processing.order')}</h1>
      <p>{t('processing.description')}</p>
    </div>
  );
};

export default ProcessingPage;
