import { describe, it, expect, afterEach } from 'vitest';
import { act, fireEvent, screen, within } from '@testing-library/react';
import DockNavbar from '@/components/dock/DockNavbar';
import { PLAY_STORE_URL } from '@/config/links';
import { observersOf, setIntersecting } from '../utils/browser';
import { messages, renderWithIntl } from '../utils/intl';

const sectionIds = ['features', 'how-it-works', 'privacy', 'open-source'];

/** The landing sections the dock watches, as the home page renders them */
function mountSections() {
  for (const id of ['top', 'manifesto', ...sectionIds]) {
    const el = document.createElement('section');
    el.id = id;
    document.body.appendChild(el);
  }
}

afterEach(() => {
  document.querySelectorAll('section').forEach((el) => el.remove());
});

/**
 * Dock links carry their label twice (shown from lg, screen-reader-only below it). jsdom applies no
 * CSS, so their computed name repeats the label; this matches one or more copies.
 */
const named = (label: string) => new RegExp(`^(${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})+$`);

const menuButton = () => screen.getByRole('button', { name: /menu/i });
const mobileMenu = () => document.getElementById('mobile-menu')!;

describe('DockNavbar', () => {
  it('labels the navigation and the section links from the English catalog', () => {
    renderWithIntl(<DockNavbar />);
    const nav = screen.getByRole('navigation', { name: 'Primary navigation' });
    expect(within(nav).getByRole('link', { name: 'MoveYourBody - back to top' }).getAttribute('href')).toBe('#top');
    // Each section appears in the tablet dock and in the phone menu
    expect(within(nav).getAllByRole('link', { name: named('How it works') })).toHaveLength(2);
  });

  it('uses the Hindi catalog on Hindi pages', () => {
    renderWithIntl(<DockNavbar />, { locale: 'hi' });
    const nav = screen.getByRole('navigation', { name: messages('hi').Navbar.primary });
    expect(within(nav).getAllByRole('link', { name: named(messages('hi').Navbar.privacy), hidden: true })).toHaveLength(2);
    expect(screen.getByRole('button', { name: messages('hi').Navbar.openMenu })).toBeDefined();
  });

  it('links to in-page anchors on the home page', () => {
    renderWithIntl(<DockNavbar />);
    const hrefs = screen.getAllByRole('link', { name: named('Features'), hidden: true }).map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['#features', '#features']);
    expect(screen.getAllByRole('link', { name: named('Open source') })[0].getAttribute('href')).toBe('#open-source');
  });

  it.each(['en', 'hi'] as const)('links back to the %s home page sections from another page', (locale) => {
    renderWithIntl(<DockNavbar />, { locale, path: '/privacy' });
    const nav = screen.getByRole('navigation');
    const hrefs = within(nav)
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'))
      .filter((href) => href?.includes('#') && href !== '#top');
    expect(new Set(hrefs)).toEqual(new Set(sectionIds.map((id) => `/${locale}#${id}`)));
  });

  it('opens the Play Store download in a new tab', () => {
    renderWithIntl(<DockNavbar />);
    const download = screen.getByRole('link', { name: 'Download App' });
    expect(download.getAttribute('href')).toBe(PLAY_STORE_URL);
    expect(download.getAttribute('target')).toBe('_blank');
    expect(download.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('toggles the phone menu and its accessible state', () => {
    renderWithIntl(<DockNavbar />);
    expect(menuButton().getAttribute('aria-expanded')).toBe('false');
    expect(menuButton().getAttribute('aria-controls')).toBe('mobile-menu');
    expect(mobileMenu().hasAttribute('inert')).toBe(true);

    fireEvent.click(menuButton());
    expect(menuButton().getAttribute('aria-expanded')).toBe('true');
    expect(menuButton().getAttribute('aria-label')).toBe('Close menu');
    expect(mobileMenu().hasAttribute('inert')).toBe(false);
    expect(mobileMenu().className).toContain('pointer-events-auto');

    fireEvent.click(menuButton());
    expect(menuButton().getAttribute('aria-label')).toBe('Open menu');
    expect(mobileMenu().hasAttribute('inert')).toBe(true);
  });

  it('closes the menu on Escape but not on other keys', () => {
    renderWithIntl(<DockNavbar />);
    fireEvent.click(menuButton());
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(menuButton().getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(menuButton().getAttribute('aria-expanded')).toBe('false');
  });

  it('closes the menu on a tap outside the dock, not inside it', () => {
    renderWithIntl(<DockNavbar />);
    fireEvent.click(menuButton());
    fireEvent.pointerDown(mobileMenu());
    expect(menuButton().getAttribute('aria-expanded')).toBe('true');
    fireEvent.pointerDown(document.body);
    expect(menuButton().getAttribute('aria-expanded')).toBe('false');
  });

  it('closes the menu when a section is picked from it', () => {
    renderWithIntl(<DockNavbar />);
    fireEvent.click(menuButton());
    fireEvent.click(within(mobileMenu()).getByRole('link', { name: named('Privacy') }));
    expect(menuButton().getAttribute('aria-expanded')).toBe('false');
  });

  it('marks the section crossing the viewport as the current location', () => {
    mountSections();
    renderWithIntl(<DockNavbar />);
    const privacyLinks = () => screen.getAllByRole('link', { name: named('Privacy'), hidden: true });
    expect(privacyLinks().every((a) => !a.hasAttribute('aria-current'))).toBe(true);

    act(() => setIntersecting(document.getElementById('privacy')!));
    expect(privacyLinks().map((a) => a.getAttribute('aria-current'))).toEqual(['location', 'location']);
    expect(within(mobileMenu()).getByRole('link', { name: named('Privacy'), hidden: true }).className).toContain('bg-card-bg');
    expect(screen.getAllByRole('link', { name: named('Features'), hidden: true }).every((a) => !a.hasAttribute('aria-current'))).toBe(true);

    // A section leaving the band does not move the highlight
    act(() => setIntersecting(document.getElementById('features')!, false));
    expect(privacyLinks()[0].getAttribute('aria-current')).toBe('location');

    act(() => setIntersecting(document.getElementById('how-it-works')!));
    expect(screen.getAllByRole('link', { name: named('How it works') })[0].getAttribute('aria-current')).toBe('location');
    expect(privacyLinks()[0].hasAttribute('aria-current')).toBe(false);

    // Scrolling back to the hero clears it
    act(() => setIntersecting(document.getElementById('top')!));
    expect(document.querySelectorAll('[aria-current]')).toHaveLength(0);
  });

  it('stops watching the sections when unmounted', () => {
    mountSections();
    const { unmount } = renderWithIntl(<DockNavbar />);
    const privacy = document.getElementById('privacy')!;
    expect(observersOf(privacy)).toBeGreaterThan(0);
    unmount();
    expect(observersOf(privacy)).toBe(0);
  });
});
