"use client";

import { useEffect, useState, type RefObject } from "react";

interface Options {
  /** Stop observing after the first intersection */
  once?: boolean;
  rootMargin?: string;
  threshold?: number;
}

/** Whether `ref` is on screen. SSR and no-IntersectionObserver environments report `false`. */
export function useInView(
  ref: RefObject<Element | null>,
  { once = false, rootMargin = "0px 0px -12% 0px", threshold = 0 }: Options = {},
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { rootMargin, threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, once, rootMargin, threshold]);

  return inView;
}
