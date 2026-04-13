import { describe, it, expect } from 'vitest';
import { EditorService } from '../../src/editor/editor.service.js';

const makeTA = (value, start, end) => ({
  value,
  selectionStart: start,
  selectionEnd: end,
});

describe('EditorService.toggleStyle()', () => {
  it('wraps selected text with bold markers', () => {
    const result = EditorService.toggleStyle(makeTA('Hello world', 0, 5), '**', '**');
    expect(result).toBe('**Hello** world');
  });

  it('wraps selected text with italic markers', () => {
    const result = EditorService.toggleStyle(makeTA('Hello world', 0, 5), '_', '_');
    expect(result).toBe('_Hello_ world');
  });

  it('inserts markers at cursor when nothing is selected', () => {
    const result = EditorService.toggleStyle(makeTA('text', 4, 4), '**', '**');
    expect(result).toBe('text****');
  });

  it('wraps text in the middle of a string', () => {
    const result = EditorService.toggleStyle(makeTA('Hello world', 6, 11), '**', '**');
    expect(result).toBe('Hello **world**');
  });
});

describe('EditorService.makeList()', () => {
  it('creates unordered list from lines', () => {
    const result = EditorService.makeList(makeTA('alpha\nbeta', 0, 10), 'unordered');
    expect(result).toContain('- alpha');
    expect(result).toContain('- beta');
  });

  it('creates ordered list with correct numbering', () => {
    const result = EditorService.makeList(makeTA('alpha\nbeta', 0, 10), 'ordered');
    expect(result).toContain('1. alpha');
    expect(result).toContain('2. beta');
  });

  it('strips existing markers before applying new list type', () => {
    const result = EditorService.makeList(makeTA('- item one', 0, 10), 'ordered');
    expect(result).toContain('1. item one');
    expect(result).not.toContain('- item one');
  });

  it('skips empty lines without adding a marker', () => {
    const result = EditorService.makeList(makeTA('item\n\nother', 0, 11), 'unordered');
    expect(result).toContain('- item');
    expect(result).toContain('- other');
  });
});

describe('EditorService.parseMarkdown()', () => {
  const cases = [
    ['# H1',              /<h1/],
    ['## H2',             /<h2/],
    ['### H3',            /<h3/],
    ['**bold**',          /<strong>bold<\/strong>/],
    ['*italic*',          /<em>italic<\/em>/],
    ['- list item',       /<li/],
    ['[link](https://x)', /href='https:\/\/x'/],
  ];

  it.each(cases)('"%s" → produces expected HTML element', (input, pattern) => {
    expect(EditorService.parseMarkdown(input)).toMatch(pattern);
  });

  it('escapes < and > to prevent XSS', () => {
    const out = EditorService.parseMarkdown('<script>alert(1)</script>');
    expect(out).not.toContain('<script>');
    expect(out).toContain('&lt;script&gt;');
  });

  it('escapes & ampersand', () => {
    const out = EditorService.parseMarkdown('A & B');
    expect(out).toContain('&amp;');
  });

  it('returns empty string for empty input', () => {
    expect(EditorService.parseMarkdown('')).toBe('');
  });

  it('returns empty string for null input', () => {
    expect(EditorService.parseMarkdown(null)).toBe('');
  });

  it('links open in a new tab (target=_blank)', () => {
    const out = EditorService.parseMarkdown('[Google](https://google.com)');
    expect(out).toContain("target='_blank'");
  });
});
