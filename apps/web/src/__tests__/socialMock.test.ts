import { describe, it, expect } from 'vitest';
import { getFeed, addPost } from '@/lib/socialMock';

describe('socialMock', () => {
  it('returns feed and can add a post', () => {
    const before = getFeed();
    const p = addPost('test', 'hello from test');
    const after = getFeed();
    expect(after[0]!.id).toBe(p.id);
  });
});
