"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type ReactNode } from "react";
import LanguageSwitcher from "@/components/dock/LanguageSwitcher";
import ThemeToggle from "@/components/dock/ThemeToggle";
import { dockGlyph, dockItem, dockPanel } from "@/components/dock/dockItem";
import { container } from "@/components/container";
import { PLAY_STORE_URL } from "@/config/links";

const links = [
  {
    id: "features",
    icon: (
      <>
        <path d="M8 14V9" />
        <path d="M8 9c0-2.4 1.7-4.3 4-4.3.2 2.6-1.6 4.6-4 4.3Z" />
        <path d="M8 10.5C7.9 8.4 6.4 6.8 4.4 6.8 4.3 8.9 5.9 10.6 8 10.5Z" />
      </>
    ),
  },
  {
    id: "howItWorks",
    icon: (
      <>
        <circle cx="4" cy="4" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <path d="M5.5 4H9a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2H7a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h3.5" />
      </>
    ),
  },
  {
    id: "privacy",
    icon: (
      <>
        <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" />
        <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
      </>
    ),
  },
  {
    id: "openSource",
    icon: (
      <>
        <path d="m5.5 5-3 3 3 3" />
        <path d="m10.5 5 3 3-3 3" />
      </>
    ),
  },
] as const satisfies readonly { id: string; icon: ReactNode }[];

type SectionId = (typeof links)[number]["id"];

/** DOM ids are kebab-case; message keys are camelCase */
const anchor = (id: SectionId) => id.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/** Tracks which section crosses the middle band of the viewport */
function useActiveSection(ids: readonly SectionId[]) {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setActive(ids.find((id) => anchor(id) === entry.target.id) ?? null);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    // The hero and manifesto clear the highlight when scrolled back to the top
    for (const id of ["top", "manifesto", ...ids.map(anchor)]) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={dockGlyph}
    >
      {children}
    </svg>
  );
}

const sectionIds = links.map((link) => link.id);

export default function DockNavbar() {
  const t = useTranslations("Navbar");
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const active = useActiveSection(sectionIds);

  // Close the mobile menu on outside tap or Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    // Shares the page container with the sections below, so both edges line up at every width
    <div className="pointer-events-none fixed inset-x-0 top-3 z-40 sm:top-6">
      <nav ref={navRef} aria-label={t("primary")} className={`${container} relative grid grid-cols-[1fr_auto_1fr] items-center gap-3`}>
        {/* Left: brand */}
        <div className={`${dockPanel} justify-self-start [--d:100ms]`}>
          <a href="#top" aria-label={t("home")} className={dockItem({ mark: true })}>
            <Image
              src="/brand/icons/MoveYourBody_logo.svg"
              alt=""
              width={24}
              height={24}
              className="block size-[62%] object-contain"
            />
          </a>
        </div>

        {/* Middle (tablet and up): sections, then preferences */}
        <div className={`${dockPanel} hidden [--d:180ms] md:flex`}>
          {links.map(({ id, icon }) => (
            <a
              key={id}
              href={`#${anchor(id)}`}
              aria-current={active === id ? "location" : undefined}
              className={dockItem({ isActive: active === id })}
            >
              <Glyph>{icon}</Glyph>
              <span className="hidden lg:inline">{t(id)}</span>
              <span className="sr-only lg:hidden">{t(id)}</span>
            </a>
          ))}
          <span aria-hidden="true" className="mx-1 h-5 w-px bg-border-default" />
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        {/* Right: download call to action, plus the menu toggle on phones */}
        <div className="col-start-3 flex items-center gap-2 justify-self-end [--d:260ms]">
          <div className={dockPanel}>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("download")}
              className={dockItem({ primary: true })}
            >
              <Glyph>
                <path d="M8 2.5v7.5" />
                <path d="m5 7 3 3 3-3" />
                <path d="M3 13.5h10" />
              </Glyph>
              <span className="hidden sm:inline">{t("download")}</span>
            </a>
          </div>
          <div className={`${dockPanel} md:hidden`}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={t(menuOpen ? "closeMenu" : "openMenu")}
              className={dockItem({ mark: true, isActive: menuOpen })}
            >
              <span aria-hidden="true" className="relative block h-3 w-4">
                {["top-0", "top-1.25", "top-2.5"].map((position, i) => (
                  <span
                    key={position}
                    className={`absolute left-0 h-0.5 w-4 rounded-full bg-current transition duration-300 ease-out-expo ${position} ${
                      menuOpen ? ["translate-y-1.25 rotate-45", "opacity-0", "-translate-y-1.25 -rotate-45"][i] : ""
                    }`}
                  />
                ))}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu sheet */}
        <div
          id="mobile-menu"
          className={`absolute inset-x-4 top-full mt-2 origin-top rounded-2xl border border-dock-border bg-dock-bg p-2 shadow-dock backdrop-blur-md transition duration-300 ease-out-expo sm:inset-x-6 md:hidden ${
            menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none -translate-y-2 scale-95 opacity-0"
          }`}
          inert={!menuOpen}
        >
          <ul className="flex flex-col gap-1">
            {links.map(({ id, icon }) => (
              <li key={id}>
                <a
                  href={`#${anchor(id)}`}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active === id ? "location" : undefined}
                  className={`flex h-11 w-full items-center gap-3 rounded-xl border px-3 text-xs font-medium tracking-widest uppercase transition-colors ${
                    active === id
                      ? "border-border-strong bg-card-bg text-stat-value"
                      : "border-transparent text-foreground-secondary hover:bg-dock-item-hover-bg hover:text-dock-item-hover-text"
                  }`}
                >
                  <Glyph>{icon}</Glyph>
                  <span>{t(id)}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center justify-between border-t border-border-default px-1 pt-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    </div>
  );
}
