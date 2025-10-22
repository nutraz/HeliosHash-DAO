import * as React from 'react';

export function BuildingIcon({ className = '', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="20" y="30" width="60" height="50" rx="12" fill="currentColor" />
      <rect x="40" y="60" width="20" height="20" rx="4" fill="#fff" />
      <circle cx="35" cy="45" r="5" fill="#fff" />
      <circle cx="65" cy="45" r="5" fill="#fff" />
    </svg>
  );
}
