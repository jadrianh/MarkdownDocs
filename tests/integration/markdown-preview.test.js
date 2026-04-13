import { describe, it, expect } from 'vitest';
import { EditorService } from '../../src/editor/editor.service.js';

describe('Markdown → Preview Rendering', () => {
  describe('headings', () => {
    it('# becomes an h1 element', () => {
      expect(EditorService.parseMarkdown('# Main Title')).toMatch(/<h1[^>]*>Main Title<\/h1>/);
    });

    it('## becomes an h2 element', () => {
      expect(EditorService.parseMarkdown('## Section')).toMatch(/<h2[^>]*>Section<\/h2>/);
    });

    it('### becomes an h3 element', () => {
      expect(EditorService.parseMarkdown('### Sub')).toMatch(/<h3[^>]*>Sub<\/h3>/);
    });
  });

  describe('inline formatting', () => {
    it('**text** renders as <strong>', () => {
      expect(EditorService.parseMarkdown('**bold**')).toContain('<strong>bold</strong>');
    });

    it('*text* renders as <em>', () => {
      expect(EditorService.parseMarkdown('*italic*')).toContain('<em>italic</em>');
    });
  });

  describe('lists', () => {
    it('- item renders as <li>', () => {
      expect(EditorService.parseMarkdown('- item one')).toMatch(/<li[^>]*>item one<\/li>/);
    });
  });

  describe('links', () => {
    it('[text](url) renders anchor with correct href', () => {
      const html = EditorService.parseMarkdown('[Visit](https://example.com)');
      expect(html).toContain("href='https://example.com'");
      expect(html).toContain('>Visit</a>');
    });

    it('links always open in a new tab', () => {
      const html = EditorService.parseMarkdown('[x](https://x.com)');
      expect(html).toContain("target='_blank'");
    });
  });

  describe('security', () => {
    it('raw HTML tags are escaped in the output', () => {
      const html = EditorService.parseMarkdown('<b>not bold</b>');
      expect(html).not.toContain('<b>');
      expect(html).toContain('&lt;b&gt;');
    });

    it('script tags are neutralized', () => {
      const html = EditorService.parseMarkdown('<script>alert("xss")</script>');
      expect(html).not.toContain('<script>');
    });

    it('& is escaped to &amp;', () => {
      expect(EditorService.parseMarkdown('A & B')).toContain('&amp;');
    });
  });

  describe('edge cases', () => {
    it('empty string returns empty string', () => {
      expect(EditorService.parseMarkdown('')).toBe('');
    });

    it('null returns empty string', () => {
      expect(EditorService.parseMarkdown(null)).toBe('');
    });

    it('plain text with no markdown syntax is returned as-is (excluding newline conversion)', () => {
      const out = EditorService.parseMarkdown('No markdown here');
      expect(out).toContain('No markdown here');
    });
  });
});
