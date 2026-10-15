"use client";

import { useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { useInView } from "@/components/ui/useInView";

interface RevealProps {
  as?: "div" | "li" | "p" | "span" | "article" | "header";
  /** Stagger, in ms */
  delay?: number;
  className?: string;
  id?: string;
  children: ReactNode;
}

/**
 * Fades and lifts its content in the first time it scrolls into view. The motion itself lives in
 * globals.css (`[data-reveal]`), so reduced-motion users and no-JS visitors simply see the content.
 */
export function Reveal({ as = "div", delay = 0, className, id, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const shown = useInView(ref, { once: true });
  const Tag = as as ElementType;

  return (
    <Tag
      ref={ref}
      id={id}
      data-reveal={shown ? "in" : "pending"}
      style={delay ? ({ "--d": `${delay}ms` } as CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
