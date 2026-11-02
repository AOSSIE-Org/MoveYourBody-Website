"use client";

import { useLocale } from "next-intl";
import { getPathname, usePathname } from "@/i18n/navigation";

/**
 * Href builder for the landing sections. On the home page it returns a bare `#id`, so Lenis glides
 * there; on other pages (privacy, terms) it points back to the localized home page, e.g. `/hi#privacy`.
 */
export function useSectionHref() {
  const locale = useLocale();
  const onHome = usePathname() === "/";
  const home = onHome ? "" : getPathname({ href: "/", locale });
  return (id: string) => `${home}#${id}`;
}
