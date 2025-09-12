import { test, expect } from 'vitest';

test('jsdom provides window', () => {
  expect(typeof window).toBe('object');
  expect(typeof document).toBe('object');
});
