import { describe, it, expect, beforeEach, vi } from 'vitest';
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

describe('EditorService.applyHeader()', () => {
  it('applies H1 header prefix', () => {
    const result = EditorService.applyHeader(makeTA('Hello', 0, 5), 1);
    expect(result).toBe('# Hello');
  });

  it('applies H2 header prefix', () => {
    const result = EditorService.applyHeader(makeTA('Hello', 0, 5), 2);
    expect(result).toBe('## Hello');
  });

  it('applies H3 header prefix', () => {
    const result = EditorService.applyHeader(makeTA('Hello', 0, 5), 3);
    expect(result).toBe('### Hello');
  });

  it('removes existing header prefix when level is 0', () => {
    const result = EditorService.applyHeader(makeTA('## Hello', 0, 8), 0);
    expect(result).toBe('Hello');
  });
});

describe('EditorService.clearFormatting()', () => {
  it('removes bold, italic, strikethrough, and inline code formatting', () => {
    const text = '**bold** *italic* ~~striked~~ `code`';
    const ta = makeTA(text, 0, text.length);
    const result = EditorService.clearFormatting(ta);
    expect(result).toBe('bold italic striked code');
  });
});

describe('EditorService.insertElements()', () => {
  it('inserts link markdown for selected text', () => {
    const result = EditorService.insertLink(makeTA('Google', 0, 6));
    expect(result).toBe('[Google](https://)');
  });

  it('inserts code block for selected text', () => {
    const result = EditorService.insertCodeBlock(makeTA('const a = 1;', 0, 12));
    expect(result).toBe('```\nconst a = 1;\n```');
  });

  it('inserts quote prefix for selected line', () => {
    const result = EditorService.insertQuote(makeTA('Quote text', 0, 10));
    expect(result).toBe('> Quote text');
  });
});

describe('EditorService.downloadMarkdown()', () => {
  beforeEach(() => {
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  it('generates filename from H1 heading if present', async () => {
    const filename = await EditorService.downloadMarkdown('# Mi Documento Especial\n\nTexto aquí');
    expect(filename).toBe('mi-documento-especial.md');
  });

  it('defaults to documento.md if no H1 heading exists', async () => {
    const filename = await EditorService.downloadMarkdown('Solo texto plano sin titulo');
    expect(filename).toBe('documento.md');
  });

  it('uses custom filename if specified', async () => {
    const filename = await EditorService.downloadMarkdown('Contenido', 'mi-nota');
    expect(filename).toBe('mi-nota.md');
  });
});

describe('EditorService.parseMarkdown()', () => {
  const cases = [
    ['# H1',              /<h1/],
    ['## H2',             /<h2/],
    ['### H3',            /<h3/],
    ['**bold**',          /<strong>bold<\/strong>/],
    ['*italic*',          /<em>italic<\/em>/],
    ['~~striked~~',       /<del>striked<\/del>/],
    ['`code`',            /<code/],
    ['> quote',           /<blockquote/],
    ['- list item',       /<li/],
    ['[link](https://x)', /href="https:\/\/x"/],
  ];

  it.each(cases)('"%s" → produces expected HTML element', (input, pattern) => {
    expect(EditorService.parseMarkdown(input)).toMatch(pattern);
  });

  it('escapes < and > to prevent XSS', () => {
    const out = EditorService.parseMarkdown('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(out).not.toContain('<script>');
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
    expect(out).toContain('target="_blank"');
  });
});
