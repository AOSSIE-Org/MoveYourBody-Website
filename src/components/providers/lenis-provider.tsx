"use client";

import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

function subscribeReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot() {
  return false;
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getSnapshot,
    getServerSnapshot
  );

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    // `anchors` makes in-page #links glide instead of jumping; sections' scroll-margin clears the fixed dock
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true, anchors: true }}>
      {children}
    </ReactLenis>
  );
}


