import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fc from 'fast-check';
import { act, fireEvent, screen } from '@testing-library/react';
import Hero from '@/components/hero/Hero';
import HeroStage from '@/components/hero/HeroStage';
import { AOSSIE_URL, PLAY_STORE_URL } from '@/config/links';
import { setIntersecting, setReducedMotion } from '../utils/browser';
import { locales, messages, renderWithIntl } from '../utils/intl';

const hero = () => document.getElementById('top')!;
const px = () => hero().style.getPropertyValue('--px');
const py = () => hero().style.getPropertyValue('--py');

/** Runs animation frames for `ms` of fake time */
const frames = (ms: number) => act(() => vi.advanceTimersByTime(ms));

describe('Hero pointer parallax', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('eases --px/--py toward the mouse position, then lets the loop sleep', () => {
    renderWithIntl(<Hero />);
    expect(px()).toBe('');
    fireEvent.pointerMove(window, { pointerType: 'mouse', clientX: window.innerWidth, clientY: 0 });
    frames(16);
    const first = Number(px());
    expect(first).toBeGreaterThan(0);
    expect(first).toBeLessThan(0.1);
    expect(Number(py())).toBeLessThan(0);

    frames(20_000);
    expect(Number(px())).toBeCloseTo(1, 2);
    expect(Number(py())).toBeCloseTo(-1, 2);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('eases back to centre when the pointer leaves the page', () => {
    renderWithIntl(<Hero />);
    fireEvent.pointerMove(window, { pointerType: 'mouse', clientX: 0, clientY: window.innerHeight });
    frames(20_000);
    expect(Number(px())).toBeCloseTo(-1, 2);
    fireEvent.pointerLeave(document.documentElement);
    frames(20_000);
    expect(Math.abs(Number(px()))).toBeLessThan(0.001);
    expect(Math.abs(Number(py()))).toBeLessThan(0.001);
  });

  it('ignores touch pointer events and follows finger drags at half strength instead', () => {
    renderWithIntl(<Hero />);
    fireEvent.pointerMove(window, { pointerType: 'touch', clientX: window.innerWidth, clientY: 0 });
    frames(100);
    expect(px()).toBe('');

    fireEvent.touchStart(window, { touches: [{ clientX: 100, clientY: 100 }] });
    // A drag of a full screen width is clamped, then halved
    fireEvent.touchMove(window, { touches: [{ clientX: 100 + window.innerWidth, clientY: 100 }] });
    frames(20_000);
    expect(Number(px())).toBeCloseTo(0.5, 2);
    expect(Math.abs(Number(py()))).toBeLessThan(0.001);

    fireEvent.touchEnd(window);
    frames(20_000);
    expect(Math.abs(Number(px()))).toBeLessThan(0.001);
  });

  it('pauses while the hero is off screen and resumes when it returns', () => {
    renderWithIntl(<Hero />);
    act(() => setIntersecting(hero(), false));
    fireEvent.pointerMove(window, { pointerType: 'mouse', clientX: window.innerWidth, clientY: 0 });
    frames(1000);
    expect(px()).toBe('');
    expect(vi.getTimerCount()).toBe(0);

    act(() => setIntersecting(hero(), true));
    frames(20_000);
    expect(Number(px())).toBeCloseTo(1, 2);
  });

  it('does nothing with reduced motion', () => {
    setReducedMotion(true);
    renderWithIntl(<Hero />);
    fireEvent.pointerMove(window, { pointerType: 'mouse', clientX: window.innerWidth, clientY: 0 });
    frames(1000);
    expect(px()).toBe('');
  });

  it('removes its listeners when unmounted', () => {
    const { unmount } = renderWithIntl(<Hero />);
    unmount();
    fireEvent.pointerMove(window, { pointerType: 'mouse', clientX: window.innerWidth, clientY: 0 });
    fireEvent.touchMove(window, { touches: [{ clientX: 10, clientY: 10 }] });
    expect(vi.getTimerCount()).toBe(0);
  });

  it('property: --px and --py stay within [-1, 1] for any pointer path', () => {
    const { unmount } = renderWithIntl(<Hero />);
    const coordinate = fc.integer({ min: -20_000, max: 20_000 });
    fc.assert(
      fc.property(fc.array(fc.tuple(coordinate, coordinate, fc.integer({ min: 0, max: 400 })), { minLength: 1, maxLength: 8 }), (moves) => {
        for (const [x, y, wait] of moves) {
          fireEvent.pointerMove(window, { pointerType: 'mouse', clientX: x, clientY: y });
          frames(wait);
          for (const value of [px(), py()]) {
            expect(Math.abs(Number(value || 0))).toBeLessThanOrEqual(1);
          }
        }
      }),
      { numRuns: 40 },
    );
    unmount();
  });
});

describe('HeroStage', () => {
  it.each(locales)('renders the %s headline, stats and band from the catalog', (locale) => {
    const t = messages(locale).Hero;
    renderWithIntl(<HeroStage />, { locale });
    const heading = screen.getByRole('heading', { level: 1 });
    // Rich text: the <hl> chunks become highlighted spans, not literal tags
    expect(heading.textContent).toBe(
      [t.mottoLine1, t.mottoLine2].map((line) => line.replace(/<\/?hl>/g, '')).join(''),
    );
    expect(heading.querySelectorAll('.text-highlight')).toHaveLength(2);
    expect(screen.getByText(t.dailyTitle).nextElementSibling?.textContent).toBe(t.dailyValue);
    expect(screen.getByText(t.safetyTitle).nextElementSibling?.textContent).toBe(t.safetyValue);
    expect(screen.getByText(t.heroBand)).toBeDefined();
    expect(screen.getByText(t.ghostWordmark)).toBeDefined();
    expect(screen.getByAltText(t.modelAlt).getAttribute('src')).toBe('/brand/assets/hero-model.webp');
  });

  it('credits AOSSIE with an external link', () => {
    renderWithIntl(<HeroStage />);
    const link = screen.getByRole('link', { name: 'AOSSIE' });
    expect(link.getAttribute('href')).toBe(`${AOSSIE_URL}/`);
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.parentElement?.textContent).toBe('Made By AOSSIE');
  });

  it('turns the subtitle line break tag into a <br>', () => {
    renderWithIntl(<HeroStage />);
    const subtitle = screen.getByText(/Personalized 5–7 minute/);
    expect(subtitle.querySelector('br')).not.toBeNull();
    expect(subtitle.textContent).not.toContain('<br>');
  });

  it.each(locales)('offers the %s Play Store download on the liquid-metal button', (locale) => {
    const t = messages(locale).Hero;
    renderWithIntl(<HeroStage />, { locale });
    const download = screen.getByRole('link', { name: t.downloadFrame });
    expect(download.getAttribute('href')).toBe(PLAY_STORE_URL);
    expect(download.getAttribute('target')).toBe('_blank');
    expect(download.getAttribute('title')).toBe(t.downloadFrame);
    expect(download.textContent).toContain(t.downloadNow);
  });
});
