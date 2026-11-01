import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { FeedbackScreen, OnboardingScreen, SessionScreen, UnderstandScreen, WorkoutScreen } from '@/components/mockups/AppScreens';
import { setReducedMotion } from '../utils/browser';
import { locales, messages, renderWithIntl } from '../utils/intl';

const root = (container: HTMLElement) => container.querySelector('[data-active]')!;

afterEach(() => {
  delete (SVGSVGElement.prototype as Partial<SVGSVGElement>).pauseAnimations;
});

describe('App screen mockups', () => {
  it.each([OnboardingScreen, UnderstandScreen, SessionScreen, WorkoutScreen, FeedbackScreen])(
    '%o marks itself active only when asked, with a status bar',
    (Screen) => {
      const { container, rerender } = renderWithIntl(<Screen />);
      expect(root(container).getAttribute('data-active')).toBe('false');
      expect(container.textContent).toContain('9:41');
      rerender(<Screen active />);
      expect(root(container).getAttribute('data-active')).toBe('true');
    },
  );

  it.each(locales)('shows the %s onboarding goals with the first two selected', (locale) => {
    const t = messages(locale).Mock.onboarding;
    renderWithIntl(<OnboardingScreen active />, { locale });
    const goals = Object.values(t.goals).map((label) => screen.getByText(label));
    expect(goals.map((g) => g.querySelector('svg') !== null)).toEqual([true, true, false, false]);
    expect(screen.getByText(t.continue)).toBeDefined();
    expect(screen.getByText(t.knee).className).toContain('border-app-primary-light');
  });

  it('lights up the embedding and its tag scores when active', () => {
    const { container, rerender } = renderWithIntl(<UnderstandScreen />);
    const dots = () => [...container.querySelectorAll<HTMLElement>('.grid-cols-12 > span')];
    expect(dots()).toHaveLength(48);
    expect(dots().every((d) => d.style.opacity === '0.12')).toBe(true);
    rerender(<UnderstandScreen active />);
    expect(dots().every((d) => Number(d.style.opacity) >= 0.15 && Number(d.style.opacity) <= 1)).toBe(true);
    expect(screen.getByText('0.82')).toBeDefined();
    expect(screen.getByText(`“${messages('en').Mock.understand.input}”`)).toBeDefined();
  });

  it('lists the session with today highlighted, and the excluded move only when asked', () => {
    const t = messages('en').Mock.session;
    const { rerender, container } = renderWithIntl(<SessionScreen active />);
    expect(screen.getByText(t.excluded)).toBeDefined();
    expect(screen.getByText(messages('en').Exercises.jumpSquats).className).toContain('line-through');
    const days = [...container.querySelectorAll('.justify-between.gap-\\[1\\.6cqw\\] > div')];
    expect(days).toHaveLength(6);
    expect(days.at(-1)!.className).toContain('bg-white');
    expect(days.slice(0, -1).every((d) => !d.className.includes('bg-white'))).toBe(true);
    expect(screen.getByText(t.levels.intermediate)).toBeDefined();
    rerender(<SessionScreen active excluded={false} />);
    expect(screen.queryByText(t.excluded)).toBeNull();
  });

  it('pauses the exercise figure animation for reduced motion', () => {
    const pause = vi.fn();
    SVGSVGElement.prototype.pauseAnimations = pause;
    renderWithIntl(<WorkoutScreen active />);
    expect(pause).not.toHaveBeenCalled();
    setReducedMotion(true);
    renderWithIntl(<WorkoutScreen active />);
    expect(pause).toHaveBeenCalledTimes(1);
    expect(screen.getAllByText(messages('en').Exercises.gluteBridge).length).toBeGreaterThan(0);
  });

  it('fills the sixth intensity bar only once the feedback screen is active', () => {
    const lit = (container: HTMLElement) =>
      [...container.querySelectorAll('.gap-\\[1\\.2cqw\\] > span')].filter((s) => s.className.includes('bg-app-primary')).length;
    const { container, rerender } = renderWithIntl(<FeedbackScreen />);
    expect(lit(container)).toBe(5);
    rerender(<FeedbackScreen active />);
    expect(lit(container)).toBe(6);
    const options = messages('en').Mock.feedback.options;
    expect(screen.getByText(options.right).querySelector('svg')).not.toBeNull();
    expect(screen.getByText(options.easy).querySelector('svg')).toBeNull();
  });
});
