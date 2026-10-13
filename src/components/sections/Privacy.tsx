import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight, CloudOff, Cpu, Database, Lock, ShieldCheck, Smartphone, Trash2 } from "lucide-react";
import { container } from "@/components/container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading, highlight } from "@/components/ui/SectionHeading";
import { section } from "@/components/ui/styles";
import { PRIVACY_POLICY_URL } from "@/config/links";

const points = [
  ["storage", Database],
  ["ai", Cpu],
  ["ads", ShieldCheck],
  ["control", Trash2],
] as const;

const chips = ["age", "goals", "injuries", "history", "feedback", "notes"] as const;

/**
 * Data orbits the phone inside a sealed boundary. Each chip sits on an arm rotated to its angle;
 * the arm's counter-rotation plus the orbit's reverse spin keep every label upright.
 */
function Vault() {
  const t = useTranslations("Privacy");
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[32rem]">
      <span className="absolute inset-[8%] rounded-full bg-(image:--hero-gradient) opacity-70 blur-2xl" />
      {["inset-0", "inset-[14%]", "inset-[30%]"].map((inset, i) => (
        <span
          key={inset}
          className={`absolute ${inset} rounded-full border ${i === 0 ? "border-border-strong" : "border-dashed border-border-default"}`}
        />
      ))}

      {/* The boundary's lock */}
      <span className="absolute top-[3%] left-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-border-strong bg-surface-raised text-highlight shadow-card">
        <Lock className="size-4" />
      </span>

      <div className="absolute inset-[14%] motion-safe:animate-orbit [--orbit-duration:48s]">
        {chips.map((id, i) => {
          const angle = (360 / chips.length) * i;
          return (
            <div key={id} className="absolute inset-0" style={{ rotate: `${angle}deg` }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ rotate: `${-angle}deg` } as CSSProperties}>
                <span className="block rounded-full border border-border-default bg-surface-raised px-3 py-1.5 text-xs font-medium whitespace-nowrap text-foreground-secondary shadow-card motion-safe:animate-orbit-counter [--orbit-duration:48s]">
                  {t(`chips.${id}`)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* The device at the centre */}
      <div className="absolute inset-[34%] grid place-items-center rounded-[28%] border border-border-strong bg-surface-raised shadow-card">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <Smartphone className="size-8 text-highlight" strokeWidth={1.4} />
          <span className="text-xs font-medium text-foreground-secondary">{t("device")}</span>
        </div>
      </div>

      {/* Outside the boundary: nothing gets through */}
      <div className="absolute -right-2 bottom-[4%] flex items-center gap-2 rounded-full border border-dashed border-danger/40 bg-surface-raised px-3.5 py-2 text-xs font-semibold text-danger shadow-card sm:right-0">
        <CloudOff className="size-4" />
        {t("cloud")}
      </div>
    </div>
  );
}

export default function Privacy() {
  const t = useTranslations("Privacy");

  return (
    <section id="privacy" aria-labelledby="privacy-title" className={`${section} overflow-x-clip`}>
      <div className={`${container} grid items-center gap-16 lg:grid-cols-2 lg:gap-12`}>
        <div>
          <SectionHeading
            id="privacy-title"
            align="left"
            eyebrow={t("eyebrow")}
            title={t.rich("title", { hl: highlight })}
            subtitle={t("subtitle")}
          />

          <ul className="mt-12 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {points.map(([key, Icon], i) => (
              <Reveal as="li" key={key} delay={i * 80} className="flex gap-4">
                <span className="grid size-10 flex-none place-items-center rounded-xl border border-border-subtle bg-surface text-highlight">
                  <Icon className="size-4.5" />
                </span>
                <span>
                  <span className="block font-medium text-foreground-primary">{t(`points.${key}.title`)}</span>
                  <span className="mt-1 block text-sm leading-relaxed font-light text-foreground-muted">{t(`points.${key}.body`)}</span>
                </span>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={320} className="mt-10">
            <a
              href={PRIVACY_POLICY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-highlight underline-offset-4 hover:underline"
            >
              {t("policy")}
              <ArrowUpRight className="size-4 transition-transform duration-300 ease-spring group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <Vault />
        </Reveal>
      </div>
    </section>
  );
}
