import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fc from 'fast-check';
import { act, fireEvent, screen, within } from '@testing-library/react';
import Features from '@/components/sections/Features';
import { setIntersecting, setReducedMotion } from '../utils/browser';
import { locales, messages, renderWithIntl } from '../utils/intl';

const en = messages('en');
const t = en.Features;
const tx = en.Exercises;

// Plain selectors keep the property runs fast; role queries over the whole section are slow in jsdom
const group = (name: string) => document.querySelector<HTMLElement>(`[role="group"][aria-label="${name}"]`)!;
const chip = (groupName: string, label: string) =>
  [...group(groupName).querySelectorAll('button')].find((b) => b.textContent === label)!;
const pressed = (name: string) =>
  [...group(name).querySelectorAll('button')].filter((b) => b.getAttribute('aria-pressed') === 'true').map((b) => b.textContent);

/** The personalized demo's session preview */
function previewRows() {
  const list = screen.getByText(t.personalized.previewTitle).closest('[aria-live]')!.querySelector('ol')!;
  return [...list.querySelectorAll('li')].map((li) => li.children[1].textContent);
}
const previewMeta = () => screen.getByText(t.personalized.previewTitle).nextElementSibling!.textContent;

describe('Features section', () => {
  it.each(locales)('renders every card title in %s', (locale) => {
    const f = messages(locale).Features;
    renderWithIntl(<Features />, { locale });
    const section = document.getElementById('features')!;
    expect(section.getAttribute('aria-labelledby')).toBe('features-title');
    const titles = within(section)
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent);
    expect(titles).toEqual([
      f.personalized.title,
      f.short.title,
      f.voice.title,
      f.adaptive.title,
      f.safety.title,
      f.variety.title,
      f.offline.title,
      f.progress.title,
      f.more.title,
    ]);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(f.title.replace(/<\/?hl>/g, ''));
  });

  describe('personalized demo', () => {
    it('starts with a bodyweight core strength session', () => {
      renderWithIntl(<Features />);
      expect(pressed(t.personalized.goalLabel)).toEqual(['Strength']);
      expect(pressed(t.personalized.regionLabel)).toEqual(['Core']);
      expect(pressed(t.personalized.equipmentLabel)).toEqual(['None']);
      expect(previewRows()).toEqual([tx.plank, tx.deadBug, tx.bicycleCrunch]);
      expect(previewMeta()).toBe('3 exercises · 6 min');
    });

    it('swaps in dumbbell moves for strength', () => {
      renderWithIntl(<Features />);
      fireEvent.click(chip(t.personalized.equipmentLabel, 'Dumbbells'));
      fireEvent.click(chip(t.personalized.regionLabel, 'Upper body'));
      expect(previewRows()).toEqual([tx.dumbbellRow, tx.shoulderPress, tx.bicepCurl]);
      expect(screen.getAllByText(t.personalized.dose.strength)).toHaveLength(3);
    });

    it('builds bodyweight cardio sessions with their own length and dose', () => {
      renderWithIntl(<Features />);
      fireEvent.click(chip(t.personalized.goalLabel, 'Cardio'));
      fireEvent.click(chip(t.personalized.regionLabel, 'Lower body'));
      expect(previewRows()).toEqual([tx.jumpSquats, tx.skaters, tx.highKnees]);
      expect(previewMeta()).toBe('3 exercises · 7 min');
      expect(screen.getAllByText(t.personalized.dose.cardio)).toHaveLength(3);
    });

    it('property: any sequence of picks yields three distinct moves, one pressed chip per group and the goal’s length', () => {
      const goals = ['strength', 'mobility', 'cardio'] as const;
      const regions = ['upper', 'core', 'lower'] as const;
      const gear = ['none', 'dumbbells'] as const;
      const pick = fc.oneof(
        fc.constantFrom(...goals).map((v) => [t.personalized.goalLabel, t.personalized.goals[v], v] as const),
        fc.constantFrom(...regions).map((v) => [t.personalized.regionLabel, t.personalized.regions[v], v] as const),
        fc.constantFrom(...gear).map((v) => [t.personalized.equipmentLabel, t.personalized.equipment[v], v] as const),
      );
      const minutes = { strength: 6, mobility: 5, cardio: 7 };
      renderWithIntl(<Features />);
      fc.assert(
        fc.property(fc.array(pick, { maxLength: 6 }), (picks) => {
          // One render carries over between runs, so each run starts from wherever the last one left off
          let goal = goals.find((g) => pressed(t.personalized.goalLabel)[0] === t.personalized.goals[g])!;
          for (const [label, name, value] of picks) {
            fireEvent.click(chip(label, name));
            if (value in minutes) goal = value as keyof typeof minutes;
          }
          const rows = previewRows();
          expect(rows).toHaveLength(3);
          expect(new Set(rows).size).toBe(3);
          for (const label of [t.personalized.goalLabel, t.personalized.regionLabel, t.personalized.equipmentLabel]) {
            expect(pressed(label)).toHaveLength(1);
          }
          expect(previewMeta()).toBe(`3 exercises · ${minutes[goal]} min`);
        }),
        { numRuns: 30 },
      );
    });
  });

  describe('voice demo', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    const voicePanel = () => group(t.voice.hint).parentElement!;
    const said = () => voicePanel().querySelector('[aria-live] p')!.textContent;

    it('cycles through the commands while on screen', () => {
      renderWithIntl(<Features />);
      expect(said()).toBe('“Skip”');
      act(() => vi.advanceTimersByTime(5000));
      // Off screen: no cycling
      expect(said()).toBe('“Skip”');
      act(() => setIntersecting(voicePanel()));
      act(() => vi.advanceTimersByTime(2600));
      expect(said()).toBe('“Repeat”');
      act(() => vi.advanceTimersByTime(2600));
      expect(said()).toBe('“Start”');
      expect(screen.getByText(t.voice.replies.start)).toBeDefined();
    });

    it('stops cycling once a command is picked, and announces it', () => {
      renderWithIntl(<Features />);
      act(() => setIntersecting(voicePanel()));
      const live = voicePanel().querySelector('[aria-live]')!;
      expect(live.getAttribute('aria-live')).toBe('off');
      fireEvent.click(chip(t.voice.hint, 'Pause'));
      expect(said()).toBe('“Pause”');
      expect(chip(t.voice.hint, 'Pause').getAttribute('aria-pressed')).toBe('true');
      expect(voicePanel().querySelector('[aria-live]')!.getAttribute('aria-live')).toBe('polite');
      act(() => vi.advanceTimersByTime(10_000));
      expect(said()).toBe('“Pause”');
      expect(screen.getByText(t.voice.replies.pause)).toBeDefined();
    });

    it('does not cycle with reduced motion', () => {
      setReducedMotion(true);
      renderWithIntl(<Features />);
      act(() => setIntersecting(voicePanel()));
      act(() => vi.advanceTimersByTime(10_000));
      expect(said()).toBe('“Skip”');
    });
  });

  describe('adaptive demo', () => {
    const levelBars = () => {
      const panel = screen.getByText(t.adaptive.next).parentElement!;
      return [...panel.querySelectorAll('span[aria-hidden] > span')].filter((s) => s.className.includes('bg-app-primary')).length;
    };

    it('raises or lowers the next session from the rating', () => {
      renderWithIntl(<Features />);
      expect(screen.getByText(t.adaptive.results.easy)).toBeDefined();
      expect(levelBars()).toBe(7);

      fireEvent.click(chip(t.adaptive.question, t.adaptive.options.hard));
      expect(screen.getByText(t.adaptive.results.hard)).toBeDefined();
      expect(levelBars()).toBe(5);
      expect(chip(t.adaptive.question, t.adaptive.options.hard).getAttribute('aria-pressed')).toBe('true');
      expect(chip(t.adaptive.question, t.adaptive.options.easy).getAttribute('aria-pressed')).toBe('false');

      fireEvent.click(chip(t.adaptive.question, t.adaptive.options.right));
      expect(screen.getByText(t.adaptive.results.right)).toBeDefined();
      expect(levelBars()).toBe(6);
      // Only the picked option carries the check mark
      expect(chip(t.adaptive.question, t.adaptive.options.right).querySelector('svg')).not.toBeNull();
      expect(chip(t.adaptive.question, t.adaptive.options.easy).querySelector('svg')).toBeNull();
    });
  });

  describe('safety demo', () => {
    const risks: Record<string, 'knee' | 'back' | 'shoulder' | null> = {
      [tx.jumpSquats]: 'knee',
      [tx.supermanHold]: 'back',
      [tx.pikePushUps]: 'shoulder',
      [tx.gluteBridge]: null,
    };
    const status = () => {
      const list = group(t.safety.label).nextElementSibling!;
      return Object.fromEntries([...list.querySelectorAll('li')].map((li) => [li.children[0].textContent, li.children[1].textContent]));
    };

    it('excludes knee-heavy moves for the default sore knee', () => {
      renderWithIntl(<Features />);
      expect(status()).toEqual({
        [tx.jumpSquats]: t.safety.excluded,
        [tx.supermanHold]: t.safety.safe,
        [tx.pikePushUps]: t.safety.safe,
        [tx.gluteBridge]: t.safety.safe,
      });
    });

    it('property: a move is excluded exactly when its injury is selected, for any toggle sequence', () => {
      const injuries = ['knee', 'back', 'shoulder'] as const;
      renderWithIntl(<Features />);
      fc.assert(
        fc.property(fc.array(fc.constantFrom(...injuries), { maxLength: 6 }), (toggles) => {
          // The model starts from the chips' current state, since one render carries over between runs
          const sore = new Set<string>(injuries.filter((i) => chip(t.safety.label, t.safety.injuries[i]).getAttribute('aria-pressed') === 'true'));
          for (const injury of toggles) {
            fireEvent.click(chip(t.safety.label, t.safety.injuries[injury]));
            if (sore.has(injury)) sore.delete(injury);
            else sore.add(injury);
          }
          for (const injury of injuries) {
            expect(chip(t.safety.label, t.safety.injuries[injury]).getAttribute('aria-pressed')).toBe(String(sore.has(injury)));
          }
          for (const [move, label] of Object.entries(status())) {
            const risk = risks[move];
            expect(label).toBe(risk && sore.has(risk) ? t.safety.excluded : t.safety.safe);
          }
        }),
        { numRuns: 30 },
      );
    });
  });

  it('shows yesterday’s moves crossed out and fresh ones in the deck', () => {
    renderWithIntl(<Features />);
    const recent = [...screen.getByText(t.variety.recent).parentElement!.querySelectorAll('.line-through')];
    expect(recent.map((el) => el.textContent)).toEqual([tx.squats, tx.plank, tx.pushUps]);
    expect(screen.getAllByText(t.variety.fresh)).toHaveLength(3);
    expect(screen.getByText(tx.skaters)).toBeDefined();
  });

  it('describes the on-device model and the zero network requests', () => {
    renderWithIntl(<Features />);
    expect(screen.getByText(t.offline.badge)).toBeDefined();
    expect(screen.getByText(t.offline.model)).toBeDefined();
    expect(screen.getByText(t.offline.requests)).toBeDefined();
  });

  it('grows the progress bars once the chart is in view, with localized day labels', () => {
    renderWithIntl(<Features />, { locale: 'hi' });
    const p = messages('hi').Features.progress;
    const chart = screen.getByText(p.sample).parentElement!.parentElement!;
    const bars = () => [...chart.querySelectorAll('.origin-bottom')];
    expect(bars()).toHaveLength(7);
    expect(bars().every((b) => b.className.includes('scale-y-0'))).toBe(true);
    // The rest day keeps a sliver and the muted colour
    expect((bars()[2] as HTMLElement).style.height).toBe('5%');
    expect(bars()[2].className).toContain('bg-border-default');
    act(() => setIntersecting(chart));
    expect(bars().every((b) => b.className.includes('scale-y-100'))).toBe(true);
    const stats = [...chart.parentElement!.querySelectorAll('dt')].map((dt) => dt.textContent);
    expect(stats).toEqual(Object.values(p.stats));
  });

  it('lists the extra features', () => {
    renderWithIntl(<Features />);
    for (const item of Object.values(t.more.items)) {
      expect(screen.getByText(item.title).nextElementSibling?.textContent).toBe(item.body);
    }
  });
});
