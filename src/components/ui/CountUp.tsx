"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/components/ui/useInView";

const DURATION = 1600;
const easeOutExpo = (p: number) => (p === 1 ? 1 : 1 - Math.pow(2, -10 * p));

/**
 * Counts every integer inside `value` up from zero once it scrolls into view ("100+", "5–7").
 * Renders the final value on the server, and the finished figure is what assistive tech reads.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!inView) {
      const id = requestAnimationFrame(() => setProgress(0));
      return () => cancelAnimationFrame(id);
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      setProgress(easeOutExpo(p));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView]);

  const shown = value.replace(/\d+/g, (n) => String(Math.round(Number(n) * progress)));

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true" className="tabular-nums">
        {shown}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
