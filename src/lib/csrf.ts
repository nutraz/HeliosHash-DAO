// CSRF helper utilities for client-side fetch
// Double-submit cookie pattern: server issues a csrfToken cookie via GET /api/csrf
// Include the same token in the 'x-csrf-token' header for state-changing requests

'use client';

export async function ensureCsrfToken(): Promise<string> {
  // If a token is already present in cookies, reuse it
  const existing = getCookie('csrfToken');
  if (existing) return existing;
  const res = await fetch('/api/csrf', { method: 'GET', credentials: 'same-origin' });
  if (!res.ok) throw new Error('Failed to obtain CSRF token');
  const data = (await res.json()) as { token: string };
  return data.token;
}

export async function withCsrfHeaders(init?: RequestInit): Promise<RequestInit> {
  const token = await ensureCsrfToken();
  const headers = new Headers(init?.headers || {});
  headers.set('x-csrf-token', token);
  return { ...init, headers };
}

export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.split(';').map((c) => c.trim()).find((c) => c.startsWith(name + '='));
  return match ? decodeURIComponent(match.split('=')[1]) : undefined;
}
