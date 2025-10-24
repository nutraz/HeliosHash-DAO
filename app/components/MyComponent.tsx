import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1>
      <p>{t('dashboard.description', { count: 5 })}</p>
    </div>
  );
}

export default MyComponent;
