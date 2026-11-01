import { describe, it, expect, vi } from 'vitest';
import fc from 'fast-check';
import { cleanup, renderHook } from '@testing-library/react';
import type { ComponentType } from 'react';
import DownloadCta from '@/components/sections/DownloadCta';
import Features from '@/components/sections/Features';
import OpenSource from '@/components/sections/OpenSource';
import Privacy from '@/components/sections/Privacy';
import SiteFooter from '@/components/sections/SiteFooter';
import DockNavbar from '@/components/dock/DockNavbar';
import HeroStage from '@/components/hero/HeroStage';
import { useSectionHref } from '@/components/ui/useSectionHref';
import { SITE_URL } from '@/config/links';
import { generateLocaleMetadata } from '@/i18n/metadata';
import { routing } from '@/i18n/routing';
import sitemap from '@/app/sitemap';
import en from '@/messages/en.json';
import hi from '@/messages/hi.json';
import { IntlWrapper, locales, renderWithIntl } from './utils/intl';
import { navigation } from './utils/navigation';

// The share dialog script is not needed to inspect links
vi.mock('@aossie-org/social-share-button', () => ({ default: class {} }));

const locale = fc.constantFrom(...locales);
/** A page path under a locale, like `/privacy` or `/a-b/c` */
const pagePath = fc.array(fc.stringMatching(/^[a-z][a-z0-9-]{0,11}$/), { minLength: 1, maxLength: 3 }).map((parts) => `/${parts.join('/')}`);
const sectionId = fc.stringMatching(/^[a-z][a-z0-9-]{0,15}$/);

type Json = { [key: string]: Json } | Json[] | string | number | boolean | null;

function leaves(value: Json, prefix = ''): [string, string][] {
  if (typeof value === 'string') return [[prefix, value]];
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) => leaves(child as Json, prefix ? `${prefix}.${key}` : key));
  }
  return [];
}

/** ICU arguments (`{year}`) and rich-text tags (`<hl>`), which translations must keep */
const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}|<\/?(\w+)>/g)].map((m) => m[0]).sort();

describe('property tests', () => {
  it('every English string keeps its ICU arguments and rich-text tags in Hindi', () => {
    const hiStrings = new Map(leaves(hi as Json));
    const enLeaves = leaves(en as Json);
    expect(enLeaves.length).toBeGreaterThan(200);
    fc.assert(
      fc.property(fc.constantFrom(...enLeaves), ([key, text]) => {
        expect(hiStrings.has(key), key).toBe(true);
        expect(placeholders(hiStrings.get(key)!), key).toEqual(placeholders(text));
      }),
      { numRuns: enLeaves.length * 3 },
    );
  });

  it('page metadata: any locale and path gets a canonical under that locale and every hreflang alternate', () => {
    fc.assert(
      fc.property(locale, fc.option(pagePath, { nil: undefined }), fc.string(), (loc, path, title) => {
        const meta = generateLocaleMetadata(loc, path ? { path, title, description: title } : undefined);
        const suffix = path ?? '';
        expect(meta.alternates?.canonical).toBe(`${SITE_URL}/${loc}${suffix}`);
        const languages = meta.alternates?.languages as Record<string, string>;
        expect(Object.keys(languages).sort()).toEqual([...routing.locales, 'x-default'].sort());
        expect(languages['x-default']).toBe(`${SITE_URL}/${routing.defaultLocale}${suffix}`);
        for (const url of Object.values(languages)) expect(url.startsWith(`${SITE_URL}/`)).toBe(true);
      }),
    );
  });

  it('sitemap: every entry is an https URL whose alternates include itself, one per locale', () => {
    const entries = sitemap();
    fc.assert(
      fc.property(fc.constantFrom(...entries), (entry) => {
        expect(new URL(entry.url).protocol).toBe('https:');
        const languages = Object.values(entry.alternates?.languages ?? {});
        expect(languages).toContain(entry.url);
        expect(languages).toHaveLength(routing.locales.length);
        expect(entry.priority).toBeGreaterThan(0);
        expect(entry.priority).toBeLessThanOrEqual(1);
      }),
    );
  });

  it('section hrefs: a bare anchor on the home page, the localized home page elsewhere', () => {
    fc.assert(
      fc.property(locale, fc.option(pagePath, { nil: undefined }), sectionId, (loc, path, id) => {
        navigation.pathname = path ? `/${loc}${path}` : `/${loc}`;
        const { result, unmount } = renderHook(() => useSectionHref(), {
          wrapper: ({ children }) => <IntlWrapper locale={loc}>{children}</IntlWrapper>,
        });
        expect(result.current(id)).toBe(path ? `/${loc}#${id}` : `#${id}`);
        unmount();
      }),
      { numRuns: 60 },
    );
  });

  it('links: in any component and locale, new-tab links are https with noopener, and the rest stay on the site', () => {
    const components: [string, ComponentType][] = [
      ['DockNavbar', DockNavbar],
      ['HeroStage', HeroStage],
      ['Features', Features],
      ['Privacy', Privacy],
      ['OpenSource', OpenSource],
      ['DownloadCta', DownloadCta],
      ['SiteFooter', SiteFooter],
    ];
    fc.assert(
      fc.property(fc.constantFrom(...components), locale, fc.constantFrom('/', '/privacy', '/support'), ([, Component], loc, path) => {
        const { container } = renderWithIntl(<Component />, { locale: loc, path });
        for (const a of container.querySelectorAll('a')) {
          const href = a.getAttribute('href')!;
          if (a.getAttribute('target') === '_blank') {
            expect(new URL(href).protocol).toBe('https:');
            expect(a.getAttribute('rel')).toBe('noopener noreferrer');
          } else {
            // In-page anchors, or paths under the current locale
            expect(href).toMatch(new RegExp(`^(#[a-z-]+|/${loc}(/[a-z-]+)?(#[a-z-]+)?)$`));
          }
        }
        cleanup();
      }),
      { numRuns: 20 },
    );
  });
});
