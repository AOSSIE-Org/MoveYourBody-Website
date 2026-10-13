"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  Bell,
  Check,
  ChevronRight,
  ChartColumn,
  Cpu,
  Mic,
  PencilRuler,
  PersonStanding,
  Plane,
  Search,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Timer,
  TrendingUp,
  Volume2,
  WifiOff,
  X,
} from "lucide-react";
import type { Messages } from "@/i18n/messages";
import { container } from "@/components/container";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading, highlight } from "@/components/ui/SectionHeading";
import { SpotlightGroup } from "@/components/ui/Spotlight";
import { card, chip, section } from "@/components/ui/styles";
import { useInView } from "@/components/ui/useInView";

type ExerciseId = keyof Messages["Exercises"];

/** Inset panel that holds each card's live demo */
const panel = "rounded-2xl border border-border-subtle bg-surface-raised p-4";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  body?: string;
  /** Spans two columns and sets the demo beside the copy on large screens */
  wide?: boolean;
  delay?: number;
  children?: ReactNode;
}

function FeatureCard({ icon, title, body, wide = false, delay = 0, children }: FeatureCardProps) {
  return (
    <Reveal as="article" delay={delay} className={wide ? "md:col-span-2" : undefined}>
      <div
        data-spotlight
        className={`${card} flex h-full flex-col gap-6 p-6 sm:p-7 ${wide ? "lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-10" : ""}`}
      >
        <div aria-hidden="true" className="spotlight pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />
        <div>
          <span className="grid size-11 place-items-center rounded-2xl bg-highlight-soft text-highlight transition-transform duration-500 ease-spring group-hover/card:scale-110 group-hover/card:-rotate-6">
            {icon}
          </span>
          <h3 className="mt-5 text-xl font-normal tracking-tight text-foreground-primary sm:text-[1.375rem]">{title}</h3>
          {body && <p className="mt-2 text-sm leading-relaxed font-light text-pretty text-foreground-muted">{body}</p>}
        </div>
        {children && <div className="mt-auto lg:mt-0">{children}</div>}
      </div>
    </Reveal>
  );
}

/* ---------------------------------------------------------------- Personalized */

const goals = ["strength", "mobility", "cardio"] as const;
const regions = ["upper", "core", "lower"] as const;
const equipment = ["none", "dumbbells"] as const;
type Goal = (typeof goals)[number];
type Region = (typeof regions)[number];
type Equipment = (typeof equipment)[number];

const strengthPlans: Record<Region, Record<Equipment, ExerciseId[]>> = {
  upper: { none: ["pushUps", "pikePushUps", "armCircles"], dumbbells: ["dumbbellRow", "shoulderPress", "bicepCurl"] },
  core: { none: ["plank", "deadBug", "bicycleCrunch"], dumbbells: ["russianTwist", "renegadeRow", "sideBend"] },
  lower: { none: ["squats", "gluteBridge", "lunges"], dumbbells: ["gobletSquat", "romanianDeadlift", "calfRaises"] },
};
const bodyweightPlans: Record<Exclude<Goal, "strength">, Record<Region, ExerciseId[]>> = {
  mobility: {
    upper: ["armCircles", "wallAngels", "catCow"],
    core: ["catCow", "birdDog", "deadBug"],
    lower: ["hipCircles", "worldsGreatest", "gluteBridge"],
  },
  cardio: {
    upper: ["jumpingJacks", "burpees", "mountainClimbers"],
    core: ["mountainClimbers", "highKnees", "bicycleCrunch"],
    lower: ["jumpSquats", "skaters", "highKnees"],
  },
};
const minutes: Record<Goal, number> = { strength: 6, mobility: 5, cardio: 7 };

function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  labelFor,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  labelFor: (v: T) => string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-1.5">
      <span className="w-full text-[0.625rem] font-semibold tracking-[0.18em] text-foreground-faint uppercase sm:w-20">{label}</span>
      {options.map((option) => (
        <button key={option} type="button" aria-pressed={value === option} onClick={() => onChange(option)} className={chip(value === option)}>
          {labelFor(option)}
        </button>
      ))}
    </div>
  );
}

function PersonalizedDemo() {
  const t = useTranslations("Features.personalized");
  const tx = useTranslations("Exercises");
  const [goal, setGoal] = useState<Goal>("strength");
  const [region, setRegion] = useState<Region>("core");
  const [gear, setGear] = useState<Equipment>("none");
  const plan = goal === "strength" ? strengthPlans[region][gear] : bodyweightPlans[goal][region];

  return (
    <div className={`${panel} space-y-4`}>
      <div className="space-y-2.5">
        <ChipGroup label={t("goalLabel")} options={goals} value={goal} onChange={setGoal} labelFor={(v) => t(`goals.${v}`)} />
        <ChipGroup label={t("regionLabel")} options={regions} value={region} onChange={setRegion} labelFor={(v) => t(`regions.${v}`)} />
        <ChipGroup label={t("equipmentLabel")} options={equipment} value={gear} onChange={setGear} labelFor={(v) => t(`equipment.${v}`)} />
      </div>
      <div className="rounded-xl bg-app-bg p-3.5 text-white" aria-live="polite">
        <div className="flex items-baseline justify-between px-1">
          <span className="text-sm font-semibold">{t("previewTitle")}</span>
          <span className="text-xs text-app-text-secondary">{t("previewMeta", { minutes: minutes[goal] })}</span>
        </div>
        {/* Keyed on the selection so the rows replay their entrance whenever the plan changes */}
        <ol key={`${goal}-${region}-${gear}`} className="mt-3 space-y-1.5">
          {plan.map((id, i) => (
            <li
              key={id}
              style={{ "--d": `${i * 70}ms` } as CSSProperties}
              className="flex items-center gap-3 rounded-lg border border-app-border/40 bg-app-card px-3 py-2 motion-safe:animate-list-in"
            >
              <span className="grid size-6 flex-none place-items-center rounded-md bg-app-card-selected font-mono text-xs text-app-primary-light">
                {i + 1}
              </span>
              <span className="flex-1 truncate text-sm">{tx(id)}</span>
              <span className="flex-none text-xs text-app-primary-light">{t(`dose.${goal}`)}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Short sessions */

function ShortDemo() {
  const t = useTranslations("Features.short");
  return (
    <div className="flex items-center gap-5">
      <div className="relative grid size-28 flex-none place-items-center">
        <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 -rotate-90">
          <circle cx="50" cy="50" r="45" fill="none" strokeWidth="5" className="stroke-border-default" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="283"
            className="stroke-highlight motion-safe:animate-ring"
          />
        </svg>
        <span className="text-center leading-none">
          <span className="block text-3xl font-light text-foreground-primary">5–7</span>
          <span className="text-xs text-foreground-muted">{t("unit")}</span>
        </span>
      </div>
      <div className="flex-1">
        {/* One fill sweeps across three exercise segments in step with the ring: each segment clips a
            300%-wide bar offset by its index, so a single scale animation drives all three */}
        <div aria-hidden="true" className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-border-subtle">
              <span className="absolute inset-y-0 w-[300%] origin-left bg-highlight motion-safe:animate-progress" style={{ left: `${-i * 100}%` }} />
            </span>
          ))}
        </div>
        <p className="pt-3 text-xs text-foreground-muted">{t("caption")}</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Voice */

const commands = ["start", "pause", "skip", "repeat"] as const;
type Command = (typeof commands)[number];

function VoiceDemo() {
  const t = useTranslations("Features.voice");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [command, setCommand] = useState<Command>("skip");
  const [touched, setTouched] = useState(false);

  // Cycle through the commands while on screen, until the visitor picks one
  useEffect(() => {
    if (!inView || touched || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setCommand((c) => commands[(commands.indexOf(c) + 1) % commands.length]);
    }, 2600);
    return () => window.clearInterval(id);
  }, [inView, touched]);

  return (
    <div ref={ref} className={`${panel} space-y-4`}>
      <div className="flex items-center gap-3">
        <span className="relative grid size-10 flex-none place-items-center rounded-full bg-highlight text-highlight-contrast">
          <span aria-hidden="true" className="absolute inset-1 rounded-full bg-highlight/50 motion-safe:animate-ping-soft" />
          <Mic className="relative size-4" />
        </span>
        <span aria-hidden="true" className="flex h-8 flex-1 items-center gap-1">
          {Array.from({ length: 18 }, (_, i) => (
            <span
              key={i}
              className="h-full flex-1 origin-center rounded-full bg-highlight/70 motion-safe:animate-wave"
              style={{ "--d": `${(i * 137) % 900}ms`, scale: `1 ${0.25 + ((i * 7) % 10) / 14}` } as CSSProperties}
            />
          ))}
        </span>
      </div>

      <div key={command} className="space-y-2 text-sm" aria-live="polite">
        <p className="ml-auto w-fit rounded-2xl rounded-br-md bg-highlight px-3.5 py-2 font-medium text-highlight-contrast motion-safe:animate-list-in">
          “{t(`commands.${command}`)}”
        </p>
        <p className="flex w-fit items-center gap-2 rounded-2xl rounded-bl-md border border-border-subtle bg-surface px-3.5 py-2 text-foreground-secondary [--d:250ms] motion-safe:animate-list-in">
          <Volume2 className="size-3.5 flex-none text-highlight" />
          {t(`replies.${command}`)}
        </p>
      </div>

      <div role="group" aria-label={t("hint")} className="flex flex-wrap gap-1.5">
        {commands.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={command === c}
            onClick={() => {
              setTouched(true);
              setCommand(c);
            }}
            className={chip(command === c)}
          >
            {t(`commands.${c}`)}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Adaptive */

const feelings = ["easy", "right", "hard"] as const;
type Feeling = (typeof feelings)[number];
const nextLevel: Record<Feeling, number> = { easy: 7, right: 6, hard: 5 };

function AdaptiveDemo() {
  const t = useTranslations("Features.adaptive");
  const [feeling, setFeeling] = useState<Feeling>("easy");
  const level = nextLevel[feeling];

  return (
    <div className={`${panel} grid gap-4 sm:grid-cols-2`}>
      <div>
        <p className="text-sm font-medium text-foreground-primary">{t("question")}</p>
        <div role="group" aria-label={t("question")} className="mt-3 flex flex-col gap-1.5">
          {feelings.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={feeling === f}
              onClick={() => setFeeling(f)}
              className={`${chip(feeling === f)} h-10 justify-between rounded-xl px-3.5`}
            >
              {t(`options.${f}`)}
              {feeling === f && <Check className="size-3.5" strokeWidth={3} />}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col rounded-xl bg-app-bg p-4 text-white" aria-live="polite">
        <span className="text-xs text-app-text-secondary">{t("next")}</span>
        <span key={feeling} className="mt-1 flex items-center gap-2 text-base font-semibold motion-safe:animate-list-in">
          <TrendingUp className={`size-4 text-app-primary-light transition-transform duration-500 ${feeling === "hard" ? "rotate-90" : feeling === "right" ? "rotate-45" : ""}`} />
          {t(`results.${feeling}`)}
        </span>
        <span className="mt-auto pt-5 text-[0.625rem] tracking-[0.18em] text-app-text-secondary uppercase">{t("intensity")}</span>
        <span className="mt-2 flex gap-1" aria-hidden="true">
          {Array.from({ length: 10 }, (_, i) => (
            <span
              key={i}
              className={`h-6 flex-1 rounded-sm transition-[background-color,scale] duration-500 ease-spring ${
                i < level ? "bg-app-primary" : "scale-y-50 bg-app-divider"
              }`}
              style={{ transitionDelay: `${i * 30}ms` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Safety */

const injuries = ["knee", "back", "shoulder"] as const;
type Injury = (typeof injuries)[number];
const safetyList: [ExerciseId, Injury | null][] = [
  ["jumpSquats", "knee"],
  ["supermanHold", "back"],
  ["pikePushUps", "shoulder"],
  ["gluteBridge", null],
];

function SafetyDemo() {
  const t = useTranslations("Features.safety");
  const tx = useTranslations("Exercises");
  const [sore, setSore] = useState<Injury[]>(["knee"]);
  const toggle = (injury: Injury) =>
    setSore((current) => (current.includes(injury) ? current.filter((i) => i !== injury) : [...current, injury]));

  return (
    <div className={`${panel} space-y-3`}>
      <div role="group" aria-label={t("label")} className="flex flex-wrap items-center gap-1.5">
        <span className="w-full text-[0.625rem] font-semibold tracking-[0.18em] text-foreground-faint uppercase">{t("label")}</span>
        {injuries.map((injury) => (
          <button key={injury} type="button" aria-pressed={sore.includes(injury)} onClick={() => toggle(injury)} className={chip(sore.includes(injury))}>
            {t(`injuries.${injury}`)}
          </button>
        ))}
      </div>
      <ul className="space-y-1.5" aria-live="polite">
        {safetyList.map(([id, risk]) => {
          const excluded = risk !== null && sore.includes(risk);
          return (
            <li
              key={id}
              className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm transition-[opacity,border-color] duration-300 ${
                excluded ? "border-dashed border-danger/40 opacity-60" : "border-border-subtle"
              }`}
            >
              <span className={`truncate transition-colors ${excluded ? "text-foreground-muted line-through" : "text-foreground-primary"}`}>{tx(id)}</span>
              <span
                className={`inline-flex flex-none items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide uppercase ${
                  excluded ? "bg-danger/10 text-danger" : "bg-highlight-soft text-highlight"
                }`}
              >
                {excluded ? <X className="size-3" strokeWidth={3} /> : <Check className="size-3" strokeWidth={3} />}
                {excluded ? t("excluded") : t("safe")}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------- Variety */

const deck: ExerciseId[] = ["birdDog", "wallAngels", "skaters"];
const recent: ExerciseId[] = ["squats", "plank", "pushUps"];

function VarietyDemo() {
  const t = useTranslations("Features.variety");
  const tx = useTranslations("Exercises");
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="w-full text-[0.625rem] font-semibold tracking-[0.18em] text-foreground-faint uppercase">{t("recent")}</span>
        {recent.map((id) => (
          <span key={id} className="rounded-full border border-border-subtle px-2.5 py-1 text-xs text-foreground-faint line-through">
            {tx(id)}
          </span>
        ))}
      </div>
      {/* Three cards rotate through the front; negative delays put each at a different phase */}
      <div className="relative h-24" aria-hidden="true">
        {deck.map((id, i) => (
          <div
            key={id}
            style={{ "--d": `${-i * 2.5}s`, translate: `0 ${i * 0.75}rem`, scale: `${1 - i * 0.05}`, zIndex: 3 - i } as CSSProperties}
            className="absolute inset-x-0 top-0 flex items-center gap-3 rounded-xl border border-border-default bg-surface-raised px-4 py-3 shadow-card motion-safe:animate-deck"
          >
            <Shuffle className="size-4 text-highlight" />
            <span className="flex-1 truncate text-sm text-foreground-primary">{tx(id)}</span>
            <span className="rounded-full bg-highlight-soft px-2 py-0.5 text-[0.65rem] font-semibold text-highlight">{t("fresh")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Offline AI */

const dots = Array.from({ length: 40 }, (_, i) => ((i * 53 + 7) % 23) / 22);

function OfflineDemo() {
  const t = useTranslations("Features.offline");
  return (
    <div className={`${panel} space-y-3.5`}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm text-foreground-secondary">
          <Plane className="size-4 text-highlight" />
          {t("badge")}
        </span>
        <span aria-hidden="true" className="flex h-5 w-9 items-center justify-end rounded-full bg-highlight p-0.5">
          <span className="size-4 rounded-full bg-highlight-contrast" />
        </span>
      </div>
      <div aria-hidden="true" className="grid grid-cols-10 gap-1.5">
        {dots.map((v, i) => (
          <span key={i} className="relative aspect-square rounded-full bg-highlight" style={{ opacity: 0.15 + v * 0.75 }}>
            {i % 9 === 4 && (
              <span className="absolute inset-0 rounded-full bg-highlight motion-safe:animate-ping-soft" style={{ "--d": `${i * 90}ms` } as CSSProperties} />
            )}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-mono text-foreground-muted">{t("model")}</span>
        <span className="flex items-center gap-1.5 font-medium text-highlight">
          <WifiOff className="size-3.5" />
          {t("requests")}
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Progress */

const weekBars = [0.45, 0.7, 0, 0.85, 0.55, 1, 0.75];
const weekStats = [
  ["workouts", "6"],
  ["minutes", "38"],
  ["calories", "240"],
  ["streak", "12"],
] as const;

function ProgressDemo() {
  const t = useTranslations("Features.progress");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const days = t.raw("days") as string[];

  return (
    <div ref={ref} className={`${panel} grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end`}>
      <div>
        <span className="text-[0.625rem] font-semibold tracking-[0.18em] text-foreground-faint uppercase">{t("sample")}</span>
        <div className="mt-3 flex h-32 items-end gap-2" aria-hidden="true">
          {weekBars.map((h, i) => (
            <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <span
                className={`w-full origin-bottom rounded-t-md transition-transform duration-1000 ease-fluid ${h ? "bg-highlight" : "bg-border-default"} ${
                  inView ? "scale-y-100" : "scale-y-0"
                }`}
                style={{ height: `${Math.max(h, 0.05) * 100}%`, transitionDelay: `${i * 80}ms` }}
              />
              <span className="text-[0.65rem] text-foreground-faint">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <dl className="grid grid-cols-4 gap-3 sm:grid-cols-2 sm:gap-x-6">
        {weekStats.map(([key, value]) => (
          <div key={key} className="flex flex-col-reverse">
            <dt className="text-[0.7rem] text-foreground-muted">{t(`stats.${key}`)}</dt>
            <dd className="text-2xl font-light text-foreground-primary">
              <CountUp value={value} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ---------------------------------------------------------------- More */

const moreItems = [
  ["reminders", Bell],
  ["custom", PencilRuler],
  ["search", Search],
  ["focus", PersonStanding],
] as const;

function MoreList() {
  const t = useTranslations("Features.more.items");
  return (
    <ul className="divide-y divide-border-subtle">
      {moreItems.map(([key, Icon]) => (
        <li key={key} className="group/item flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <span className="grid size-9 flex-none place-items-center rounded-xl border border-border-subtle bg-surface-raised text-highlight transition-colors group-hover/item:border-border-strong">
            <Icon className="size-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-foreground-primary">{t(`${key}.title`)}</span>
            <span className="block text-xs text-foreground-muted">{t(`${key}.body`)}</span>
          </span>
          <ChevronRight className="size-4 flex-none text-foreground-faint transition-transform duration-300 ease-spring group-hover/item:translate-x-1 group-hover/item:text-highlight" />
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------------- Section */

export default function Features() {
  const t = useTranslations("Features");
  const icon = "size-5";

  return (
    <section id="features" aria-labelledby="features-title" className={section}>
      <div className={container}>
        <SectionHeading id="features-title" eyebrow={t("eyebrow")} title={t.rich("title", { hl: highlight })} subtitle={t("subtitle")} />

        {/* Dense flow backfills the gap an odd card leaves on two-column tablets */}
        <SpotlightGroup className="mt-14 grid grid-flow-dense gap-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          <FeatureCard wide icon={<Sparkles className={icon} />} title={t("personalized.title")} body={t("personalized.body")}>
            <PersonalizedDemo />
          </FeatureCard>
          <FeatureCard delay={80} icon={<Timer className={icon} />} title={t("short.title")} body={t("short.body")}>
            <ShortDemo />
          </FeatureCard>
          <FeatureCard icon={<Mic className={icon} />} title={t("voice.title")} body={t("voice.body")}>
            <VoiceDemo />
          </FeatureCard>
          <FeatureCard wide delay={80} icon={<TrendingUp className={icon} />} title={t("adaptive.title")} body={t("adaptive.body")}>
            <AdaptiveDemo />
          </FeatureCard>
          <FeatureCard icon={<ShieldCheck className={icon} />} title={t("safety.title")} body={t("safety.body")}>
            <SafetyDemo />
          </FeatureCard>
          <FeatureCard delay={80} icon={<Shuffle className={icon} />} title={t("variety.title")} body={t("variety.body")}>
            <VarietyDemo />
          </FeatureCard>
          <FeatureCard delay={160} icon={<Cpu className={icon} />} title={t("offline.title")} body={t("offline.body")}>
            <OfflineDemo />
          </FeatureCard>
          <FeatureCard wide icon={<ChartColumn className={icon} />} title={t("progress.title")} body={t("progress.body")}>
            <ProgressDemo />
          </FeatureCard>
          <FeatureCard delay={80} icon={<Sparkles className={icon} />} title={t("more.title")}>
            <MoreList />
          </FeatureCard>
        </SpotlightGroup>
      </div>
    </section>
  );
}
