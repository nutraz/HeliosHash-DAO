import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-4 border border-slate-700 rounded-lg shadow-md transition-all hover:border-cyan/50 hover:shadow-cyan/10 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
