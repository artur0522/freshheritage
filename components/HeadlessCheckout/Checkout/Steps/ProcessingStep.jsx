import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ProcessingPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    if (window) window.scrollTo(0,0)
  }, [])

  return (
    <div className="checkout__processing">
      {/* <LoadingSpinner /> */}
      <h3>{t('processing.order')}</h3>
      <p className="secondary--body">{t('processing.description')}</p>
    </div>
  );
};

export default ProcessingPage;
