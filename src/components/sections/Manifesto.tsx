import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { container } from "@/components/container";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { eyebrow } from "@/components/ui/styles";

const statKeys = ["session", "exercises", "library", "servers"] as const;

/** Words light up across this slice of the paragraph's pass through the viewport (view-timeline %) */
const RANGE_START = 12;
const RANGE_SPAN = 38;

function Marquee({ words }: { words: string[] }) {
  // Two identical halves (each doubled so one half outspans wide screens); -50% then loops seamlessly
  const run = [...words, ...words, ...words, ...words];
  return (
    <div aria-hidden="true" className="relative -mx-[5%] -rotate-2 overflow-hidden border-y border-border-strong bg-brand-gold py-3 text-app-bg shadow-band-pill sm:py-4">
      <div className="flex w-max motion-safe:animate-marquee [--marquee-duration:32s]">
        {run.map((word, i) => (
          <span key={i} className="flex items-center gap-6 pr-6 text-lg font-semibold tracking-[0.18em] uppercase sm:text-2xl">
            {word}
            <svg viewBox="0 0 10 10" className="size-2.5 fill-brand-green">
              <path d="M5 0 6.2 3.8 10 5 6.2 6.2 5 10 3.8 6.2 0 5 3.8 3.8Z" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Manifesto() {
  const t = useTranslations("Manifesto");
  const lead = t("lead").split(" ");
  const words = [...lead, ...t("text").split(" ")];

  return (
    <section id="manifesto" aria-label={t("eyebrow")} className="relative isolate overflow-x-clip pt-6 pb-4">
      <Marquee words={t.raw("marquee") as string[]} />

      <div className={`${container} mt-20 sm:mt-28 lg:mt-36`}>
        <Reveal>
          <span className={eyebrow}>
            <span aria-hidden="true" className="size-1.5 rounded-full bg-band-dot shadow-dot" />
            {t("eyebrow")}
          </span>
        </Reveal>

        <p className="scroll-words mt-8 max-w-5xl text-[1.75rem] leading-[1.2] font-light tracking-tight text-balance text-foreground-primary sm:text-4xl lg:text-[3.4rem]">
          {words.map((word, i) => {
            const at = RANGE_START + (i / words.length) * RANGE_SPAN;
            return (
              <span
                key={i}
                className={`word ${i < lead.length ? "font-normal text-highlight" : ""}`}
                style={{ animationRange: `cover ${at}% cover ${at + 6}%` } as CSSProperties}
              >
                {word}{" "}
                {/* The body copy starts on its own line after the lead */}
                {i === lead.length - 1 && <br />}
              </span>
            );
          })}
        </p>

        <dl className="mt-16 grid grid-cols-2 border-t border-border-default sm:mt-24 lg:grid-cols-4">
          {statKeys.map((key, i) => (
            <Reveal
              key={key}
              delay={i * 90}
              className={`flex flex-col gap-2 border-border-default py-8 pr-4 ${i % 2 ? "pl-6 sm:pl-8" : ""} ${
                i > 0 ? "lg:border-l lg:pl-8" : ""
              } ${i % 2 ? "border-l" : ""} ${i > 1 ? "border-t lg:border-t-0" : ""}`}
            >
              <dt className="order-2 text-sm font-light text-foreground-muted">{t(`stats.${key}.label`)}</dt>
              <dd className="order-1 flex items-baseline gap-1.5 text-5xl font-light tracking-tight text-foreground-primary sm:text-6xl">
                <CountUp value={t(`stats.${key}.value`)} />
                {t(`stats.${key}.unit`) && <span className="text-lg text-highlight">{t(`stats.${key}.unit`)}</span>}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
