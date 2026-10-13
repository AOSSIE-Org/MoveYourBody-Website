"use client";

import { useEffect, useRef, type RefObject } from "react";
import HeroStage from "@/components/hero/HeroStage";

/** Finger drags nudge the scene more gently than the mouse */
const TOUCH_STRENGTH = 0.5;
/** Below this the eased position has caught up with the pointer, so the loop can sleep */
const SETTLED = 0.0005;

const clamp = (n: number) => Math.max(-1, Math.min(1, n));

/**
 * Eases the pointer position into --px/--py (-1..1) on the target, feeding the `parallax` utility.
 * Mouse: absolute position in the window. Touch: drag distance from where the finger landed.
 * The animation frame loop only runs while the value is still moving and the hero is on screen.
 */
function usePointerParallax(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pointer = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    let frame = 0;
    let visible = true;

    const tick = () => {
      smooth.x += (pointer.x - smooth.x) * 0.055;
      smooth.y += (pointer.y - smooth.y) * 0.055;
      el.style.setProperty("--px", String(clamp(smooth.x)));
      el.style.setProperty("--py", String(clamp(smooth.y)));
      const settled = Math.abs(pointer.x - smooth.x) < SETTLED && Math.abs(pointer.y - smooth.y) < SETTLED;
      frame = settled || !visible ? 0 : requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!frame && visible) frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      wake();
    };
    const onLeave = () => {
      pointer.x = pointer.y = 0;
      wake();
    };

    const touchStart = { x: 0, y: 0 };
    const onTouchStart = (e: TouchEvent) => {
      touchStart.x = e.touches[0].clientX;
      touchStart.y = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      pointer.x = clamp((touch.clientX - touchStart.x) / (window.innerWidth / 2)) * TOUCH_STRENGTH;
      pointer.y = clamp((touch.clientY - touchStart.y) / (window.innerHeight / 2)) * TOUCH_STRENGTH;
      wake();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    observer.observe(el);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onLeave);
    window.addEventListener("touchcancel", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onLeave);
      window.removeEventListener("touchcancel", onLeave);
    };
  }, [ref]);
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  usePointerParallax(heroRef);

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative isolate min-h-svh w-full overflow-clip bg-background-primary bg-(image:--hero-gradient) after:pointer-events-none after:absolute after:inset-0 after:z-0 after:bg-(image:--hero-overlay)"
    >
      {/* Bottom fade into the page: above the gradient overlay, beneath the stage (z-10) */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-48 bg-linear-to-b from-transparent to-background-primary" />
      <HeroStage />
    </section>
  );
}
