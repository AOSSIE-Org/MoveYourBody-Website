"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { useTranslations } from "next-intl";
import { container } from "@/components/container";
import {
  FeedbackScreen,
  OnboardingScreen,
  SessionScreen,
  UnderstandScreen,
  WorkoutScreen,
} from "@/components/mockups/AppScreens";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { SectionHeading, highlight } from "@/components/ui/SectionHeading";
import { section } from "@/components/ui/styles";

const steps = [
  ["onboard", OnboardingScreen],
  ["understand", UnderstandScreen],
  ["filter", SessionScreen],
  ["move", WorkoutScreen],
  ["adapt", FeedbackScreen],
] as const satisfies readonly (readonly [string, ComponentType<{ active?: boolean }>])[];

/** Which step is crossing the middle of the viewport */
function useActiveStep(refs: React.RefObject<(HTMLLIElement | null)[]>) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    for (const el of refs.current) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [refs]);

  return active;
}

export default function HowItWorks() {
  const t = useTranslations("HowItWorks");
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const active = useActiveStep(stepRefs);
  const progress = (active + 1) / steps.length;

  return (
    <section id="how-it-works" aria-labelledby="how-title" className={`${section} border-y border-border-subtle bg-section-alt`}>
      <div className={container}>
        <SectionHeading
          id="how-title"
          eyebrow={t("eyebrow")}
          title={t.rich("title", { hl: highlight })}
          subtitle={t("subtitle")}
        />

        <div className="mt-14 grid gap-12 sm:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-20">
          <ol className="relative">
            {/* Progress rail */}
            <span aria-hidden="true" className="absolute top-3 bottom-3 left-5 w-px bg-border-default">
              <span
                className="absolute inset-0 origin-top bg-highlight transition-transform duration-700 ease-fluid"
                style={{ scale: `1 ${progress}` }}
              />
            </span>

            {steps.map(([id, Screen], i) => {
              const isActive = active === i;
              return (
                <li
                  key={id}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  data-index={i}
                  className="relative flex gap-6 pb-16 last:pb-0 sm:gap-8 lg:min-h-[72svh] lg:items-center lg:pb-0"
                >
                  <span
                    aria-hidden="true"
                    className={`relative z-10 grid size-10 flex-none place-items-center rounded-full border font-mono text-sm transition-[background-color,border-color,color,scale] duration-500 ease-spring lg:self-center ${
                      isActive
                        ? "scale-110 border-highlight bg-highlight text-highlight-contrast"
                        : "border-border-default bg-background-primary text-foreground-muted"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className={`min-w-0 transition-opacity duration-500 lg:max-w-md ${isActive ? "opacity-100" : "lg:opacity-35"}`}>
                    <p className="text-[0.625rem] font-semibold tracking-[0.2em] text-highlight uppercase">{t("step", { n: i + 1 })}</p>
                    <h3 className="mt-2 text-2xl font-light tracking-tight text-balance text-foreground-primary sm:text-3xl">
                      {t(`steps.${id}.title`)}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed font-light text-pretty text-foreground-muted">{t(`steps.${id}.body`)}</p>

                    {/* Phones and tablets: each step carries its own screen */}
                    <PhoneFrame className="mt-8 w-[min(15rem,68vw)] lg:hidden">
                      <Screen active={isActive} />
                    </PhoneFrame>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Desktop: one phone pinned beside the steps, swapping screens as they scroll past */}
          <div className="hidden lg:block" aria-hidden="true">
            <div className="sticky top-[calc(50svh-min(18rem,(100svh-8rem)/2))]">
              <div className="relative mx-auto w-[min(17rem,calc((100svh-8rem)*9/19))]">
                <span className="absolute -inset-16 -z-10 rounded-full bg-(image:--hero-gradient) opacity-80 blur-2xl" />
                <PhoneFrame>
                  {steps.map(([id, Screen], i) => (
                    <div
                      key={id}
                      className={`absolute inset-0 transition-[opacity,translate,scale] duration-700 ease-fluid ${
                        active === i ? "opacity-100" : `pointer-events-none opacity-0 ${i < active ? "-translate-y-6" : "translate-y-6"} scale-[0.97]`
                      }`}
                    >
                      <Screen active={active === i} />
                    </div>
                  ))}
                </PhoneFrame>
              </div>
              <div className="mt-8 flex justify-center gap-2">
                {steps.map(([id], i) => (
                  <span
                    key={id}
                    className={`h-1.5 rounded-full transition-[width,background-color] duration-500 ease-fluid ${
                      active === i ? "w-6 bg-highlight" : "w-1.5 bg-border-strong"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
