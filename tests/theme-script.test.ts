import { describe, it, expect, afterEach, vi } from 'vitest';
import { DEFAULT_THEME, THEME_STORAGE_KEY, themeInitScript } from '@/components/providers/theme-script';

const root = document.documentElement;

function run(stored?: string) {
  if (stored !== undefined) localStorage.setItem(THEME_STORAGE_KEY, stored);
  new Function(themeInitScript)();
}

afterEach(() => {
  localStorage.clear();
  root.className = '';
  root.removeAttribute('style');
  vi.restoreAllMocks();
});

describe('theme head script', () => {
  it('shares its storage key and dark default with ThemeProvider', () => {
    expect(THEME_STORAGE_KEY).toBe('theme');
    expect(DEFAULT_THEME).toBe('dark');
  });

  it('applies the dark default when nothing is saved', () => {
    run();
    expect(root.className).toBe('dark');
    expect(root.style.colorScheme).toBe('dark');
  });

  it.each(['dark', 'light'] as const)('applies a saved %s theme and its colour scheme', (theme) => {
    root.className = 'font-var light dark';
    run(theme);
    expect(root.className).toBe(`font-var ${theme}`);
    expect(root.style.colorScheme).toBe(theme);
  });

  it('leaves the page alone for an unknown saved value', () => {
    run('system');
    expect(root.className).toBe('');
    expect(root.getAttribute('style')).toBeNull();
  });

  it('falls back to the dark default when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => run()).not.toThrow();
    expect(root.className).toBe('dark');
    expect(root.style.colorScheme).toBe('dark');
  });
});
