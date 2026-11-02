import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fc from 'fast-check';
import { act, cleanup, render, screen } from '@testing-library/react';
import Manifesto from '@/components/sections/Manifesto';
import { CountUp } from '@/components/ui/CountUp';
import { setIntersecting, setReducedMotion } from '../utils/browser';
import { locales, messages, renderWithIntl } from '../utils/intl';

describe('Manifesto', () => {
  it.each(locales)('lights the %s lead in the accent colour, then breaks to the body copy', (locale) => {
    const t = messages(locale).Manifesto;
    renderWithIntl(<Manifesto />, { locale });
    const words = [...document.querySelectorAll<HTMLElement>('.scroll-words .word')];
    const lead = t.lead.split(' ');
    expect(words).toHaveLength(lead.length + t.text.split(' ').length);
    expect(words.map((w) => w.textContent!.trim()).join(' ')).toBe(`${t.lead} ${t.text}`);
    expect(words.filter((w) => w.className.includes('text-highlight'))).toHaveLength(lead.length);
    expect(words[lead.length - 1].querySelector('br')).not.toBeNull();
    expect(document.querySelectorAll('.scroll-words br')).toHaveLength(1);
    expect(screen.getByRole('region', { name: t.eyebrow }).id).toBe('manifesto');
  });

  it('spreads the word reveals evenly across the scroll range', () => {
    renderWithIntl(<Manifesto />);
    const ranges = [...document.querySelectorAll<HTMLElement>('.scroll-words .word')].map((w) =>
      Number(/cover ([\d.]+)%/.exec(w.style.getPropertyValue('animation-range'))?.[1]),
    );
    expect(ranges[0]).toBe(12);
    expect(ranges.every((r, i) => i === 0 || r > ranges[i - 1])).toBe(true);
    expect(ranges.at(-1)).toBeLessThan(50);
  });

  it('repeats the marquee words four times for a seamless loop, hidden from assistive tech', () => {
    renderWithIntl(<Manifesto />);
    const marquee = document.querySelector('#manifesto > [aria-hidden="true"]')!;
    const words = [...marquee.querySelectorAll('span')].map((s) => s.textContent);
    expect(words).toEqual(Array(4).fill(messages('en').Manifesto.marquee).flat());
  });

  it('shows each stat with its label and only non-empty units', () => {
    renderWithIntl(<Manifesto />);
    const stats = messages('en').Manifesto.stats;
    const items = [...document.querySelectorAll('#manifesto dl > div')];
    expect(items.map((d) => d.querySelector('dt')?.textContent)).toEqual(Object.values(stats).map((s) => s.label));
    // The finished figure is what screen readers get
    expect(items.map((d) => d.querySelector('.sr-only')?.textContent)).toEqual(Object.values(stats).map((s) => s.value));
    expect(items.map((d) => d.querySelector('.text-highlight')?.textContent ?? null)).toEqual(['min', null, null, null]);
  });
});

describe('CountUp', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  const shown = (container: HTMLElement) => container.querySelector('[aria-hidden="true"]')!.textContent;

  it('drops to zero off screen and counts every number up once in view', () => {
    const { container } = render(<CountUp value="5–7 days, 100+" className="stat" />);
    expect(shown(container)).toBe('5–7 days, 100+');
    act(() => vi.advanceTimersByTime(16));
    expect(shown(container)).toBe('0–0 days, 0+');

    act(() => setIntersecting(container.firstElementChild!));
    act(() => vi.advanceTimersByTime(400));
    const midway = shown(container)!;
    const [a, b, c] = midway.match(/\d+/g)!.map(Number);
    expect(a).toBeGreaterThan(0);
    expect(c).toBeGreaterThan(50);
    expect(c).toBeLessThan(100);
    expect(b).toBeLessThanOrEqual(7);

    act(() => vi.advanceTimersByTime(2000));
    expect(shown(container)).toBe('5–7 days, 100+');
    expect(vi.getTimerCount()).toBe(0);
    expect((container.firstElementChild as HTMLElement).className).toBe('stat');
  });

  it('shows the final figure straight away with reduced motion', () => {
    setReducedMotion(true);
    const { container } = render(<CountUp value="42" />);
    act(() => vi.advanceTimersByTime(100));
    expect(shown(container)).toBe('42');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('cancels its animation when unmounted', () => {
    const { container, unmount } = render(<CountUp value="42" />);
    act(() => setIntersecting(container.firstElementChild!));
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('property: never changes the non-digit text, ends on the exact value and always reads it out', () => {
    // Numbers in the stats never have leading zeros (CountUp formats integers, so "05" would read "5")
    const value = fc.stringMatching(/^[0-9a-z +–.%]{0,12}$/).filter((s) => !/(^|\D)0\d/.test(s));
    fc.assert(
      fc.property(value, fc.integer({ min: 0, max: 1600 }), (text, ms) => {
        const { container } = render(<CountUp value={text} />);
        act(() => vi.advanceTimersByTime(16));
        act(() => setIntersecting(container.firstElementChild!));
        act(() => vi.advanceTimersByTime(ms));
        const midway = shown(container)!;
        expect(midway.replace(/\d+/g, '#')).toBe(text.replace(/\d+/g, '#'));
        // Each number is between 0 and its target
        const targets = (text.match(/\d+/g) ?? []).map(Number);
        (midway.match(/\d+/g) ?? []).map(Number).forEach((n, i) => {
          expect(n).toBeGreaterThanOrEqual(0);
          expect(n).toBeLessThanOrEqual(targets[i]);
        });
        act(() => vi.advanceTimersByTime(2000));
        expect(shown(container)).toBe(text);
        expect(container.querySelector('.sr-only')!.textContent).toBe(text);
        cleanup();
      }),
      { numRuns: 50 },
    );
  });
});
