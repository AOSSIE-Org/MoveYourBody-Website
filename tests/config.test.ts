import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { languages, defaultLanguage } from '@/config/languages';
import { LEGAL_DOCUMENT_LOCALE, LEGAL_PAGES } from '@/config/legal';
import {
  SITE_URL,
  PLAY_STORE_URL,
  REPO_URL,
  WEBSITE_REPO_URL,
  AOSSIE_URL,
  STABILITY_NEXUS_URL,
  GITHUB_SPONSORS_URL,
  SOCIAL_LINKS,
} from '@/config/links';
import { SHARE_PLATFORMS, SUPPORT_LOGOS, SUPPORT_PAGE_PATH } from '@/config/support';
import * as links from '@/config/links';
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
      GITHUB_SPONSORS_URL,
      ...Object.values(SOCIAL_LINKS),
    ];

    for (const url of urls) {
      expect(url).toMatch(/^https:\/\//);
    }
  });

  it('exports only absolute HTTPS URLs from the links config', () => {
    // PLAY_STORE_APP_ID is an identifier, not a link
    const urls = Object.entries(links).filter(([name]) => !name.endsWith('_APP_ID')).flatMap(([name, value]) =>
      typeof value === 'string' ? [[name, value]] : Object.entries(value).map(([key, url]) => [`${name}.${key}`, url]),
    );
    expect(urls.length).toBeGreaterThan(10);
    for (const [name, url] of urls) {
      expect(new URL(url).protocol, name).toBe('https:');
    }
  });

  it('builds the Play Store link from the app id', () => {
    expect(links.PLAY_STORE_URL).toBe('https://play.google.com/store/apps/details?id=org.aossie.move');
  });

  it('keeps SITE_URL free of a trailing slash', () => {
    expect(SITE_URL.endsWith('/')).toBe(false);
  });

  it('points every legal page at a document in the repository root', () => {
    for (const { path: pagePath, file } of Object.values(LEGAL_PAGES)) {
      expect(pagePath).toMatch(/^\/[a-z-]+$/);
      expect(fs.existsSync(path.join(process.cwd(), file)), file).toBe(true);
    }
    expect(routing.locales).toContain(LEGAL_DOCUMENT_LOCALE);
  });

  it('points the support page at AOSSIE GitHub Sponsors', () => {
    expect(GITHUB_SPONSORS_URL).toBe('https://github.com/sponsors/AOSSIE-Org');
  });

  it('serves the support page beside the legal pages, with logos from public/brand', () => {
    expect(SUPPORT_PAGE_PATH).toMatch(/^\/[a-z-]+$/);
    expect(Object.values(LEGAL_PAGES).map(({ path: pagePath }) => pagePath)).not.toContain(SUPPORT_PAGE_PATH);
    for (const logo of Object.values(SUPPORT_LOGOS)) {
      expect(logo).toMatch(/^\/brand\//);
      expect(fs.existsSync(path.join(process.cwd(), 'public', logo)), logo).toBe(true);
    }
  });

  it('offers a fixed set of share networks', () => {
    expect(SHARE_PLATFORMS).toEqual(['whatsapp', 'twitter', 'linkedin', 'telegram', 'email']);
  });
});
