// Playwright E2E Auth Helper for HttpOnly Cookie Auth
import { BrowserContext, request as playwrightRequest } from '@playwright/test';

export async function loginAndSaveSession(apiBaseUrl: string, userId: string, csrfToken: string, context: BrowserContext) {
  // 1. Get CSRF token (simulate browser double-submit)
  const csrfRes = await playwrightRequest.newContext().get(`${apiBaseUrl}/api/csrf`);
  const csrfCookie = csrfRes.headers()['set-cookie']?.split(';')[0].split('=')[1];
  const token = csrfToken || csrfCookie;

  // 2. Login via API to get session cookies
  const loginRes = await playwrightRequest.newContext().post(`${apiBaseUrl}/api/login`, {
    data: {
      userId,
      csrfToken: token,
      email: `${userId}@test.com`,
      phone: '1234567890',
    },
    headers: {
      Cookie: `hhdao_csrf=${token}`,
    },
  });
  if (loginRes.status() !== 200) throw new Error('Login failed');
  const setCookies = loginRes.headers()['set-cookie'];
  if (!setCookies) throw new Error('No cookies set');

  // 3. Parse cookies and add to browser context
  const cookies = setCookies.split(',').map((c) => {
    const [cookie] = c.split(';');
    const [name, value] = cookie.trim().split('=');
    return {
      name,
      value,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Strict',
      secure: false,
    };
  });
  await context.addCookies(cookies);
}
