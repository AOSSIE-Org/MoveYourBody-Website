import type { routing } from './routing';
import type { Messages } from './messages';

// Type-checks translation keys passed to useTranslations / t() against en.json
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: Messages;
  }
}
