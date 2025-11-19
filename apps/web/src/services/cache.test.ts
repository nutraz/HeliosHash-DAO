import { describe, expect, it, vi } from 'vitest';
import { SimpleCache } from './cache';

describe('SimpleCache', () => {
  it('stores and retrieves values', () => {
    const c = new SimpleCache();
    c.set('k', 42);
    expect(c.get<number>('k')).toBe(42);
  });

  it('returns null for missing key', () => {
    const c = new SimpleCache();
    expect(c.get('missing')).toBeNull();
  });

  it('expires entries after ttl', async () => {
    vi.useFakeTimers();
    const c = new SimpleCache();
    c.set('temp', 'data', 100);
    expect(c.get('temp')).toBe('data');
    vi.advanceTimersByTime(150);
    expect(c.get('temp')).toBeNull();
    vi.useRealTimers();
  });

  it('clears specific key', () => {
    const c = new SimpleCache();
    c.set('a', 1);
    c.set('b', 2);
    c.clear('a');
    expect(c.get('a')).toBeNull();
    expect(c.get('b')).toBe(2);
  });

  it('clears all', () => {
    const c = new SimpleCache();
    c.set('a', 1);
    c.set('b', 2);
    c.clearAll();
    expect(c.get('a')).toBeNull();
    expect(c.get('b')).toBeNull();
  });

  it('returns stats', () => {
    const c = new SimpleCache();
    c.set('x', 'y');
    const stats = c.getStats();
    expect(stats.size).toBe(1);
    expect(stats.entries[0]!.key).toBe('x');
  });
});
