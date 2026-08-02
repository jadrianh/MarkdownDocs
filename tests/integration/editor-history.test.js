import { describe, it, expect, beforeEach } from 'vitest';
import { HistoryManager } from '../../src/editor/history.js';
import { EditorService } from '../../src/editor/editor.service.js';

describe('Editor ↔ History Integration', () => {
  let history;
  beforeEach(() => {
    history = new HistoryManager();
  });

  it('typing → bold → undo restores previous content', () => {
    history.push('Mi documento');

    const ta = { value: 'Mi documento', selectionStart: 3, selectionEnd: 12 };
    const afterBold = EditorService.toggleStyle(ta, '**', '**');
    history.push(afterBold);

    expect(history.undo()).toBe('Mi documento');
    expect(history.undo()).toBe('');
    expect(history.redo()).toBe('Mi documento');
  });

  it('list transformation is saved and undoable', () => {
    history.push('alpha\nbeta');
    const ta = { value: 'alpha\nbeta', selectionStart: 0, selectionEnd: 10 };
    const result = EditorService.makeList(ta, 'unordered');
    history.push(result);

    expect(history.undo()).toBe('alpha\nbeta');
  });

  it('multiple transformations stack correctly in history', () => {
    const steps = ['# Título', '# Título\n**bold**', '# Título\n**bold**\n- item'];
    steps.forEach((s) => history.push(s));

    expect(history.index).toBe(3);

    history.undo();
    history.undo();
    expect(history.undo()).toBe('');
  });

  it('redo is cleared when a new change is pushed after undo', () => {
    history.push('a');
    history.push('b');
    history.undo();
    history.push('c');

    // redo no debe traer 'b'
    expect(history.redo()).toBeNull();
    expect(history.history).toEqual(['', 'a', 'c']);
  });
});
