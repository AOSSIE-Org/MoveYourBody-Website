import { describe, it, expect } from 'vitest';
import sitemap from '@/app/sitemap';
import { SITE_URL } from '@/config/links';
import { routing } from '@/i18n/routing';

describe('Sitemap generation', () => {
  it('generates an entry for every supported locale', () => {
    const entries = sitemap();
    expect(entries).toHaveLength(routing.locales.length);

    for (const locale of routing.locales) {
      const match = entries.find((e) => e.url === `${SITE_URL}/${locale}`);
      expect(match).toBeDefined();
      expect(match?.changeFrequency).toBe('monthly');
      expect(match?.alternates?.languages).toBeDefined();
      expect(match?.alternates?.languages?.[locale]).toBe(`${SITE_URL}/${locale}`);
    }
  });

  it('sets default locale priority higher than secondary locales', () => {
    const entries = sitemap();
    const defaultEntry = entries.find((e) => e.url === `${SITE_URL}/${routing.defaultLocale}`);
    const secondaryEntry = entries.find((e) => e.url !== `${SITE_URL}/${routing.defaultLocale}`);

    expect(defaultEntry?.priority).toBe(1);
    expect(secondaryEntry?.priority).toBe(0.8);
  });
});
