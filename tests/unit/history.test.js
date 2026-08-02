import { describe, it, expect, beforeEach } from 'vitest';
import { HistoryManager } from '../../src/editor/history.js';

describe('HistoryManager', () => {
  let h;
  beforeEach(() => {
    h = new HistoryManager();
  });

  it('starts with one empty entry at index 0', () => {
    expect(h.history).toEqual(['']);
    expect(h.index).toBe(0);
  });

  it('push() appends new content', () => {
    h.push('# Hello');
    expect(h.history).toHaveLength(2);
    expect(h.index).toBe(1);
  });

  it('push() does not duplicate identical content', () => {
    h.push('same');
    h.push('same');
    expect(h.history).toHaveLength(2);
  });

  it('undo() returns previous content', () => {
    h.push('# Hello');
    expect(h.undo()).toBe('');
    expect(h.index).toBe(0);
  });

  it('undo() returns null at the start', () => {
    expect(h.undo()).toBeNull();
  });

  it('redo() restores content after undo', () => {
    h.push('# Hello');
    h.undo();
    expect(h.redo()).toBe('# Hello');
  });

  it('redo() returns null at the end', () => {
    h.push('# Hello');
    expect(h.redo()).toBeNull();
  });

  it('push() after undo truncates future entries', () => {
    h.push('a');
    h.push('b');
    h.undo();
    h.push('c');
    expect(h.history).toEqual(['', 'a', 'c']);
  });

  it('respects the entry limit', () => {
    const limited = new HistoryManager(3);
    ['a', 'b', 'c', 'd'].forEach((v) => limited.push(v));
    expect(limited.history.length).toBeLessThanOrEqual(3);
  });
});
