import { createElement, type ImgHTMLAttributes } from 'react';
import { afterEach, vi } from 'vitest';
import { installBrowserMocks, resetBrowserMocks } from './utils/browser';
import { resetNavigation } from './utils/navigation';

// Shared mocks for what jsdom and Vitest cannot provide. Each test file still renders the real
// components and message catalogs; only the framework/browser edges below are replaced.

// The App Router is not mounted in unit tests: `tests/utils/navigation.ts` holds the current path and records navigations
vi.mock('next/navigation', async () => {
  const { navigation, NOT_FOUND } = await import('./utils/navigation');
  const fail = (digest: string) => {
    throw Object.assign(new Error(digest), { digest });
  };
  return {
    usePathname: () => navigation.pathname,
    useRouter: () => navigation.router,
    useParams: () => ({}),
    useSearchParams: () => new URLSearchParams(),
    notFound: () => fail(NOT_FOUND),
    redirect: (url: string) => fail(`NEXT_REDIRECT;replace;${url}`),
    permanentRedirect: (url: string) => fail(`NEXT_REDIRECT;replace;${url};308`),
  };
});

// The image optimizer needs a Next.js server; a plain <img> keeps src and alt assertable
vi.mock('next/image', () => ({
  default: ({ src, alt, fill, priority, ...props }: ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) =>
    createElement('img', {
      src,
      alt,
      'data-fill': fill ? 'true' : undefined,
      'data-priority': priority ? 'true' : undefined,
      ...props,
    }),
}));

// next/font is a compile-time transform; tests only need the CSS variable names
vi.mock('next/font/local', () => ({
  default: ({ variable }: { variable: string }) => ({ className: 'font', variable: `font${variable}`, style: {} }),
}));

if (typeof window !== 'undefined') installBrowserMocks();

afterEach(() => {
  if (typeof window !== 'undefined') {
    resetBrowserMocks();
    installBrowserMocks();
  }
  resetNavigation();
});
