import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Code, Database, Palette, Star } from "lucide-react";
import { container } from "@/components/container";
import { BrandIcon } from "@/components/ui/BrandIcons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading, highlight } from "@/components/ui/SectionHeading";
import { SpotlightGroup } from "@/components/ui/Spotlight";
import { buttonPrimary, buttonSecondary, card, section } from "@/components/ui/styles";
import { CONTRIBUTING_URL, REPO_URL, SOCIAL_LINKS } from "@/config/links";

/** From the app's pubspec and README tech stack */
const stack = [
  ["Flutter", "Riverpod", "GoRouter", "SQLite (sqflite)", "Lottie", "FL Chart", "Video Player"],
  ["ONNX Runtime", "all-MiniLM-L6-v2", "WordPiece tokenizer", "Cosine similarity", "Shared Preferences", "Fuzzy search"],
];

/** From the app repository's MAINTAINERS.md (GSoC 2026), plus this website's contributor */
const team = [
  { name: "Vaibhav", github: "DecodeX15", role: "maintainer" },
  { name: "Madhav", github: "M4dhav", role: "mentor" },
  { name: "Bruno", github: "Zahnentferner", role: "mentor" },
  { name: "Archit", github: "Archit381", role: "mentor" },
  { name: "Saksham Jain", github: "reach2saksham", role: "contributor" },
] as const;

const ways = [
  ["code", Code],
  ["design", Palette],
  ["data", Database],
] as const;

function StackRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  // Four copies: each half is wide enough to cover large screens, then -50% loops seamlessly
  const run = [...items, ...items, ...items, ...items];
  return (
    <div className="mask-fade-x overflow-hidden">
      <ul
        className={`flex w-max gap-3 [--marquee-duration:60s] hover:[animation-play-state:paused] ${
          reverse ? "motion-safe:animate-marquee-reverse" : "motion-safe:animate-marquee"
        }`}
      >
        {run.map((item, i) => (
          <li
            key={i}
            aria-hidden={i >= items.length ? "true" : undefined}
            className="flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-4 py-2 text-sm whitespace-nowrap text-foreground-secondary"
          >
            <span className="size-1.5 rounded-full bg-highlight" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function OpenSource() {
  const t = useTranslations("OpenSource");

  return (
    <section id="open-source" aria-labelledby="open-source-title" className={`${section} border-y border-border-subtle bg-section-alt`}>
      <div className={container}>
        <SectionHeading
          id="open-source-title"
          eyebrow={t("eyebrow")}
          title={t.rich("title", { hl: highlight })}
          subtitle={t("subtitle")}
        />
      </div>

      <Reveal className="mt-14 space-y-3 sm:mt-20" delay={100}>
        <h3 className="sr-only">{t("stack")}</h3>
        <StackRow items={stack[0]} />
        <StackRow items={stack[1]} reverse />
      </Reveal>

      <SpotlightGroup className={`${container} mt-14 grid gap-4 lg:grid-cols-3 lg:gap-5`}>
        <Reveal className="lg:col-span-2">
          <div data-spotlight className={`${card} h-full p-6 sm:p-8`}>
            <div aria-hidden="true" className="spotlight pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />
            <h3 className="text-xl font-normal tracking-tight text-foreground-primary">{t("waysTitle")}</h3>
            <ul className="mt-6 grid gap-6 sm:grid-cols-3">
              {ways.map(([key, Icon]) => (
                <li key={key}>
                  <span className="grid size-10 place-items-center rounded-xl bg-highlight-soft text-highlight">
                    <Icon className="size-4.5" />
                  </span>
                  <span className="mt-4 block font-medium text-foreground-primary">{t(`ways.${key}.title`)}</span>
                  <span className="mt-1 block text-sm leading-relaxed font-light text-foreground-muted">{t(`ways.${key}.body`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div data-spotlight className={`${card} h-full p-6 sm:p-8`}>
            <div aria-hidden="true" className="spotlight pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />
            <h3 className="text-xl font-normal tracking-tight text-foreground-primary">{t("teamTitle")}</h3>
            <ul className="mt-6 space-y-3">
              {team.map(({ name, github, role }) => (
                <li key={github}>
                  <a
                    href={`https://github.com/${github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/member flex items-center gap-3 rounded-xl p-1.5 -m-1.5 transition-colors hover:bg-dock-item-hover-bg"
                  >
                    <Image
                      src={`https://github.com/${github}.png?size=96`}
                      alt=""
                      width={40}
                      height={40}
                      loading="lazy"
                      className="size-10 rounded-full border border-border-default bg-surface-raised"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-foreground-primary">{name}</span>
                      <span className="block text-xs text-foreground-muted">
                        @{github} · {t(`roles.${role}`)}
                      </span>
                    </span>
                    <ArrowUpRight className="size-4 text-foreground-faint transition-[translate,color] duration-300 ease-spring group-hover/member:translate-x-0.5 group-hover/member:-translate-y-0.5 group-hover/member:text-highlight" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-3" delay={100}>
          <div data-spotlight className={`${card} flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between`}>
            <div aria-hidden="true" className="spotlight pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />
            <div className="min-w-0">
              <h3 className="text-xl font-normal tracking-tight text-foreground-primary">{t("contributors")}</h3>
              <a href={`${REPO_URL}/graphs/contributors`} target="_blank" rel="noopener noreferrer" className="mt-4 block">
                <Image
                  src="https://contrib.rocks/image?repo=AOSSIE-Org/MoveYourBody&max=24"
                  alt={t("contributorsAlt")}
                  width={480}
                  height={64}
                  loading="lazy"
                  className="h-12 w-auto max-w-full"
                />
              </a>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                <Star className="size-4 transition-transform duration-500 ease-spring group-hover/btn:rotate-[72deg]" />
                {t("star")}
              </a>
              <a href={CONTRIBUTING_URL} target="_blank" rel="noopener noreferrer" className={buttonSecondary}>
                <BrandIcon name="github" />
                {t("guide")}
              </a>
              <a href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer" className={buttonSecondary}>
                <BrandIcon name="discord" />
                {t("discord")}
              </a>
            </div>
          </div>
        </Reveal>
      </SpotlightGroup>
    </section>
  );
}
