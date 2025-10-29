import React from 'react';

export const SkipToContent: React.FC = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only absolute top-2 left-2 z-50 bg-white text-black px-4 py-2 rounded shadow"
    tabIndex={0}
  >
    Skip to main content
  </a>
);
