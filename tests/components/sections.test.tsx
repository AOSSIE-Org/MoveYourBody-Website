import { describe, it, expect } from 'vitest';
import { act, screen, within } from '@testing-library/react';
import DownloadCta from '@/components/sections/DownloadCta';
import HowItWorks from '@/components/sections/HowItWorks';
import OpenSource from '@/components/sections/OpenSource';
import Privacy from '@/components/sections/Privacy';
import {
  CONTRIBUTING_URL,
  CONTRIBUTORS_IMAGE_URL,
  GITHUB_URL,
  PLAY_STORE_URL,
  PRIVACY_POLICY_URL,
  REPO_URL,
  SOCIAL_LINKS,
} from '@/config/links';
import { setIntersecting } from '../utils/browser';
import { locales, messages, renderWithIntl } from '../utils/intl';

const plain = (rich: string) => rich.replace(/<\/?hl>/g, '');

describe('HowItWorks', () => {
  const steps = () => [...document.querySelectorAll<HTMLLIElement>('#how-it-works ol > li')];
  const rail = () => document.querySelector<HTMLElement>('#how-it-works ol > span > span')!;
  /** The screens stacked inside the pinned desktop phone */
  const desktopScreens = () =>
    [...document.querySelectorAll<HTMLElement>('#how-it-works .sticky div.absolute.inset-0')].filter((el) => el.parentElement?.classList.contains('@container'));

  it.each(locales)('numbers the five %s steps in order', (locale) => {
    const t = messages(locale).HowItWorks;
    renderWithIntl(<HowItWorks />, { locale });
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(plain(t.title));
    const titles = within(document.getElementById('how-it-works')!)
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent);
    expect(titles).toEqual(Object.values(t.steps).map((s) => s.title));
    expect(steps().map((li) => li.querySelector('p')?.textContent)).toEqual([1, 2, 3, 4, 5].map((n) => t.step.replace('{n}', String(n))));
    expect(steps().map((li) => li.firstElementChild?.textContent)).toEqual(['01', '02', '03', '04', '05']);
  });

  it('starts on the first step with a fifth of the rail filled', () => {
    renderWithIntl(<HowItWorks />);
    expect(rail().style.scale).toBe('1 0.2');
    expect(steps()[0].firstElementChild?.className).toContain('bg-highlight');
    expect(steps()[1].firstElementChild?.className).not.toContain('bg-highlight');
    expect(desktopScreens()[0].className).toContain('opacity-100');
  });

  it('follows the step crossing the middle of the viewport', () => {
    renderWithIntl(<HowItWorks />);
    act(() => setIntersecting(steps()[3]));
    expect(rail().style.scale).toBe('1 0.8');
    expect(steps()[3].firstElementChild?.className).toContain('bg-highlight');
    expect(steps()[0].firstElementChild?.className).not.toContain('bg-highlight');
    // The pinned phone shows step 4; earlier screens slide up and away, later ones wait below
    const screens = desktopScreens();
    expect(screens[3].className).toContain('opacity-100');
    expect(screens[0].className).toContain('-translate-y-6');
    expect(screens[4].className).toMatch(/(^|\s)translate-y-6/);
    // Each phone screen plays its entrance only while its step is active
    expect(screens.map((s) => s.querySelector('[data-active]')?.getAttribute('data-active'))).toEqual(['false', 'false', 'false', 'true', 'false']);

    // A step leaving the band does not change the active one
    act(() => setIntersecting(steps()[1], false));
    expect(rail().style.scale).toBe('1 0.8');
  });
});

describe('Privacy', () => {
  it.each(locales)('lists the %s privacy points and links the policy', (locale) => {
    const t = messages(locale).Privacy;
    renderWithIntl(<Privacy />, { locale });
    const section = document.getElementById('privacy')!;
    expect(section.getAttribute('aria-labelledby')).toBe('privacy-title');
    expect(document.getElementById('privacy-title')?.textContent).toBe(plain(t.title));
    for (const point of Object.values(t.points)) {
      expect(screen.getByText(point.title).nextElementSibling?.textContent).toBe(point.body);
    }
    const policy = screen.getByRole('link', { name: t.policy });
    expect(policy.getAttribute('href')).toBe(PRIVACY_POLICY_URL);
    expect(policy.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('orbits every data chip at an even angle inside the decorative vault', () => {
    renderWithIntl(<Privacy />);
    const t = messages('en').Privacy;
    const chips = Object.values(t.chips).map((label) => screen.getByText(label));
    const angles = chips.map((chip) => (chip.parentElement!.parentElement as HTMLElement).style.rotate);
    expect(angles).toEqual(['0deg', '60deg', '120deg', '180deg', '240deg', '300deg']);
    // Each label counter-rotates so it stays upright
    expect(chips.map((chip) => (chip.parentElement as HTMLElement).style.rotate)).toEqual(angles.map((a) => (a === '0deg' ? '0deg' : `-${a}`)));
    expect(screen.getByText(t.cloud).closest('[aria-hidden="true"]')).not.toBeNull();
    expect(screen.getByText(t.device)).toBeDefined();
  });
});

describe('OpenSource', () => {
  it.each(locales)('introduces the %s section and the ways to contribute', (locale) => {
    const t = messages(locale).OpenSource;
    renderWithIntl(<OpenSource />, { locale });
    expect(document.getElementById('open-source-title')?.textContent).toBe(plain(t.title));
    for (const way of Object.values(t.ways)) {
      expect(screen.getByText(way.title).nextElementSibling?.textContent).toBe(way.body);
    }
  });

  it('links each team member to GitHub with their avatar and role', () => {
    renderWithIntl(<OpenSource />);
    const team = screen.getByRole('heading', { name: 'The team' }).nextElementSibling as HTMLElement;
    const members = within(team).getAllByRole('link');
    expect(members.map((a) => a.getAttribute('href'))).toEqual(
      ['DecodeX15', 'M4dhav', 'Zahnentferner', 'Archit381', 'reach2saksham'].map((user) => `${GITHUB_URL}/${user}`),
    );
    for (const member of members) {
      const user = member.getAttribute('href')!.split('/').pop();
      const avatar = member.querySelector('img')!;
      expect(avatar.getAttribute('src')).toBe(`${GITHUB_URL}/${user}.png?size=96`);
      expect(avatar.getAttribute('alt')).toBe('');
      expect(avatar.getAttribute('loading')).toBe('lazy');
      expect(member.getAttribute('target')).toBe('_blank');
    }
    expect(within(members[0]).getByText('@DecodeX15 · Maintainer')).toBeDefined();
    expect(within(members[1]).getByText('@M4dhav · Mentor')).toBeDefined();
    expect(within(members[4]).getByText('@reach2saksham · Contributor')).toBeDefined();
  });

  it('shows the contributor avatar wall linked to the contributors graph', () => {
    renderWithIntl(<OpenSource />, { locale: 'hi' });
    const t = messages('hi').OpenSource;
    const wall = screen.getByAltText(t.contributorsAlt);
    expect(wall.getAttribute('src')).toBe(CONTRIBUTORS_IMAGE_URL);
    expect(wall.closest('a')?.getAttribute('href')).toBe(`${REPO_URL}/graphs/contributors`);
  });

  it('offers star, contributing guide and Discord links', () => {
    renderWithIntl(<OpenSource />);
    expect(screen.getByRole('link', { name: 'Star on GitHub' }).getAttribute('href')).toBe(REPO_URL);
    expect(screen.getByRole('link', { name: 'Contributing guide' }).getAttribute('href')).toBe(CONTRIBUTING_URL);
    expect(screen.getByRole('link', { name: 'Join the Discord' }).getAttribute('href')).toBe(SOCIAL_LINKS.discord);
  });

  it('exposes one copy of each stack marquee to assistive tech', () => {
    renderWithIntl(<OpenSource />);
    const rows = [...document.querySelectorAll('#open-source ul.w-max')];
    expect(rows).toHaveLength(2);
    expect(rows[0].className).toMatch(/animate-marquee$/);
    expect(rows[1].className).toContain('animate-marquee-reverse');
    const exposed = (row: Element) => [...row.querySelectorAll('li')].filter((li) => !li.hasAttribute('aria-hidden')).map((li) => li.textContent);
    expect(exposed(rows[0])).toEqual(['Flutter', 'Riverpod', 'GoRouter', 'SQLite (sqflite)', 'Lottie', 'FL Chart', 'Video Player']);
    expect(rows[0].querySelectorAll('li')).toHaveLength(28);
    expect(exposed(rows[1])[0]).toBe('ONNX Runtime');
  });
});

describe('DownloadCta', () => {
  it.each(locales)('offers the %s Play Store badge and the source', (locale) => {
    const t = messages(locale).Download;
    renderWithIntl(<DownloadCta />, { locale });
    expect(document.getElementById('download-title')?.textContent).toBe(plain(t.title));
    const play = screen.getByRole('link', { name: new RegExp(`^${t.playTop}\s*${t.playBottom}$`) });
    expect(play.getAttribute('href')).toBe(PLAY_STORE_URL);
    expect(screen.getByRole('link', { name: t.source }).getAttribute('href')).toBe(REPO_URL);
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(Object.values(t.notes));
  });

  it('shows two decorative phones, the session without the excluded move', () => {
    renderWithIntl(<DownloadCta />);
    const phones = document.querySelector('#download [aria-hidden="true"].relative')!;
    expect(phones.querySelectorAll('[data-active="true"]')).toHaveLength(2);
    expect(within(phones as HTMLElement).queryByText(messages('en').Mock.session.excluded)).toBeNull();
    expect(within(phones as HTMLElement).getByText(messages('en').Mock.session.start)).toBeDefined();
  });
});
