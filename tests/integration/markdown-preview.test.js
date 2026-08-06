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

    it('renders nested ordered lists with valid <ol><li> hierarchy', () => {
      const markdown = '1. Item 1\n   1. Subitem 1.1\n   2. Subitem 1.2\n2. Item 2';
      const html = EditorService.parseMarkdown(markdown);
      expect(html).toMatch(/<ol>[\s\S]*?<li[^>]*>[\s\S]*?Item 1[\s\S]*?<ol>[\s\S]*?<li[^>]*>[\s\S]*?Subitem 1\.1[\s\S]*?<\/li>[\s\S]*?<\/ol>[\s\S]*?<\/li>[\s\S]*?<\/ol>/);
    });

    it('renders nested unordered lists with valid <ul><li> hierarchy', () => {
      const markdown = '- Level 1\n  - Level 2\n- Level 1 end';
      const html = EditorService.parseMarkdown(markdown);
      expect(html).toMatch(/<ul>[\s\S]*?<li[^>]*>[\s\S]*?Level 1[\s\S]*?<ul>[\s\S]*?<li[^>]*>[\s\S]*?Level 2[\s\S]*?<\/li>[\s\S]*?<\/ul>[\s\S]*?<\/li>[\s\S]*?<\/ul>/);
    });

    it('handles tab indented lists cleanly without breaking AST', () => {
      const markdown = '1. Tab item 1\n\t1. Tab subitem 1';
      const html = EditorService.parseMarkdown(markdown);
      expect(html).toContain('<ol>');
      expect(html).toContain('Tab subitem 1');
    });
  });

  describe('links', () => {
    it('[text](url) renders anchor with correct href', () => {
      const html = EditorService.parseMarkdown('[Visit](https://example.com)');
      expect(html).toContain('href="https://example.com"');
      expect(html).toContain('>Visit</a>');
    });

    it('links always open in a new tab', () => {
      const html = EditorService.parseMarkdown('[x](https://x.com)');
      expect(html).toContain('target="_blank"');
    });
  });

  describe('security', () => {
    it('raw HTML tags are escaped in the output', () => {
      const html = EditorService.parseMarkdown('&lt;b&gt;not bold&lt;/b&gt;');
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
