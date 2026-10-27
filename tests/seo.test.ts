import { describe, it, expect } from 'vitest';
import { generateLocaleMetadata } from '@/i18n/metadata';
import { messagesMap, defaultMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/config/links';
import manifest from '@/app/manifest';

describe('generateLocaleMetadata', () => {
  it.each(routing.locales)('uses the %s catalog for title and description', (locale) => {
    const meta = generateLocaleMetadata(locale);
    expect(meta.title).toBe(messagesMap[locale].Home.metaTitle);
    expect(meta.description).toBe(messagesMap[locale].Home.metaDescription);
  });

  it('falls back to English for an unknown locale instead of crashing', () => {
    const meta = generateLocaleMetadata('xx');
    expect(meta.title).toBe(defaultMessages.Home.metaTitle);
    expect(meta.openGraph).toMatchObject({ locale: 'en_US' });
  });

  it('declares canonical, every hreflang alternate and an x-default', () => {
    const meta = generateLocaleMetadata('hi');
    expect(meta.alternates?.canonical).toBe(`${SITE_URL}/hi`);
    expect(meta.alternates?.languages).toEqual({
      en: `${SITE_URL}/en`,
      hi: `${SITE_URL}/hi`,
      'x-default': `${SITE_URL}/en`,
    });
  });

  it('shares a 1200x630 raster image on Open Graph and X, since SVG previews are not rendered', () => {
    const meta = generateLocaleMetadata('en');
    const [image] = meta.openGraph?.images as { url: string; width: number; height: number }[];
    expect(image.url).toMatch(/\.(png|jpe?g)$/);
    expect([image.width, image.height]).toEqual([1200, 630]);
    expect(meta.twitter).toMatchObject({ card: 'summary_large_image', images: [image.url] });
  });

  it('lists the other locales as Open Graph alternates', () => {
    expect(generateLocaleMetadata('en').openGraph).toMatchObject({ locale: 'en_US', alternateLocale: ['hi_IN'] });
    expect(generateLocaleMetadata('hi').openGraph).toMatchObject({ locale: 'hi_IN', alternateLocale: ['en_US'] });
  });
});

describe('web app manifest', () => {
  const m = manifest();

  it('is installable: name, start URL, standalone display and 192/512 icons', () => {
    expect(m.name).toBe('MoveYourBody');
    expect(m.start_url).toBe('/');
    expect(m.display).toBe('standalone');
    expect(m.icons?.map((i) => i.sizes)).toEqual(expect.arrayContaining(['192x192', '512x512']));
  });

  it('links the Play Store app with the same package id as the site metadata', () => {
    const play = m.related_applications?.[0];
    expect(play?.platform).toBe('play');
    expect(play?.url).toContain(`id=${play?.id}`);
    expect(generateLocaleMetadata('en').other).toMatchObject({ 'google-play-app': `app-id=${play?.id}` });
  });
});

describe('messagesMap', () => {
  it('has a catalog for every routed locale', () => {
    for (const locale of routing.locales) {
      expect(messagesMap[locale], locale).toBeDefined();
    }
  });
});
