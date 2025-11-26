"use client";
import { useState, useEffect } from 'react';
import { Zap, Cpu, Database } from 'lucide-react';

type DataSource = 'live' | 'dev' | 'mock';

interface DataSourceIndicatorProps {
  source: DataSource;
  className?: string;
}

export function DataSourceIndicator({ source, className = '' }: DataSourceIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Auto-hide after 5 seconds, but show immediately on source change
    setIsVisible(true);
    const timer = setTimeout(() => setIsVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [source]);

  const config = {
    live: { 
      icon: Zap, 
      color: 'text-green-400', 
      bg: 'bg-green-900/80', 
      border: 'border-green-600',
      label: 'Live Blockchain Data' 
    },
    dev: { 
      icon: Cpu, 
      color: 'text-blue-400', 
      bg: 'bg-blue-900/80', 
      border: 'border-blue-600',
      label: 'Development Mode' 
    },
    mock: { 
      icon: Database, 
      color: 'text-yellow-400', 
      bg: 'bg-yellow-900/80', 
      border: 'border-yellow-600',
      label: 'Demo Data' 
    }
  }[source];

  const Icon = config.icon;

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 left-4 z-50 ${className}`}>
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${config.bg} ${config.border} backdrop-blur-sm shadow-lg animate-pulse`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
        <span className="text-sm text-white font-medium">{config.label}</span>
      </div>
    </div>
  );
}
