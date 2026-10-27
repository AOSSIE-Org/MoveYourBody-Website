import type { Metadata } from 'next';
import { defaultLanguage } from '@/config/languages';
import { generateLocaleMetadata } from '@/i18n/metadata';
import { messagesMap } from '@/i18n/messages';

const defaultLocalePath = `/${defaultLanguage}`;

// A static export cannot send HTTP redirects, so `/` ships the default
// locale's metadata (for crawlers and link previews) and forwards in the browser.
export const metadata: Metadata = generateLocaleMetadata(defaultLanguage);

export default function RootPage() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${defaultLocalePath}`} />
      <p className="p-8 text-center">
        <a href={defaultLocalePath} className="underline">
          {messagesMap[defaultLanguage].Home.continue}
        </a>
      </p>
    </>
  );
}
