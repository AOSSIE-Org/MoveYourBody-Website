"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ChartColumn, Check, CirclePlus, Dumbbell, Flame, House, Mic, Pause, Play, Rocket, SkipForward, User } from "lucide-react";

/*
 * Recreations of MoveYourBody's own screens, in the app's dark palette (see the app repo's
 * brand/brand.md). All sizes are in cqw so a screen scales with whatever PhoneFrame holds it.
 * `active` lets a screen play its small entrance details when it comes into focus.
 */

interface ScreenProps {
  active?: boolean;
}

function StatusBar() {
  return (
    <div aria-hidden="true" className="flex items-center justify-between px-[8cqw] pt-[4cqw] text-[3.3cqw] font-semibold">
      <span>9:41</span>
      <span className="flex items-center gap-[1.2cqw]">
        <span className="flex items-end gap-[0.5cqw]">
          {[1.4, 2, 2.6, 3.2].map((h) => (
            <span key={h} className="w-[0.8cqw] rounded-full bg-white" style={{ height: `${h}cqw` }} />
          ))}
        </span>
        <span className="relative h-[2.8cqw] w-[5.6cqw] rounded-[0.8cqw] border-[0.35cqw] border-white/80 p-[0.35cqw]">
          <span className="block h-full w-3/4 rounded-[0.3cqw] bg-white" />
        </span>
      </span>
    </div>
  );
}

function Screen({ active, children }: ScreenProps & { children: React.ReactNode }) {
  return (
    <div data-active={active ? "true" : "false"} className="group/screen flex size-full flex-col">
      <StatusBar />
      {children}
    </div>
  );
}

const primaryButton =
  "flex items-center justify-center gap-[2cqw] rounded-[4cqw] bg-app-primary py-[3.8cqw] text-[4cqw] font-bold text-app-bg";

/** Staggered entrance for items inside an active screen */
const stagger = (i: number) =>
  ({ transitionDelay: `${120 + i * 90}ms` }) as React.CSSProperties;
const enterItem =
  "transition-[opacity,translate] duration-700 ease-fluid opacity-0 translate-y-[3cqw] group-data-[active=true]/screen:opacity-100 group-data-[active=true]/screen:translate-y-0";

export function OnboardingScreen({ active }: ScreenProps) {
  const t = useTranslations("Mock.onboarding");
  const goals = [
    ["strength", true],
    ["mobility", true],
    ["active", false],
    ["weight", false],
  ] as const;

  return (
    <Screen active={active}>
      <div className="flex flex-1 flex-col px-[6.5cqw] pt-[9cqw] pb-[7cqw]">
        <div className="flex gap-[1.5cqw]">
          {[true, false, false].map((done, i) => (
            <span key={i} className={`h-[1.1cqw] flex-1 rounded-full ${done ? "bg-app-primary" : "bg-app-divider"}`} />
          ))}
        </div>
        <p className="mt-[7cqw] text-[6.6cqw] leading-tight font-bold">{t("title")}</p>
        <p className="mt-[1.5cqw] text-[3.6cqw] text-app-text-secondary">{t("subtitle")}</p>

        <div className="mt-[5cqw] grid grid-cols-2 gap-[2.6cqw]">
          {goals.map(([id, selected], i) => (
            <div
              key={id}
              style={stagger(i)}
              className={`${enterItem} relative rounded-[4cqw] border p-[3.6cqw] pr-[7cqw] text-[3.5cqw] leading-snug font-medium ${
                selected ? "border-app-primary-light bg-app-card-selected" : "border-app-divider bg-app-card"
              }`}
            >
              {t(`goals.${id}`)}
              {selected && (
                <Check className="absolute top-[3cqw] right-[2.6cqw] size-[4cqw] text-app-primary-light" strokeWidth={3} />
              )}
            </div>
          ))}
        </div>

        <p className="mt-[7cqw] text-[4cqw] font-semibold">{t("injuries")}</p>
        <div className="mt-[3cqw] flex flex-wrap gap-[2cqw]">
          <span className="rounded-full border border-app-primary-light bg-app-card-selected px-[3.6cqw] py-[1.8cqw] text-[3.4cqw]">
            {t("knee")}
          </span>
          <span className="rounded-full border border-app-divider bg-app-card px-[3.6cqw] py-[1.8cqw] text-[3.4cqw] text-app-text-secondary">
            {t("back")}
          </span>
        </div>

        <div className={`${primaryButton} mt-auto`}>{t("continue")}</div>
      </div>
    </Screen>
  );
}

/** Deterministic "embedding" pattern so server and client render the same dots */
const embedding = Array.from({ length: 48 }, (_, i) => ((i * 37 + 11) % 17) / 16);

export function UnderstandScreen({ active }: ScreenProps) {
  const t = useTranslations("Mock.understand");
  const tags = [
    ["mobility", 0.82],
    ["lowerBack", 0.77],
    ["posture", 0.71],
    ["core", 0.64],
  ] as const;

  return (
    <Screen active={active}>
      <div className="flex flex-1 flex-col px-[6.5cqw] pt-[9cqw] pb-[7cqw]">
        <p className="text-[6.6cqw] font-bold">{t("title")}</p>

        <div className="mt-[5cqw] rounded-[4cqw] border border-app-border bg-app-card p-[4cqw] text-[3.7cqw] leading-snug">
          “{t("input")}”
        </div>

        {/* Embedding grid: the sentence becomes a vector */}
        <div className="mt-[5cqw] grid grid-cols-12 gap-[1.6cqw] rounded-[4cqw] bg-app-surface p-[4cqw]">
          {embedding.map((v, i) => (
            <span
              key={i}
              className="aspect-square rounded-full bg-app-primary-light transition-opacity duration-700"
              style={{ opacity: active ? 0.15 + v * 0.85 : 0.12, transitionDelay: `${(i % 12) * 30}ms` }}
            />
          ))}
        </div>

        <div className="mt-[5cqw] space-y-[3.2cqw]">
          {tags.map(([id, score], i) => (
            <div key={id} className="text-[3.4cqw]">
              <div className="flex justify-between">
                <span className="font-medium">{t(`tags.${id}`)}</span>
                <span className="font-mono text-app-primary-light">{score.toFixed(2)}</span>
              </div>
              <div className="mt-[1.4cqw] h-[1.4cqw] rounded-full bg-app-divider">
                <div
                  className="h-full origin-left scale-x-0 rounded-full bg-app-primary transition-transform duration-1000 ease-fluid group-data-[active=true]/screen:scale-x-100"
                  style={{ width: `${score * 100}%`, transitionDelay: `${300 + i * 120}ms` }}
                />
              </div>
            </div>
          ))}
        </div>

        <span className="mt-auto self-center rounded-full border border-app-border px-[3.6cqw] py-[1.6cqw] font-mono text-[2.9cqw] text-app-primary-light">
          {t("model")}
        </span>
      </div>
    </Screen>
  );
}

const week = [
  ["M", 3],
  ["T", 4],
  ["W", 5],
  ["T", 6],
  ["F", 7],
  ["S", 8],
] as const;

export function SessionScreen({ active, excluded = true }: ScreenProps & { excluded?: boolean }) {
  const t = useTranslations("Mock.session");
  const tx = useTranslations("Exercises");
  const exercises = [
    ["catCow", "beginner"],
    ["gluteBridge", "beginner"],
    ["birdDog", "intermediate"],
  ] as const;

  return (
    <Screen active={active}>
      <div className="flex flex-1 flex-col px-[5cqw] pt-[8cqw]">
        <div className="flex justify-between gap-[1.6cqw]">
          {week.map(([d, n], i) => {
            const today = i === week.length - 1;
            return (
              <div
                key={n}
                className={`flex flex-1 flex-col items-center rounded-[3.4cqw] py-[1.8cqw] text-[3cqw] ${
                  today ? "bg-white text-app-bg" : "bg-app-primary text-app-bg"
                }`}
              >
                <span className="opacity-70">{d}</span>
                <span className="text-[4cqw] font-semibold">{n}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-[6cqw] rounded-[5cqw] border border-app-border/60 bg-app-card p-[4cqw]">
          <div className="flex items-center gap-[3cqw]">
            <span className="grid size-[10cqw] place-items-center rounded-[3cqw] bg-app-card-selected">
              <Flame className="size-[5cqw] text-app-primary-light" />
            </span>
            <div>
              <p className="text-[5cqw] leading-tight font-semibold">{t("title")}</p>
              <p className="text-[3.2cqw] text-app-text-secondary">{t("subtitle")}</p>
            </div>
          </div>

          <div className="mt-[4cqw] space-y-[2.4cqw]">
            {exercises.map(([id, level], i) => (
              <div
                key={id}
                style={stagger(i)}
                className={`${enterItem} flex items-center gap-[3cqw] rounded-[4cqw] border border-app-border/40 bg-app-card-selected/60 p-[3cqw]`}
              >
                <span className="grid size-[9cqw] flex-none place-items-center rounded-full bg-app-card">
                  <Dumbbell className="size-[4.4cqw] -rotate-45 text-app-primary-light" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[3.8cqw] font-medium">{tx(id)}</p>
                  <span className="mt-[1cqw] inline-block rounded-full bg-app-card px-[2.4cqw] py-[0.6cqw] text-[2.6cqw] font-semibold tracking-wider text-app-primary-light uppercase">
                    {t(`levels.${level}`)}
                  </span>
                </div>
              </div>
            ))}
            {excluded && (
              <div
                style={stagger(3)}
                className={`${enterItem} flex items-center justify-between gap-[2cqw] rounded-[4cqw] border border-dashed border-app-warning/40 px-[3cqw] py-[2.4cqw] text-[3.2cqw]`}
              >
                <span className="truncate text-app-text-secondary line-through">{tx("jumpSquats")}</span>
                <span className="flex-none rounded-full bg-app-warning/15 px-[2.2cqw] py-[0.6cqw] text-[2.6cqw] font-semibold text-app-warning">
                  {t("excluded")}
                </span>
              </div>
            )}
          </div>

          <div className={`${primaryButton} mt-[4cqw]`}>
            <Play className="size-[3.6cqw] fill-current" />
            {t("start")}
          </div>
        </div>

        <div className="mt-auto mb-[3cqw] flex items-center justify-between rounded-[6cqw] bg-app-surface p-[2cqw]">
          <span className="flex items-center gap-[1.6cqw] rounded-[5cqw] bg-app-primary px-[3.6cqw] py-[2.4cqw] text-[3.2cqw] font-semibold text-app-bg">
            <House className="size-[4cqw]" />
          </span>
          {[Rocket, CirclePlus, ChartColumn, User].map((Icon, i) => (
            <Icon key={i} className="mx-[2.4cqw] size-[4.6cqw] text-app-text-secondary" />
          ))}
        </div>
      </div>
    </Screen>
  );
}

/** A figure doing glute bridges, drawn with SMIL so it costs nothing on the main thread */
function BridgeFigure() {
  const ref = useRef<SVGSVGElement>(null);

  // SMIL ignores prefers-reduced-motion, so pause it by hand
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) ref.current?.pauseAnimations();
  }, []);

  const down = "44,74 96,74 128,50 150,78";
  const up = "44,74 96,52 130,46 150,78";
  const spline = "0.45 0 0.55 1;0.45 0 0.55 1";

  return (
    <svg ref={ref} viewBox="0 0 190 96" aria-hidden="true" className="w-full">
      <ellipse cx="96" cy="82" rx="82" ry="5" className="fill-black/10" />
      <circle cx="32" cy="70" r="8" className="fill-figure-hair" />
      <polyline points={down} fill="none" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" className="stroke-figure-shirt">
        <animate attributeName="points" values={`${down};${up};${down}`} dur="2.6s" repeatCount="indefinite" calcMode="spline" keySplines={spline} />
      </polyline>
      <polyline points="44,74 76,80" fill="none" strokeWidth="7" strokeLinecap="round" className="stroke-figure-skin" />
      <circle cx="150" cy="78" r="4" className="fill-figure-shoe" />
    </svg>
  );
}

export function WorkoutScreen({ active }: ScreenProps) {
  const t = useTranslations("Mock.workout");
  const tx = useTranslations("Exercises");

  return (
    <Screen active={active}>
      <div className="flex flex-1 flex-col items-center px-[5cqw] pt-[6cqw] pb-[8cqw]">
        <div className="flex aspect-[4/3] w-full items-end overflow-hidden rounded-[5cqw] border border-app-border/60 bg-white px-[5cqw] pb-[4cqw]">
          <BridgeFigure />
        </div>

        <span className="mt-[6cqw] rounded-full border border-app-primary/70 bg-app-card px-[5cqw] py-[1.6cqw] text-[3.2cqw] font-semibold tracking-[0.2em] text-app-primary-light uppercase">
          {t("tag")}
        </span>
        <p className="mt-[4cqw] text-[6.6cqw] font-semibold">{tx("gluteBridge")}</p>

        <div className="relative mt-[5cqw] grid size-[44cqw] place-items-center">
          <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 -rotate-90">
            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="4" className="stroke-app-divider" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="283"
              className="stroke-app-primary motion-safe:animate-ring"
            />
          </svg>
          <span className="text-[19cqw] leading-none font-semibold tabular-nums">27</span>
        </div>

        <div className="mt-auto flex w-full items-center justify-between px-[4cqw]">
          <span className="rounded-full border border-white/25 px-[3.4cqw] py-[2.4cqw] text-[3.4cqw] font-semibold">
            {t("plus")}
          </span>
          <span className="grid size-[17cqw] place-items-center rounded-full border-[0.8cqw] border-app-primary bg-app-card">
            <Pause className="size-[6cqw] fill-app-primary text-app-primary" />
          </span>
          <SkipForward className="size-[7cqw] fill-app-text-secondary text-app-text-secondary" />
        </div>

        {/* Voice command bubble */}
        <div className="absolute top-[31%] right-[7cqw] flex items-center gap-[1.6cqw] rounded-full border border-app-primary/50 bg-app-surface/90 px-[3cqw] py-[1.8cqw] text-[3.2cqw] font-semibold shadow-lg transition-[opacity,scale] delay-500 duration-500 ease-spring group-data-[active=false]/screen:scale-75 group-data-[active=false]/screen:opacity-0">
          <span className="relative grid size-[5cqw] place-items-center">
            <span className="absolute inset-0 rounded-full bg-app-primary motion-safe:animate-ping-soft" />
            <Mic className="relative size-[3.4cqw] text-app-primary-light" />
          </span>
          {t("heard")}
        </div>
      </div>
    </Screen>
  );
}

export function FeedbackScreen({ active }: ScreenProps) {
  const t = useTranslations("Mock.feedback");
  const options = [
    ["easy", "bg-app-info"],
    ["right", "bg-app-primary"],
    ["hard", "bg-app-warning"],
  ] as const;
  const sessions = [0.5, 0.7, 0, 0.8, 0.6, 0.9, 1];

  return (
    <Screen active={active}>
      <div className="flex flex-1 flex-col px-[6.5cqw] pt-[9cqw] pb-[7cqw]">
        <p className="text-[6.6cqw] font-bold">{t("title")}</p>

        <div className="mt-[5cqw] space-y-[2.6cqw]">
          {options.map(([id, dot], i) => {
            const selected = id === "right";
            return (
              <div
                key={id}
                style={stagger(i)}
                className={`${enterItem} flex items-center gap-[3cqw] rounded-[4cqw] border p-[3.6cqw] text-[3.8cqw] font-medium ${
                  selected ? "border-app-primary-light bg-app-card-selected" : "border-app-divider bg-app-card"
                }`}
              >
                <span className={`size-[2.6cqw] rounded-full ${dot}`} />
                {t(`options.${id}`)}
                {selected && <Check className="ml-auto size-[4.4cqw] text-app-primary-light" strokeWidth={3} />}
              </div>
            );
          })}
        </div>

        <p className="mt-[6cqw] text-[3.4cqw] text-app-text-secondary">{t("intensity")}</p>
        <div className="mt-[2cqw] flex gap-[1.2cqw]">
          {Array.from({ length: 10 }, (_, i) => (
            <span
              key={i}
              className={`h-[3cqw] flex-1 rounded-full transition-colors duration-500 ${
                i < 5 || (active && i === 5) ? "bg-app-primary" : "bg-app-divider"
              }`}
              style={{ transitionDelay: i === 5 ? "700ms" : undefined }}
            />
          ))}
        </div>

        <div className="mt-auto rounded-[5cqw] border border-app-border/60 bg-app-card p-[4cqw]">
          <p className="text-[3.2cqw] text-app-text-secondary">{t("next")}</p>
          <p className="text-[4.2cqw] font-semibold">{t("adapted")}</p>
          <div className="mt-[3cqw] flex h-[14cqw] items-end gap-[2cqw]">
            {sessions.map((h, i) => (
              <span
                key={i}
                className="flex-1 origin-bottom scale-y-0 rounded-t-[1.4cqw] bg-app-primary transition-transform duration-700 ease-fluid group-data-[active=true]/screen:scale-y-100"
                style={{ height: `${Math.max(h, 0.06) * 100}%`, opacity: h ? 1 : 0.3, transitionDelay: `${300 + i * 70}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </Screen>
  );
}
