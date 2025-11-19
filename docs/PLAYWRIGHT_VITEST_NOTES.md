Playwright vs Vitest notes

- Keep Vitest setup (jest-dom, testing-library) in `apps/web/vitest.setup.ts` and referenced by `apps/web/vitest.config.ts`.
- Do NOT import Vitest setup in Playwright tests or your Playwright configuration.
- Make shared helpers pure functions without registering globals.

Playwright config should use Playwright's `expect` and not rely on jest-dom.

Example: in a Playwright test, use:
```ts
import { test, expect } from '@playwright/test'

test('homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL('/')
})
```
