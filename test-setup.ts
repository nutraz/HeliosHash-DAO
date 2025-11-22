import '@testing-library/jest-dom';
import React from 'react';

// Expose React globally for tests that expect `React` to be available
// (some components rely on automatic global React import or older JSX runtime)
(global as any).React = React;

// Basic jsdom sanity (can extend later)
if (typeof document !== 'undefined') {
  // noop for now — place to add globals like localStorage mocks if needed
}

export {};
