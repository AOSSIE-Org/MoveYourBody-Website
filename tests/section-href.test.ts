import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSectionHref } from '@/components/ui/useSectionHref';

const current = vi.hoisted(() => ({ locale: 'en', pathname: '/' }));

vi.mock('next-intl', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next-intl')>()),
  useLocale: () => current.locale,
}));

vi.mock('@/i18n/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/i18n/navigation')>()),
  usePathname: () => current.pathname,
}));

describe('useSectionHref', () => {
  beforeEach(() => {
    current.locale = 'en';
    current.pathname = '/';
  });

  it('returns a bare in-page anchor on the home page', () => {
    const { result } = renderHook(() => useSectionHref());
    expect(result.current('features')).toBe('#features');
  });

  it.each(['en', 'hi'])('links back to the %s home page from other pages', (locale) => {
    current.locale = locale;
    current.pathname = '/privacy';
    const { result } = renderHook(() => useSectionHref());
    expect(result.current('how-it-works')).toBe(`/${locale}#how-it-works`);
  });
});
