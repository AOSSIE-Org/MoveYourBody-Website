"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { container } from "@/components/container";
import { highlight } from "@/components/ui/SectionHeading";
import { LiquidMetalButton } from "@/components/ui/LiquidMetalButton";
import { PLAY_STORE_URL } from "@/config/links";

const guides = ["left-1/3 md:left-1/4", "left-2/3 md:left-[47%]", "hidden md:block md:left-[68%]"];

function Stat({ className, icon, title, value }: { className: string; icon: ReactNode; title: string; value: string }) {
  return (
    <div
      className={`order-1 mt-10 flex items-start gap-2 text-left motion-safe:parallax motion-safe:animate-enter-up lg:order-none lg:mt-44 ${className}`}
    >
      <svg
        viewBox="0 0 30 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        aria-hidden="true"
        className="mt-0.5 size-7 flex-none text-stat-icon drop-shadow-mark"
      >
        {icon}
      </svg>
      <dl className="text-xs leading-snug">
        <dt className="font-light text-stat-title">{title}</dt>
        <dd className="font-semibold text-stat-value">{value}</dd>
      </dl>
    </div>
  );
}

const mottoLines = [
  ["mottoLine1", "[--d:350ms]"],
  ["mottoLine2", "[--d:450ms]"],
] as const;

export default function HeroStage() {
  const t = useTranslations("Hero");

  return (
    <>
      {/* Vertical column guides */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 [--d:200ms] motion-safe:animate-enter-fade">
        {guides.map((position) => (
          <i key={position} className={`absolute inset-y-0 w-px bg-(image:--guide-line) ${position}`} />
        ))}
      </div>

      {/* Phones: one column with the stats paired under the band. Desktop: stats flank the model. */}
      <section
        className={`${container} relative isolate z-10 grid grid-cols-2 justify-items-center pb-6 text-center lg:grid-cols-[1fr_auto_1fr] lg:pt-20 lg:pb-0`}
      >
        {/* Phones/tablets: exactly one screen tall, so the model's feet meet the fold. Desktop: dissolves into the grid. */}
        <div className="col-span-full flex h-svh min-h-[36rem] w-full flex-col items-center pt-20 lg:contents">
          <p className="col-span-full mt-8 text-xs font-light tracking-wide text-foreground-muted [--d:250ms] [--pd:20] [--pr:1] motion-safe:parallax motion-safe:animate-enter-up sm:text-sm lg:text-xs">
            {t.rich("poweredBy", {
              link: (chunks) => (
                <a
                  href="https://aossie.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-stat-icon underline-offset-4 transition-colors hover:underline"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>

          {/* Same type scale as SectionHeading's h2, so every headline on the page matches */}
          <h1 className="col-span-full text-3xl leading-[1.08] font-light tracking-tight text-foreground-primary [--pd:18] [--pr:1.2] motion-safe:parallax sm:text-4xl lg:mt-4 lg:text-[3.25rem]">
            {mottoLines.map(([key, delay]) => (
              <span key={key} className="block pb-1 lg:pb-0.5">
                <i className={`inline-block not-italic motion-safe:animate-enter-up ${delay}`}>{t.rich(key, { hl: highlight })}</i>
              </span>
            ))}
          </h1>

          <p className="col-span-full mt-8 max-w-xl text-sm leading-relaxed font-light text-foreground-secondary [--d:550ms] [--pd:14] [--pr:1] motion-safe:parallax motion-safe:animate-enter-up sm:text-base lg:mt-2.5 lg:max-w-[40rem] lg:text-[0.93rem] lg:leading-[1.35rem]">
            {t.rich("mottoSubtitle", { br: () => <br className="max-sm:hidden" /> })}
          </p>

          {/* Hero model, with the liquid-metal button resting on its raised hands.
              Phones: the box grows to fill the rest of the screen; its 263:481 ratio reserves room above the model for the button. */}
          <div className="relative mt-4 flex min-h-0 w-full flex-1 justify-center lg:col-start-2 lg:row-start-4 lg:mt-22 lg:block lg:w-auto">
            <div className="relative aspect-[263/481] h-full max-w-xs lg:aspect-[263/385] lg:h-auto lg:w-59 lg:max-w-none">
              <div className="absolute inset-x-0 bottom-0 aspect-[263/385]">
                <figure className="absolute inset-0 isolate filter-(--model-shadow) [--d:700ms] [--pd:16] [--pr:1.5] motion-safe:parallax motion-safe:animate-enter-rise">
                  <Image
                    src="/brand/assets/hero-model.webp"
                    alt={t("modelAlt")}
                    fill
                    priority
                    sizes="(min-width: 1024px) 240px, 320px"
                    className="object-contain"
                  />
                </figure>

                <div className="absolute bottom-full left-1/2 z-10 aspect-[41/27] w-[156%] -translate-x-1/2 translate-y-[38%] filter-(--pill-shadow) clip-pill [--pd:12] [--pr:1] motion-safe:parallax">
                  <div className="absolute inset-0 [--d:950ms] motion-safe:animate-enter-soft">
                    <LiquidMetalButton
                      href={PLAY_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="hero"
                      title={t("downloadFrame")}
                      aria-label={t("downloadFrame")}
                    >
                      {t("downloadNow")}
                    </LiquidMetalButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Stat
          className="[--d:1050ms] [--pd:12] lg:col-start-1 lg:row-start-4 lg:ml-8 lg:justify-self-start"
          title={t("dailyTitle")}
          value={t("dailyValue")}
          icon={
            <>
              <circle cx="15" cy="15" r="10.5" strokeDasharray="0.6 3.6" />
              <path d="M15 8.5V15l4.2 2.8" />
              <circle cx="15" cy="15" r="1.1" fill="currentColor" stroke="none" />
            </>
          }
        />

        <Stat
          className="[--d:1150ms] [--pd:13] lg:col-start-3 lg:row-start-4 lg:mr-8 lg:justify-self-end"
          title={t("safetyTitle")}
          value={t("safetyValue")}
          icon={
            <>
              <path d="M15 3.5 24.5 7v7.2c0 5.8-4 10.3-9.5 12.3-5.5-2-9.5-6.5-9.5-12.3V7Z" />
              <path d="m11 15.2 2.9 2.9 5.3-5.8" />
            </>
          }
        />

        {/* Ghost wordmark: an SVG so its letters always span the container, tucked behind the model */}
        <svg
          viewBox="0 0 1000 70"
          aria-hidden="true"
          className="pointer-events-none col-span-full -mt-[5.5%] w-full overflow-visible fill-ghost select-none [--d:650ms] motion-safe:animate-enter-up"
        >
          {/* x is nudged right by half the trailing letter-spacing so the glyphs sit centred */}
          <text x="505" y="68" fontSize="94" textAnchor="middle" className="tracking-[0.117em]">
            {t("ghostWordmark")}
          </text>
        </svg>

        {/* Segregation band */}
        <div
          aria-hidden="true"
          className="pointer-events-none relative col-span-full -mt-[1.75%] flex w-full max-w-5xl items-center justify-center"
        >
          <span className="absolute top-1/2 left-1/2 h-0.5 w-4/5 -translate-x-1/2 -translate-y-1/2 bg-(image:--band-glow) drop-shadow-glow [--d:1150ms] motion-safe:animate-enter-grow" />
          <span className="relative inline-flex items-center gap-2 rounded-full border border-band-border bg-band-bg px-4 py-1.5 shadow-band-pill backdrop-blur-md [--d:1250ms] motion-safe:animate-enter-up">
            <span className="size-1.5 flex-none rounded-full bg-band-dot shadow-dot" />
            <span className="max-w-60 text-[9px] font-semibold tracking-[0.17em] text-balance text-band-text uppercase sm:max-w-none sm:text-[0.625rem]">
              {t("heroBand")}
            </span>
          </span>
        </div>
      </section>
    </>
  );
}
