import { describe, it, expect, afterEach } from 'vitest';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import SiteFooter from '@/components/sections/SiteFooter';
import {
  AOSSIE_URL,
  CONTRIBUTING_URL,
  LICENSE_URL,
  PLAY_STORE_URL,
  REPO_URL,
  SOCIAL_LINKS,
  STABILITY_NEXUS_URL,
  WEBSITE_REPO_URL,
} from '@/config/links';
import { locales, messages, renderWithIntl } from '../utils/intl';

const href = (name: string) => screen.getByRole('link', { name }).getAttribute('href');

afterEach(() => {
  document.body.style.overflow = '';
});

describe('SiteFooter', () => {
  it('spells the brand with the highlighted "Your" and shows the tagline', () => {
    renderWithIntl(<SiteFooter />);
    const brand = screen.getByText('Your');
    expect(brand.className).toContain('text-highlight');
    expect(brand.parentElement?.textContent).toBe('MoveYourBody');
    expect(screen.getByText(messages('en').Footer.tagline)).toBeDefined();
  });

  it('links product items to the landing sections in place on the home page', () => {
    renderWithIntl(<SiteFooter />);
    expect(href('Features')).toBe('#features');
    expect(href('How it works')).toBe('#how-it-works');
    expect(href('Privacy')).toBe('#privacy');
    expect(href('Download App')).toBe(PLAY_STORE_URL);
  });

  it.each(locales)('links back to the %s home page sections and keeps legal pages in that locale', (locale) => {
    const t = messages(locale);
    renderWithIntl(<SiteFooter />, { locale, path: '/support' });
    expect(href(t.Navbar.features)).toBe(`/${locale}#features`);
    expect(href(t.Navbar.howItWorks)).toBe(`/${locale}#how-it-works`);
    expect(href(t.Footer.links.privacy)).toBe(`/${locale}/privacy`);
    expect(href(t.Footer.links.terms)).toBe(`/${locale}/terms`);
    expect(screen.getByRole('link', { name: t.Footer.links.support }).getAttribute('href')).toBe(`/${locale}/support`);
  });

  it('links the project resources externally', () => {
    renderWithIntl(<SiteFooter />);
    expect(href('App source code')).toBe(REPO_URL);
    expect(href('Website source')).toBe(WEBSITE_REPO_URL);
    expect(href('Contributing')).toBe(CONTRIBUTING_URL);
    expect(href('License (GPL-3.0)')).toBe(LICENSE_URL);
    expect(screen.getByRole('link', { name: 'License (GPL-3.0)' }).getAttribute('target')).toBe('_blank');
  });

  it('lists every community channel with its icon', () => {
    renderWithIntl(<SiteFooter />);
    const community = screen.getByRole('heading', { name: 'Community' }).nextElementSibling as HTMLElement;
    const links = within(community).getAllByRole('link');
    expect(links.map((a) => a.getAttribute('href'))).toEqual(
      ['discord', 'telegram', 'x', 'linkedin', 'youtube', 'github'].map((id) => SOCIAL_LINKS[id as keyof typeof SOCIAL_LINKS]),
    );
    expect(links.map((a) => a.textContent)).toEqual(Object.values(messages('en').Footer.social));
    expect(links.every((a) => a.querySelector('svg'))).toBe(true);
  });

  it('credits AOSSIE and Stability Nexus with their logos', () => {
    renderWithIntl(<SiteFooter />);
    for (const [name, url] of [['AOSSIE', AOSSIE_URL], ['Stability Nexus', STABILITY_NEXUS_URL]]) {
      const link = screen.getByRole('link', { name });
      expect(link.getAttribute('href')).toBe(url);
      expect(link.querySelector('img')?.getAttribute('alt')).toBe('');
    }
  });

  it.each(locales)('shows the %s copyright with the current year', (locale) => {
    renderWithIntl(<SiteFooter />, { locale });
    const year = String(new Date().getFullYear());
    expect(screen.getByText(messages(locale).Footer.copyright.replace('{year}', year))).toBeDefined();
  });

  it('opens the real share dialog in the reader’s language, and Escape closes it', async () => {
    renderWithIntl(<SiteFooter />, { locale: 'hi' });
    const t = messages('hi').Share;
    await waitFor(() => expect(document.querySelector('.social-share-modal-overlay')).not.toBeNull());
    const overlay = document.querySelector<HTMLElement>('.social-share-modal-overlay')!;
    expect(overlay.classList.contains('dark')).toBe(true);
    expect(overlay.querySelector('h3')?.textContent).toBe(t.share);

    fireEvent.click(screen.getByRole('button', { name: t.trigger }));
    expect(overlay.style.display).toBe('flex');
    expect(document.body.style.overflow).toBe('hidden');
    expect((overlay.querySelector('input') as HTMLInputElement | null)?.value).toBe(window.location.href);

    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape' });
      await new Promise((r) => setTimeout(r, 400));
    });
    expect(overlay.style.display).toBe('none');
    expect(document.body.style.overflow).toBe('');
  });
});
