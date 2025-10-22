import * as React from 'react';

export function StarIcon({ className = '', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <polygon points="50,10 61,39 92,39 66,59 76,90 50,70 24,90 34,59 8,39 39,39" fill="currentColor" />
      <circle cx="20" cy="20" r="8" fill="currentColor" />
      <circle cx="80" cy="20" r="8" fill="currentColor" />
    </svg>
  );
}
