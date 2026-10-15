"use client";

import type { PointerEvent, ReactNode } from "react";

/**
 * One pointer listener for a whole grid: writes the cursor position into the hovered
 * `[data-spotlight]` card as --mx/--my, which the `spotlight` utility turns into a glow.
 */
export function SpotlightGroup({ className, children }: { className?: string; children: ReactNode }) {
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const card = (e.target as HTMLElement).closest<HTMLElement>("[data-spotlight]");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div className={className} onPointerMove={onPointerMove}>
      {children}
    </div>
  );
}
