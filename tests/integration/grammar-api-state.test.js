import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LanguageToolAPI } from '../../src/api/languageTool.Client.js';
import { AppState } from '../../src/core/state.js';

const mockMatches = [
  {
    offset: 0,
    length: 4,
    message: '"Hola" should be "Hello"',
    replacements: [{ value: 'Hello' }],
  },
  {
    offset: 12,
    length: 5,
    message: '"mundo" should be "world"',
    replacements: [{ value: 'world' }],
  },
];

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ matches: mockMatches }),
  });
});

describe('LanguageToolAPI', () => {
  it('returns matches array from a successful API response', async () => {
    const result = await LanguageToolAPI.check('Hola mundo fixed', 'es');
    expect(result.matches).toHaveLength(2);
    expect(result.matches[0].offset).toBe(0);
    expect(result.matches[1].offset).toBe(12);
  });

  it('returns empty matches for blank text without calling fetch', async () => {
    const result = await LanguageToolAPI.check('   ', 'es');
    expect(result.matches).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('calls the correct LanguageTool endpoint', async () => {
    await LanguageToolAPI.check('some text', 'en-US');
    expect(fetch).toHaveBeenCalledWith(
      'https://api.languagetool.org/v2/check',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('throws when the API response is not ok', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(LanguageToolAPI.check('texto', 'es')).rejects.toThrow();
  });

  it('throws when fetch itself fails (network error)', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    await expect(LanguageToolAPI.check('texto', 'es')).rejects.toThrow('Network error');
  });
});

describe('Grammar API → State Integration', () => {
  let state;
  beforeEach(() => {
    state = new AppState();
  });

  it('API matches are stored correctly in state after check()', async () => {
    const data = await LanguageToolAPI.check('Hola mundo fixed', 'es');
    state.setMatches(data.matches);
    expect(state.currentMatches).toHaveLength(2);
    expect(state.currentMatches[0].message).toContain('Hola');
  });

  it('applying a fix recalculates subsequent match offsets', () => {
    state.setMatches([
      { offset: 0, length: 4 },
      { offset: 12, length: 4 },
    ]);

    const replacement = 'Hello';
    const matchIndex = 0;
    const match = state.currentMatches[matchIndex];
    const lengthDiff = replacement.length - match.length;

    for (let i = 0; i < state.currentMatches.length; i++) {
      if (i === matchIndex) continue;
      if (state.currentMatches[i].offset > match.offset) {
        state.currentMatches[i].offset += lengthDiff;
      }
    }
    state.removeMatch(matchIndex);

    expect(state.currentMatches).toHaveLength(1);
    expect(state.currentMatches[0].offset).toBe(13);
  });

  it('applying a shorter replacement shifts subsequent offsets backwards', () => {
    state.setMatches([
      { offset: 0, length: 8 },
      { offset: 10, length: 4 },
    ]);

    const replacement = 'hi';
    const matchIndex = 0;
    const match = state.currentMatches[matchIndex];
    const lengthDiff = replacement.length - match.length;

    for (let i = 0; i < state.currentMatches.length; i++) {
      if (i === matchIndex) continue;
      if (state.currentMatches[i].offset > match.offset) {
        state.currentMatches[i].offset += lengthDiff;
      }
    }
    state.removeMatch(matchIndex);

    expect(state.currentMatches[0].offset).toBe(4);
  });

  it('removing all matches empties state', async () => {
    const data = await LanguageToolAPI.check('Hola mundo fixed', 'es');
    state.setMatches(data.matches);

    [...data.matches].forEach((_, i) => state.removeMatch(0));
    expect(state.currentMatches).toHaveLength(0);
  });
});
