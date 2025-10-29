import React from 'react';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-yellow-700 text-white text-center py-2 z-50">
      You are offline. Some features may be unavailable.
    </div>
  );
};
