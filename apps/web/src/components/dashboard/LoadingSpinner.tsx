import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <Loader className="animate-spin text-blue-500" size={32} />
  </div>
);

export default LoadingSpinner;
