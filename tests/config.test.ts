import { describe, it, expect } from 'vitest';
import { languages, defaultLanguage } from '@/config/languages';
import {
  SITE_URL,
  PLAY_STORE_URL,
  REPO_URL,
  WEBSITE_REPO_URL,
  AOSSIE_URL,
  STABILITY_NEXUS_URL,
  SOCIAL_LINKS,
} from '@/config/links';
import { routing } from '@/i18n/routing';

describe('Configuration & Routing', () => {
  it('should define default language as English', () => {
    expect(defaultLanguage).toBe('en');
    expect(routing.defaultLocale).toBe('en');
  });

  it('should support en and hi locales', () => {
    expect(routing.locales).toEqual(['en', 'hi']);
    const supportedCodes = languages.map((l) => l.code);
    expect(supportedCodes).toContain('en');
    expect(supportedCodes).toContain('hi');
    expect(supportedCodes).not.toContain('fr');
  });

  it('should contain metadata for all supported languages', () => {
    expect(languages).toHaveLength(2);
    expect(languages.map((l) => l.code)).toEqual(['en', 'hi']);
    expect(languages.find((l) => l.code === 'en')?.name).toBe('English');
    expect(languages.find((l) => l.code === 'hi')?.name).toBe('Hindi');
  });

  it('should have valid HTTPS external and internal links', () => {
    const urls = [
      SITE_URL,
      PLAY_STORE_URL,
      REPO_URL,
      WEBSITE_REPO_URL,
      AOSSIE_URL,
      STABILITY_NEXUS_URL,
      ...Object.values(SOCIAL_LINKS),
    ];

    for (const url of urls) {
      expect(url).toMatch(/^https:\/\//);
    }
  });
});
