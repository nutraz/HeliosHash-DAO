import { test, expect } from '@playwright/test';

// H0c.2 / post-connect redirect: an unauthenticated visitor to /dashboard must
// see the connect gate, never the private dashboard content. Completing the
// real Internet Identity round-trip — and therefore the post-connect return to
// /dashboard — cannot run in CI without a live II/replica (clicking Connect
// would open an external identity.ic0.app popup), so the redirect wiring is
// covered deterministically by src/contexts/AuthContext.redirect.test.tsx.
// Here we assert the gate that precedes that redirect.
test.describe('Dashboard auth gate', () => {
  test('unauthenticated visitor sees the connect gate, not dashboard content', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByTestId('dashboard-auth-gate')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Connect Internet Identity to continue' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Connect Internet Identity' }),
    ).toBeVisible();

    // Private dashboard content must not render for an unauthenticated visitor.
    await expect(page.getByText('Quick Actions')).toHaveCount(0);
    await expect(page.getByText('DAO Modules')).toHaveCount(0);
  });
});
