import * as React from 'react';

export function DollarIcon({ className = '', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <text x="50" y="70" textAnchor="middle" fontSize="64" fill="currentColor" fontFamily="Arial, Helvetica, sans-serif">$</text>
    </svg>
  );
}
