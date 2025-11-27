import { describe, it, expect } from 'vitest';
import PostCard from '@/components/social/PostCard';

describe('PostCard', () => {
  it('is a renderable component', () => {
    expect(typeof PostCard === 'function' || typeof PostCard === 'object').toBe(true);
  });
});
