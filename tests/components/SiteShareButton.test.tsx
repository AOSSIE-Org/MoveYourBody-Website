import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import SiteShareButton from '@/components/sections/SiteShareButton';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { SHARE_PLATFORMS } from '@/config/support';
import { IntlWrapper, messages, type TestLocale } from '../utils/intl';

interface Options {
  container: HTMLElement;
  showButton: boolean;
  platforms: readonly string[];
  theme: 'dark' | 'light';
  labels: Record<string, string>;
}

const share = vi.hoisted(() => {
  class FakeShare {
    static instances: FakeShare[] = [];
    destroyed = false;
    opened = 0;
    options: Record<string, unknown>;
    constructor(options: Record<string, unknown>) {
      this.options = { ...options };
      FakeShare.instances.push(this);
    }
    updateOptions(options: Record<string, unknown>) {
      Object.assign(this.options, options);
    }
    openModal() {
      this.opened++;
    }
    destroy() {
      this.destroyed = true;
    }
  }
  return { FakeShare };
});

// The real dialog is exercised in SiteFooter.test.tsx; here a stand-in records what the button asks of it
vi.mock('@aossie-org/social-share-button', () => ({ default: share.FakeShare }));

const instances = () => share.FakeShare.instances;
const live = () => instances().filter((i) => !i.destroyed);

afterEach(() => {
  share.FakeShare.instances = [];
  document.documentElement.className = '';
  localStorage.clear();
});

function renderShare(locale: TestLocale = 'en', theme?: string) {
  if (theme) localStorage.setItem('theme', theme);
  return render(
    <IntlWrapper locale={locale}>
      <ThemeProvider>
        <SiteShareButton className="share-trigger" />
      </ThemeProvider>
    </IntlWrapper>,
  );
}

describe('SiteShareButton', () => {
  it('renders an icon button labelled from the catalog', () => {
    renderShare();
    const button = screen.getByRole('button', { name: 'Share this page' });
    expect(button.getAttribute('title')).toBe('Share this page');
    expect(button.className).toBe('share-trigger');
    expect(button.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it.each(['en', 'hi'] as const)('builds the dialog in the page theme with %s labels', async (locale) => {
    const t = messages(locale).Share;
    const { container } = renderShare(locale);
    await waitFor(() => expect(instances()).toHaveLength(1));
    const options = instances()[0].options as unknown as Options;
    expect(options.container).toBe(container.querySelector('span[hidden]'));
    expect(options.showButton).toBe(false);
    expect(options.platforms).toEqual(SHARE_PLATFORMS);
    expect(options.theme).toBe('dark');
    expect(options.labels).toEqual({
      share: t.share,
      close: t.close,
      copy: t.copy,
      copied: t.copied,
      copyFailed: t.copyFailed,
      urlLabel: t.urlLabel,
    });
  });

  it('uses the light dialog on the light theme', async () => {
    renderShare('en', 'light');
    await waitFor(() => expect(live()).toHaveLength(1));
    expect((live()[0].options as unknown as Options).theme).toBe('light');
  });

  it('shares the current URL and title when clicked', async () => {
    document.title = 'MoveYourBody test page';
    renderShare();
    await waitFor(() => expect(instances()).toHaveLength(1));
    fireEvent.click(screen.getByRole('button'));
    expect(instances()[0].opened).toBe(1);
    expect(instances()[0].options).toMatchObject({ url: window.location.href, title: 'MoveYourBody test page' });
  });

  it('ignores clicks until the dialog script has loaded', () => {
    renderShare();
    // The dynamic import has not resolved yet
    expect(instances()).toHaveLength(0);
    expect(() => fireEvent.click(screen.getByRole('button'))).not.toThrow();
  });

  it('rebuilds the dialog when the language changes, destroying the old one', async () => {
    const { rerender } = renderShare('en');
    await waitFor(() => expect(instances()).toHaveLength(1));
    rerender(
      <IntlWrapper locale="hi">
        <ThemeProvider>
          <SiteShareButton className="share-trigger" />
        </ThemeProvider>
      </IntlWrapper>,
    );
    await waitFor(() => expect(instances()).toHaveLength(2));
    expect(instances()[0].destroyed).toBe(true);
    expect((live()[0].options as unknown as Options).labels.share).toBe(messages('hi').Share.share);
  });

  it('destroys the dialog when unmounted', async () => {
    const { unmount } = renderShare();
    await waitFor(() => expect(instances()).toHaveLength(1));
    unmount();
    expect(instances()[0].destroyed).toBe(true);
  });

  it('does not build a dialog if unmounted before the script loads', async () => {
    const { unmount } = renderShare();
    unmount();
    await act(() => new Promise((r) => setTimeout(r, 20)));
    expect(instances()).toHaveLength(0);
  });
});
