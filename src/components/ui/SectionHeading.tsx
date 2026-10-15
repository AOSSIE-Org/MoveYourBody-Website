import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { eyebrow as eyebrowClass } from "@/components/ui/styles";

/** `<hl>` renderer for t.rich(): the accent word in a headline */
export const highlight = (chunks: ReactNode) => <span className="font-normal text-highlight">{chunks}</span>;

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  align?: "center" | "left";
  id?: string;
}

export function SectionHeading({ eyebrow, title, subtitle, align = "center", id }: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <header className={`flex flex-col gap-5 ${centered ? "mx-auto max-w-3xl items-center text-center" : "max-w-2xl"}`}>
      <Reveal>
        <span className={eyebrowClass}>
          <span aria-hidden="true" className="size-1.5 rounded-full bg-band-dot shadow-dot" />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={80}>
        <h2
          id={id}
          className="text-3xl leading-[1.08] font-light tracking-tight text-balance text-foreground-primary sm:text-4xl lg:text-[3.25rem]"
        >
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={160}>
          <p className="max-w-xl text-base leading-relaxed font-light text-pretty text-foreground-muted sm:text-lg">
            {subtitle}
          </p>
        </Reveal>
      )}
    </header>
  );
}
