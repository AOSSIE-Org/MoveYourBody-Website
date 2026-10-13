"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { dockGlyph, dockItem } from "@/components/dock/dockItem";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("ThemeToggle");
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting for mount
  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  if (!mounted) {
    return <div className={`${dockItem()} w-9 animate-pulse`} />;
  }

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label={t("toggleTheme")}
      className={`${dockItem()} group`}
    >
      {isLight ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
          className={`${dockGlyph} text-icon-sun drop-shadow-[0_1px_2px_rgba(180,83,9,0.3)] transition-transform duration-500 ease-out group-hover:rotate-90`}
        >
          <circle cx="12" cy="12" r="4" fill="currentColor" className="opacity-95" />
          <path
            d="M12 2v2.5m0 15V22M4.93 4.93l1.77 1.77m10.6 10.6l1.77 1.77M2 12h2.5m15 0H22M4.93 19.07l1.77-1.77m10.6-10.6l1.77-1.77"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
          className={`${dockGlyph} text-icon-moon drop-shadow-[0_0_6px_rgba(0,255,150,0.5)] transition-transform duration-500 ease-out group-hover:-rotate-45`}
        >
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            fill="currentColor"
            fillOpacity="0.3"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M17 4l.5 1.5L19 6l-1.5.5L17 8l-.5-1.5L15 6l1.5-.5z" fill="currentColor" stroke="none" />
        </svg>
      )}
    </button>
  );
}
