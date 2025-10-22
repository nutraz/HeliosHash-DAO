'use client';

export type SafeHTMLProps = {
  html: string;
  allowedTags?: string[];
  allowedAttr?: string[];
  className?: string;
};

export function SafeHTML({ html, allowedTags, allowedAttr, className }: SafeHTMLProps) {
  // Best-effort sanitizer without external deps; prefers plain-text fallback if library not present
  let sanitized = '';
  try {
    // dynamic import if available at runtime (optional dependency)
    const w = globalThis as any;
    const Purify = w?.DOMPurify || undefined;
    if (Purify && typeof Purify.sanitize === 'function') {
      sanitized = Purify.sanitize(html ?? '', {
        ALLOWED_TAGS: allowedTags ?? ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a'],
        ALLOWED_ATTR: allowedAttr ?? ['href', 'title', 'target', 'rel'],
        FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
      });
    } else {
      // Escape all tags as fallback
      sanitized = (html ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  } catch {
    sanitized = (html ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
