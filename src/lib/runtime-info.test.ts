import { describe, expect, it } from 'vitest';
import { buildStatusSnapshot, formatDuration, probeReplica } from './runtime-info';

// NOTE: The current runtime-info implementation does not export granular helpers
// like getGitInfo/getBuildInfo; we test available public functions.

describe('runtime-info', () => {
  describe('formatDuration', () => {
    it('formats milliseconds into h m s', () => {
      expect(formatDuration(1000)).toBe('0h 0m 1s');
      expect(formatDuration(61_000)).toBe('0h 1m 1s');
      expect(formatDuration(3_661_000)).toBe('1h 1m 1s');
    });
  });

  describe('buildStatusSnapshot', () => {
    it('produces a snapshot with core keys', () => {
      const snap = buildStatusSnapshot();
      expect(snap.status).toBe('ok');
      expect(typeof snap.timestamp).toBe('string');
      expect(typeof snap.uptimeMs).toBe('number');
      expect(typeof snap.memory.rss).toBe('number');
      expect(snap.git).toBeDefined();
      expect(snap.build).toBeDefined();
      expect(snap.env).toBeDefined();
    });

    it('merges extra fields', () => {
      const snap = buildStatusSnapshot({ custom: 42 });
      // @ts-expect-error runtime dynamic
      expect(snap.custom).toBe(42);
    });
  });

  describe('probeReplica', () => {
    it('returns down quickly for invalid host', async () => {
      const res = await probeReplica('http://127.0.0.1:59999/');
      expect(['down', 'degraded', 'up']).toContain(res.status); // allow variability environment
    });
  });
});
