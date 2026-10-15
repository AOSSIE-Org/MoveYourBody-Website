"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { languages, type Locale } from "@/config/languages";
import { dockGlyph, dockItem } from "@/components/dock/dockItem";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("LanguageSwitcher");
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (newLocale: Locale) => {
    setIsOpen(false);
    if (newLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        aria-expanded={isOpen}
        aria-label={t("label")}
        className={`${dockItem()} disabled:opacity-50`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`${dockGlyph} hidden sm:block`}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span>{locale.toUpperCase()}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
          className={`hidden size-3 transition-transform duration-200 sm:block ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className={`absolute right-0 z-50 w-36 top-full mt-2 space-y-1 rounded-xl border border-border-default bg-background-elevated p-1.5 shadow-xl backdrop-blur-md`}>
          {languages.map((lang) => {
            const isSelected = lang.code === locale;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageSelect(lang.code)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs transition-colors ${
                  isSelected
                    ? "bg-brand-green font-semibold text-white"
                    : "font-medium text-foreground-secondary hover:bg-dock-item-bg"
                }`}
              >
                <span>{lang.localName}</span>
                <span className="text-[10px] uppercase opacity-75">{lang.code}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
