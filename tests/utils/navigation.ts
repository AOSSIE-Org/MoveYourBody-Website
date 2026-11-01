import { vi } from 'vitest';

/**
 * State behind the `next/navigation` mock in the setup file. `pathname` is the full browser path
 * (with the locale prefix, as Next.js reports it); `router` records navigations.
 */
export const navigation = {
  pathname: '/en',
  router: {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  },
};

/** What the mocked `notFound()` throws, mirroring Next.js's own digest */
export const NOT_FOUND = 'NEXT_HTTP_ERROR_FALLBACK;404';

export function resetNavigation() {
  navigation.pathname = '/en';
  for (const fn of Object.values(navigation.router)) fn.mockReset();
}
