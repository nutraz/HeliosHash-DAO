import type { Page } from '@playwright/test';

/**
 * Seed a minimal debug auth profile into localStorage before the app loads.
 * Tests can call this helper before `page.goto()` so the client-side
 * `AuthContext` hydrates a logged-in user without needing to interact
 * with Internet Identity in tests.
 */
export async function seedMockAuth(page: Page, principal = 'test-principal-0000', name = 'E2E Test User') {
  const minimal = {
    principal,
    name,
    email: undefined,
    avatar: undefined,
    roles: ['test'],
  };

  await page.addInitScript((s) => {
    // @ts-ignore
    localStorage.setItem('helioshash_user', s);
  }, JSON.stringify(minimal));
}
