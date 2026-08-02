import { describe, it, expect, beforeEach } from 'vitest';
import { AppState } from '../../src/core/state.js';
import { EditorService } from '../../src/editor/editor.service.js';

describe('Editor ↔ State Integration', () => {
  let state;
  beforeEach(() => {
    state = new AppState();
  });

  it('preview mode does not break parseMarkdown', () => {
    state.setPreviewMode(true);
    const html = EditorService.parseMarkdown('**bold text**');
    expect(state.isPreviewMode).toBe(true);
    expect(html).toContain('<strong>bold text</strong>');
  });

  it('search matches are stored and removed individually', () => {
    const text = 'Hello world. Hello again.';
    const matches = [...text.matchAll(/Hello/g)].map((m) => ({
      offset: m.index,
      length: m[0].length,
    }));
    state.setMatches(matches);
    expect(state.currentMatches).toHaveLength(2);

    state.removeMatch(0);
    expect(state.currentMatches).toHaveLength(1);
    expect(state.currentMatches[0].offset).toBe(13);
  });

  it('history is accessible through state and records editor changes', () => {
    state.history.push('initial text');
    const ta = { value: 'initial text', selectionStart: 0, selectionEnd: 12 };
    const result = EditorService.toggleStyle(ta, '**', '**');
    state.history.push(result);

    expect(state.history.undo()).toBe('initial text');
  });

  it('setTyping(true) does not affect currentMatches or preview mode', () => {
    state.setMatches([{ offset: 0, length: 5 }]);
    state.setPreviewMode(true);
    state.setTyping(true);

    expect(state.currentMatches).toHaveLength(1);
    expect(state.isPreviewMode).toBe(true);
  });
});
