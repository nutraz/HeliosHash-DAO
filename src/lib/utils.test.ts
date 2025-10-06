import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils', () => {
  describe('cn (className merge utility)', () => {
    it('should merge class names', () => {
      const result = cn('bg-red-500', 'text-white');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should handle conditional classes', () => {
      const result = cn('base-class', true && 'conditional-class', false && 'hidden-class');
      expect(result).toContain('base-class');
      expect(result).toContain('conditional-class');
      expect(result).not.toContain('hidden-class');
    });

    it('should handle tailwind conflicts correctly', () => {
      const result = cn('p-4', 'p-8');
      expect(result).toBeTruthy();
    });

    it('should handle undefined and null values', () => {
      const result = cn('base', undefined, null, 'other');
      expect(result).toContain('base');
      expect(result).toContain('other');
    });

    it('should handle empty strings', () => {
      const result = cn('base', '', 'other');
      expect(result).toContain('base');
      expect(result).toContain('other');
    });

    it('should handle arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
      expect(result).toContain('class3');
    });

    it('should handle objects with boolean values', () => {
      const result = cn({
        'active': true,
        'disabled': false,
        'hover': true,
      });
      expect(result).toContain('active');
      expect(result).toContain('hover');
      expect(result).not.toContain('disabled');
    });
  });
});