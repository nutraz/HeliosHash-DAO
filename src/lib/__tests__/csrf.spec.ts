import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ensureCsrfToken, withCsrfHeaders } from '../../lib/csrf';

function setCookie(v: string) {
  Object.defineProperty(document, 'cookie', {
    value: v,
    writable: true,
    configurable: true,
  });
}

describe('csrf helpers', () => {
  beforeEach(() => {
  // define minimal globals for JSDOM
  // @ts-ignore
  global.document = { cookie: '' } as any;
  // @ts-ignore
  global.fetch = vi.fn();
  });

  it('ensureCsrfToken requests when missing', async () => {
    (global.fetch as any).mockResolvedValueOnce({ ok: true, json: async () => ({ token: 'abc' }) });
    const token = await ensureCsrfToken();
    expect(token).toBe('abc');
  });

  it('withCsrfHeaders attaches header', async () => {
    setCookie('csrfToken=xyz');
    const init = await withCsrfHeaders({ headers: { 'Content-Type': 'application/json' } });
    const hdr = new Headers(init.headers as any);
    expect(hdr.get('x-csrf-token')).toBe('xyz');
  });
});
