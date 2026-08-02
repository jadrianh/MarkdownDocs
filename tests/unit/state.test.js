import { describe, it, expect, beforeEach } from 'vitest';
import { AppState } from '../../src/core/state.js';

describe('AppState', () => {
  let state;
  beforeEach(() => {
    state = new AppState();
  });

  it('starts in editor mode (not preview)', () => {
    expect(state.isPreviewMode).toBe(false);
  });

  it('starts with typing false', () => {
    expect(state.isTyping).toBe(false);
  });

  it('starts with empty matches', () => {
    expect(state.currentMatches).toEqual([]);
  });

  it('setPreviewMode(true) activates preview', () => {
    state.setPreviewMode(true);
    expect(state.isPreviewMode).toBe(true);
  });

  it('setPreviewMode(false) returns to editor mode', () => {
    state.setPreviewMode(true);
    state.setPreviewMode(false);
    expect(state.isPreviewMode).toBe(false);
  });

  it('setTyping(true) marks typing as active', () => {
    state.setTyping(true);
    expect(state.isTyping).toBe(true);
  });

  it('setMatches() stores the array', () => {
    state.setMatches([{ offset: 0 }, { offset: 5 }]);
    expect(state.currentMatches).toHaveLength(2);
  });

  it('removeMatch() deletes the correct entry by index', () => {
    state.setMatches(['a', 'b', 'c']);
    state.removeMatch(1);
    expect(state.currentMatches).toEqual(['a', 'c']);
  });

  it('removeMatch(0) deletes the first entry', () => {
    state.setMatches(['a', 'b']);
    state.removeMatch(0);
    expect(state.currentMatches).toEqual(['b']);
  });

  it('initializes with a HistoryManager instance', () => {
    expect(state.history).toBeDefined();
    expect(typeof state.history.push).toBe('function');
  });
});
