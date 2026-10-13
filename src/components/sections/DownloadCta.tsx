import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { container } from "@/components/container";
import { SessionScreen, WorkoutScreen } from "@/components/mockups/AppScreens";
import { BrandIcon } from "@/components/ui/BrandIcons";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading, highlight } from "@/components/ui/SectionHeading";
import { buttonSecondary, section } from "@/components/ui/styles";
import { PLAY_STORE_URL, REPO_URL } from "@/config/links";

const notes = ["free", "offline", "private"] as const;

export default function DownloadCta() {
  const t = useTranslations("Download");

  return (
    <section id="download" aria-labelledby="download-title" className={`${section} lg:pb-28`}>
      <div className={container}>
        <Reveal>
          <div className="relative isolate grid overflow-hidden rounded-[2.5rem] border border-border-strong bg-(image:--cta-gradient) px-6 pt-12 shadow-card sm:px-12 sm:pt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-8 lg:px-16 lg:pt-0">

            <div className="lg:py-20">
              <SectionHeading
                id="download-title"
                align="left"
                eyebrow={t("eyebrow")}
                title={t.rich("title", { hl: highlight })}
                subtitle={t("subtitle")}
              />

              <div className="mt-10 flex flex-wrap items-center gap-3">
                {/* Play badge: inverts with the theme so it always contrasts with the panel */}
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/play inline-flex h-14 items-center gap-3 rounded-2xl bg-foreground-primary px-5 text-background-primary shadow-dock-item transition-[translate,box-shadow] duration-300 ease-spring hover:-translate-y-0.5 hover:shadow-dock-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
                >
                  <BrandIcon name="googlePlay" className="size-6 transition-transform duration-500 ease-spring group-hover/play:scale-110" />
                  <span className="flex flex-col text-left leading-none">
                    <span className="text-[0.625rem] tracking-wider uppercase opacity-75">{t("playTop")}</span>
                    <span className="mt-1 text-lg font-semibold">{t("playBottom")}</span>
                  </span>
                </a>
                <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className={`${buttonSecondary} h-14`}>
                  <BrandIcon name="github" />
                  {t("source")}
                </a>
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {notes.map((note) => (
                  <li key={note} className="flex items-center gap-2 text-sm text-foreground-secondary">
                    <Check className="size-4 text-highlight" strokeWidth={2.5} />
                    {t(`notes.${note}`)}
                  </li>
                ))}
              </ul>
            </div>

            {/* Two phones rising out of the bottom edge */}
            <div aria-hidden="true" className="relative mt-12 h-72 sm:h-96 lg:mt-0 lg:h-auto">
              <div className="absolute bottom-0 left-1/2 w-44 -translate-x-[88%] translate-y-[18%] -rotate-6 sm:w-56 lg:w-60">
                <div className="motion-safe:animate-float">
                  <PhoneFrame>
                    <WorkoutScreen active />
                  </PhoneFrame>
                </div>
              </div>
              <div className="absolute bottom-0 left-1/2 w-44 -translate-x-[8%] translate-y-[8%] rotate-3 sm:w-56 lg:w-60">
                <div className="[--d:-3s] motion-safe:animate-float">
                  <PhoneFrame>
                    <SessionScreen active excluded={false} />
                  </PhoneFrame>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
