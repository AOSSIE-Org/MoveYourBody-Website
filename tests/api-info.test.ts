// @vitest-environment node
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { GET, dynamic } from '@/app/api/info/route';
import { LEGAL_PAGES } from '@/config/legal';
import { SITE_URL } from '@/config/links';
import { SUPPORT_PAGE_PATH } from '@/config/support';

async function info() {
  const response = await GET();
  expect(response.headers.get('content-type')).toContain('application/json');
  return response.json();
}

describe('GET /api/info', () => {
  it('is exported as a static file', () => {
    expect(dynamic).toBe('force-static');
  });

  it('describes the app with only absolute HTTPS links', async () => {
    const body = await info();
    expect(body).toMatchObject({ name: 'MoveYourBody', organization: 'AOSSIE', license: 'GPL-3.0', platforms: ['Android'] });
    expect(body.features.length).toBeGreaterThan(5);
    for (const url of [body.repository, body.websiteRepository, ...Object.values(body.links)]) {
      expect(new URL(url as string).protocol).toBe('https:');
    }
  });

  it('points at the default-locale legal and support pages on the site', async () => {
    const { links } = await info();
    expect(links.privacy).toBe(`${SITE_URL}/en${LEGAL_PAGES.privacy.path}`);
    expect(links.terms).toBe(`${SITE_URL}/en${LEGAL_PAGES.terms.path}`);
    expect(links.support).toBe(`${SITE_URL}/en${SUPPORT_PAGE_PATH}`);
    expect(links.home).toBe(`${SITE_URL}/`);
  });

  it('matches the hand-written public/api/info.json, so the two never drift', async () => {
    const published = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/api/info.json'), 'utf8'));
    expect(await info()).toEqual(published);
  });
});
