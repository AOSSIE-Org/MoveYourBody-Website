import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { useLocale, useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import RootRedirectLayout from '@/app/(root)/layout';
import RootPage, { metadata as rootMetadata } from '@/app/(root)/page';
import ErrorBoundary from '@/app/[locale]/error';
import RootLayout, { dynamicParams, generateMetadata as layoutMetadata, generateStaticParams, viewport } from '@/app/[locale]/layout';
import NotFound from '@/app/[locale]/not-found';
import Home from '@/app/[locale]/page';
import PrivacyPage, { generateMetadata as privacyMetadata } from '@/app/[locale]/privacy/page';
import SupportPage, { generateMetadata as supportMetadata } from '@/app/[locale]/support/page';
import TermsPage, { generateMetadata as termsMetadata } from '@/app/[locale]/terms/page';
import requestConfig from '@/i18n/request';
import { PLAY_STORE_URL, REPO_URL, SITE_URL } from '@/config/links';
import { messagesMap } from '@/i18n/messages';
import { NOT_FOUND } from './utils/navigation';
import { IntlWrapper, locales, messages, renderWithIntl, type TestLocale } from './utils/intl';

// Server-only next-intl APIs: record the request locale, and expose the request config callback itself
vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
  getRequestConfig: (create: unknown) => create,
}));

afterEach(() => {
  vi.mocked(setRequestLocale).mockClear();
  vi.restoreAllMocks();
});

const params = (locale: string) => Promise.resolve({ locale });
/** A promise React's `use()` can read synchronously, as it does for one the server already resolved */
const resolvedParams = (locale: string) => Object.assign(params(locale), { status: 'fulfilled', value: { locale } });

const parse = (html: string) => new DOMParser().parseFromString(html, 'text/html');

describe('root redirect (/)', () => {
  it('wraps the page in a bare English document with no stylesheet', () => {
    const html = renderToStaticMarkup(
      <RootRedirectLayout>
        <p>child</p>
      </RootRedirectLayout>,
    );
    expect(html).toBe('<html lang="en"><head></head><body><p>child</p></body></html>');
  });

  it('forwards to the default locale by script, meta refresh and a no-JS link', () => {
    const html = renderToStaticMarkup(<RootPage />);
    expect(html).toContain('<script>location.replace("/en")</script>');
    expect(html).toContain('<meta http-equiv="refresh" content="0; url=/en"/>');
    expect(html).toContain(`<noscript><a href="/en">${messages('en').Home.continue}</a></noscript>`);
  });

  it('ships the English home metadata for crawlers', () => {
    expect(rootMetadata.title).toBe(messages('en').Home.metaTitle);
    expect(rootMetadata.alternates?.canonical).toBe(`${SITE_URL}/en`);
  });
});

describe('locale layout', () => {
  it('pre-renders exactly the supported locales', () => {
    expect(generateStaticParams()).toEqual([{ locale: 'en' }, { locale: 'hi' }]);
    expect(dynamicParams).toBe(false);
  });

  it('declares light and dark theme colours', () => {
    expect(viewport.colorScheme).toBe('dark light');
    expect(viewport.themeColor).toHaveLength(2);
  });

  it.each(locales)('builds %s metadata, and rejects unknown locales', async (locale) => {
    expect((await layoutMetadata({ params: params(locale) })).title).toBe(messages(locale).Home.metaTitle);
    await expect(layoutMetadata({ params: params('fr') })).rejects.toThrow(NOT_FOUND);
  });

  function Probe() {
    const t = useTranslations('Navbar');
    return (
      <p data-testid="probe">
        {useLocale()}:{t('features')}
      </p>
    );
  }

  async function renderLayout(locale: TestLocale) {
    const tree = await RootLayout({ params: params(locale), children: <Probe /> });
    return parse(renderToStaticMarkup(tree));
  }

  it.each(locales)('sets <html lang> and provides the %s catalog to the page', async (locale) => {
    const doc = await renderLayout(locale);
    expect(doc.documentElement.lang).toBe(locale);
    expect(doc.documentElement.className).toContain('font--font-lexend');
    expect(doc.documentElement.className).toContain('font--font-devanagari');
    expect(doc.querySelector('[data-testid="probe"]')?.textContent).toBe(`${locale}:${messages(locale).Navbar.features}`);
    const skip = doc.querySelector('a[href="#main"]');
    expect(skip?.textContent).toBe(messages(locale).Common.skipToContent);
  });

  it('describes the site, AOSSIE and the app as structured data', async () => {
    const doc = await renderLayout('hi');
    const jsonLd = JSON.parse(doc.querySelector('script[type="application/ld+json"]')!.textContent!);
    const byType = Object.fromEntries(jsonLd['@graph'].map((node: { '@type': string }) => [node['@type'], node]));
    expect(byType.WebSite).toMatchObject({ url: `${SITE_URL}/`, inLanguage: ['en', 'hi'], description: messages('hi').Home.metaDescription });
    expect(byType.Organization.name).toBe('AOSSIE');
    expect(byType.MobileApplication).toMatchObject({
      downloadUrl: PLAY_STORE_URL,
      codeRepository: REPO_URL,
      operatingSystem: 'Android',
      offers: { price: '0' },
    });
    // Every node reference points at a node in the graph
    const ids = new Set(jsonLd['@graph'].map((node: { '@id': string }) => node['@id']));
    expect(ids.has(byType.WebSite.publisher['@id'])).toBe(true);
    expect(ids.has(byType.MobileApplication.author['@id'])).toBe(true);
  });

  it('shows reveal content to visitors without JavaScript', async () => {
    const doc = await renderLayout('en');
    expect(doc.head.querySelector('noscript')?.innerHTML).toContain('[data-reveal]{opacity:1!important');
  });

  it('rejects an unknown locale', async () => {
    await expect(RootLayout({ params: params('fr'), children: null })).rejects.toThrow(NOT_FOUND);
  });
});

describe('home page', () => {
  it.each(locales)('composes the %s landing sections in order', (locale) => {
    renderWithIntl(<Home params={resolvedParams(locale)} />, { locale });
    const main = screen.getByRole('main');
    expect(main.id).toBe('main');
    const ids = [...main.querySelectorAll(':scope > section')].map((s) => s.id);
    expect(ids).toEqual(['top', 'manifesto', 'features', 'how-it-works', 'privacy', 'open-source', 'download']);
    expect(screen.getByRole('navigation', { name: messages(locale).Navbar.primary })).toBeDefined();
    expect(screen.getByRole('contentinfo')).toBeDefined();
  });

  it('is a 404 for an unknown locale', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderWithIntl(<Home params={resolvedParams('fr')} />)).toThrow(NOT_FOUND);
  });
});

describe('legal pages', () => {
  const pages = [
    { name: 'privacy', Page: PrivacyPage, metadata: privacyMetadata, heading: 'Privacy Policy' },
    { name: 'terms', Page: TermsPage, metadata: termsMetadata, heading: 'Terms of Service' },
  ] as const;

  describe.each(pages)('$name', ({ name, Page, metadata, heading }) => {
    it.each(locales)('has %s metadata with its own canonical', async (locale) => {
      const meta = await metadata({ params: params(locale) });
      expect(meta.title).toBe(messages(locale).Legal[name].title);
      expect(meta.description).toBe(messages(locale).Legal[name].description);
      expect(meta.alternates?.canonical).toBe(`${SITE_URL}/${locale}/${name}`);
    });

    it('renders the repository document in English without a note', async () => {
      const page = await Page({ params: params('en') });
      expect(setRequestLocale).toHaveBeenCalledWith('en');
      renderWithIntl(page, { path: `/${name}` });
      expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(heading);
      expect(screen.queryByText(messages('hi').Legal.englishOnly)).toBeNull();
      expect(screen.queryByText(messages('en').Legal.englishOnly)).toBeNull();
      expect(screen.getByRole('main').id).toBe('main');
    });

    it('notes on Hindi pages that the document is English-only, and keeps cross-links in Hindi', async () => {
      const page = await Page({ params: params('hi') });
      renderWithIntl(page, { locale: 'hi', path: `/${name}` });
      expect(screen.getByText(messages('hi').Legal.englishOnly)).toBeDefined();
      const article = screen.getByRole('article');
      expect(within(article).getByRole('heading', { level: 1 }).closest('[lang]')?.getAttribute('lang')).toBe('en');
      const internal = within(article)
        .getAllByRole('link')
        .map((a) => a.getAttribute('href')!)
        .filter((href) => href.startsWith('/'));
      expect(internal.every((href) => href.startsWith('/hi/'))).toBe(true);
    });

    it('is a 404 for an unknown locale', async () => {
      await expect(Page({ params: params('fr') })).rejects.toThrow(NOT_FOUND);
      await expect(metadata({ params: params('fr') })).rejects.toThrow(NOT_FOUND);
    });
  });

  it('links the terms back to the privacy policy page', async () => {
    renderWithIntl(await TermsPage({ params: params('en') }), { path: '/terms' });
    const article = screen.getByRole('article');
    expect(within(article).getAllByRole('link', { name: 'Privacy Policy' })[0].getAttribute('href')).toBe('/en/privacy');
  });
});

describe('support page', () => {
  it.each(locales)('has %s metadata with its own canonical', async (locale) => {
    const meta = await supportMetadata({ params: params(locale) });
    expect(meta.title).toBe(messages(locale).Support.title);
    expect(meta.alternates?.canonical).toBe(`${SITE_URL}/${locale}/support`);
  });

  it.each(locales)('frames the %s support widget with the dock and footer', async (locale) => {
    const page = await SupportPage({ params: params(locale) });
    expect(setRequestLocale).toHaveBeenCalledWith(locale);
    renderWithIntl(page, { locale, path: '/support' });
    const main = screen.getByRole('main');
    expect(within(main).getByText(messages(locale).Support.title)).toBeDefined();
    expect(screen.getByRole('navigation', { name: messages(locale).Navbar.primary })).toBeDefined();
    expect(screen.getByRole('contentinfo')).toBeDefined();
  });

  it('is a 404 for an unknown locale', async () => {
    await expect(SupportPage({ params: params('fr') })).rejects.toThrow(NOT_FOUND);
    await expect(supportMetadata({ params: params('fr') })).rejects.toThrow(NOT_FOUND);
  });
});

describe('error boundary', () => {
  it.each(locales)('logs the error and offers a %s retry', (locale) => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    const reset = vi.fn();
    const error = new Error('boom');
    render(
      <IntlWrapper locale={locale}>
        <ErrorBoundary error={error} reset={reset} />
      </IntlWrapper>,
    );
    const t = messages(locale).Error;
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(t.title);
    expect(screen.getByText(t.description)).toBeDefined();
    expect(log).toHaveBeenCalledWith(error);
    expect(reset).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: t.retry }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});

describe('not found page', () => {
  it.each(locales)('links back to the %s home page', (locale) => {
    renderWithIntl(<NotFound />, { locale, path: '/missing' });
    const t = messages(locale).NotFound;
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(t.title);
    expect(screen.getByText(t.description)).toBeDefined();
    expect(screen.getByRole('link', { name: t.home }).getAttribute('href')).toBe(`/${locale}`);
  });
});

describe('i18n request config', () => {
  const config = requestConfig as unknown as (args: { requestLocale: Promise<string | undefined> }) => Promise<{
    locale: string;
    messages: unknown;
  }>;

  it.each(locales)('serves the %s catalog for its locale', async (locale) => {
    expect(await config({ requestLocale: Promise.resolve(locale) })).toEqual({ locale, messages: messagesMap[locale] });
  });

  it.each([undefined, 'fr', 'EN'])('falls back to English for %s', async (requested) => {
    expect(await config({ requestLocale: Promise.resolve(requested) })).toEqual({ locale: 'en', messages: messagesMap.en });
  });
});

