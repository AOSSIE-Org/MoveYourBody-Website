import fs from "node:fs";
import path from "node:path";
import DockNavbar from "@/components/dock/DockNavbar";
import SiteFooter from "@/components/sections/SiteFooter";
import { container } from "@/components/container";
import { LEGAL_DOCUMENT_LOCALE, LEGAL_PAGES, type LegalPageId } from "@/config/legal";
import type { Locale } from "@/config/languages";
import { getPathname } from "@/i18n/navigation";
import { defaultMessages, messagesMap } from "@/i18n/messages";
import { LegalDocument } from "@/lib/legal-markdown";

/** Typography for the rendered Markdown, in the landing sections' type scale and theme tokens */
const prose = [
  "text-base leading-relaxed font-light text-pretty text-foreground-muted",
  "[&_h1]:text-4xl [&_h1]:leading-[1.08] [&_h1]:font-light [&_h1]:tracking-tight [&_h1]:text-balance [&_h1]:text-foreground-primary sm:[&_h1]:text-5xl",
  "[&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-normal [&_h2]:tracking-tight [&_h2]:text-foreground-primary",
  "[&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-foreground-primary",
  "[&_p]:mt-4",
  "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_li]:marker:text-highlight",
  "[&_strong]:font-medium [&_strong]:text-foreground-primary",
  "[&_a]:font-medium [&_a]:break-words [&_a]:text-highlight [&_a]:underline [&_a]:underline-offset-4",
  "[&_code]:rounded-md [&_code]:border [&_code]:border-border-subtle [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.875em] [&_code]:text-foreground-secondary",
].join(" ");

/** A legal document from the repository root, read at build time and framed by the site's dock and footer */
export default function LegalPage({ locale, page }: { locale: Locale; page: LegalPageId }) {
  const source = fs.readFileSync(path.join(process.cwd(), LEGAL_PAGES[page].file), "utf8");
  // Links between the two documents stay in the reader's locale
  const links = {
    privacy: getPathname({ href: LEGAL_PAGES.privacy.path, locale }),
    terms: getPathname({ href: LEGAL_PAGES.terms.path, locale }),
  };
  const { englishOnly } = (messagesMap[locale] ?? defaultMessages).Legal;

  return (
    <>
      <DockNavbar />
      <main id="main" className="flex-1 pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className={container}>
          {/* Centred reading column, as on the other AOSSIE landing pages */}
          <article className="mx-auto max-w-3xl">
            {locale !== LEGAL_DOCUMENT_LOCALE && (
              <p className="mb-10 rounded-2xl border border-border-subtle bg-surface px-4 py-3 text-sm text-foreground-secondary">
                {englishOnly}
              </p>
            )}
            <LegalDocument source={source} links={links} className={prose} />
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
