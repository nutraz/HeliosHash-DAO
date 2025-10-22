import * as React from 'react';

export function HeartIcon({ className = '', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M50 82s-30-18.5-30-37.5C20 31 32 24 41.5 32.5 50 41 58.5 32.5 68 44.5 80 63.5 50 82 50 82z" stroke="currentColor" strokeWidth={8} fill="none" strokeLinejoin="round" />
    </svg>
  );
}
