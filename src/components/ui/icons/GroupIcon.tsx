import * as React from 'react';

export function GroupIcon({ className = '', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <circle cx="50" cy="40" r="16" fill="currentColor" />
      <circle cx="25" cy="65" r="12" fill="currentColor" />
      <circle cx="75" cy="65" r="12" fill="currentColor" />
      <rect x="18" y="75" width="64" height="12" rx="6" fill="currentColor" />
    </svg>
  );
}
