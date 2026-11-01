import { describe, it, expect, afterEach, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import ThemeToggle from '@/components/dock/ThemeToggle';
import { LenisProvider } from '@/components/providers/lenis-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { mediaListenerCount, nextFrame, REDUCED_MOTION, setReducedMotion } from '../utils/browser';
import { IntlWrapper, messages, type TestLocale } from '../utils/intl';

afterEach(() => {
  document.documentElement.className = '';
  document.documentElement.removeAttribute('style');
  localStorage.clear();
});

function renderToggle(locale: TestLocale = 'en', props: { defaultTheme?: string } = {}) {
  return render(
    <IntlWrapper locale={locale}>
      <ThemeProvider {...props}>
        <ThemeToggle />
      </ThemeProvider>
    </IntlWrapper>,
  );
}

describe('ThemeProvider', () => {
  it('defaults to the dark theme on the <html> class, ignoring the system preference', () => {
    renderToggle();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('restores the theme the visitor picked last time', () => {
    localStorage.setItem('theme', 'light');
    renderToggle();
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  it('lets callers override its defaults', () => {
    renderToggle('en', { defaultTheme: 'light' });
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });
});

describe('ThemeToggle', () => {
  it('shows a placeholder until mounted, so server and client markup match', async () => {
    renderToggle();
    expect(screen.queryByRole('button')).toBeNull();
    await act(nextFrame);
    expect(screen.getByRole('button', { name: 'Toggle theme' })).toBeDefined();
  });

  it('switches dark to light and back, saving the choice', async () => {
    renderToggle();
    await act(nextFrame);
    const button = screen.getByRole('button', { name: 'Toggle theme' });
    // Dark shows the moon, which has the sparkle path
    expect(button.querySelectorAll('path')).toHaveLength(2);

    fireEvent.click(button);
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('light');
    expect(button.querySelector('circle')).not.toBeNull();

    fireEvent.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(button.querySelector('circle')).toBeNull();
  });

  it('is labelled in Hindi on Hindi pages', async () => {
    renderToggle('hi');
    await act(nextFrame);
    expect(screen.getByRole('button', { name: messages('hi').ThemeToggle.toggleTheme })).toBeDefined();
  });

  it('cancels its pending mount frame when unmounted', () => {
    vi.useFakeTimers();
    try {
      const { unmount } = renderToggle();
      // Let next-themes restore transitions (a 1ms timer), leaving only the toggle's frame (~16ms)
      vi.advanceTimersByTime(1);
      expect(vi.getTimerCount()).toBe(1);
      unmount();
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('LenisProvider', () => {
  it('turns on smooth scrolling on the root element', () => {
    render(
      <LenisProvider>
        <p>content</p>
      </LenisProvider>,
    );
    expect(screen.getByText('content')).toBeDefined();
    expect(document.documentElement.classList.contains('lenis')).toBe(true);
  });

  it('leaves native scrolling alone with reduced motion', () => {
    setReducedMotion(true);
    render(
      <LenisProvider>
        <p>content</p>
      </LenisProvider>,
    );
    expect(screen.getByText('content')).toBeDefined();
    expect(document.documentElement.classList.contains('lenis')).toBe(false);
  });

  it('follows the reduced-motion setting when it changes, and unsubscribes on unmount', () => {
    const { unmount } = render(
      <LenisProvider>
        <p>content</p>
      </LenisProvider>,
    );
    expect(document.documentElement.classList.contains('lenis')).toBe(true);
    act(() => setReducedMotion(true));
    expect(document.documentElement.classList.contains('lenis')).toBe(false);
    expect(screen.getByText('content')).toBeDefined();
    expect(mediaListenerCount(REDUCED_MOTION)).toBe(1);
    unmount();
    expect(mediaListenerCount(REDUCED_MOTION)).toBe(0);
  });
});
