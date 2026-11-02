import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { messagesMap, type Messages } from '@/i18n/messages';
import { navigation } from './navigation';

export type TestLocale = 'en' | 'hi';
export const locales: TestLocale[] = ['en', 'hi'];

export function messages(locale: TestLocale): Messages {
  return messagesMap[locale];
}

export function IntlWrapper({ locale = 'en', children }: { locale?: TestLocale; children: ReactNode }) {
  return (
    <NextIntlClientProvider locale={locale} messages={messagesMap[locale]} timeZone="UTC">
      {children}
    </NextIntlClientProvider>
  );
}

/**
 * Renders inside the real `en`/`hi` catalogs, as the locale layout does. `path` is the page under the
 * locale (`/` for home); the mocked Next.js router reports it with the locale prefix.
 */
export function renderWithIntl(
  ui: ReactElement,
  { locale = 'en', path = '/', ...options }: { locale?: TestLocale; path?: string } & Omit<RenderOptions, 'wrapper'> = {},
) {
  navigation.pathname = path === '/' ? `/${locale}` : `/${locale}${path}`;
  return render(ui, {
    wrapper: ({ children }) => <IntlWrapper locale={locale}>{children}</IntlWrapper>,
    ...options,
  });
}
