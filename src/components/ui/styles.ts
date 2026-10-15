/** Shared class recipes for the landing sections, so every card and button reads as one system. */

/** Vertical rhythm for top-level sections */
export const section = "relative isolate scroll-mt-20 py-20 sm:py-24 lg:py-28";

/** Surface card; add a `spotlight` layer inside and wrap the grid in <SpotlightGroup> for the cursor glow */
export const card =
  "group/card relative isolate overflow-hidden rounded-[1.75rem] border border-border-subtle bg-surface shadow-card transition-[border-color,box-shadow,translate] duration-500 ease-fluid hover:border-border-strong";

const buttonBase =
  "group/btn inline-flex h-12 cursor-pointer items-center justify-center gap-2.5 rounded-2xl border px-6 text-sm font-semibold whitespace-nowrap transition-[translate,background-color,border-color,box-shadow,color] duration-300 ease-spring hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight";

export const buttonPrimary = `${buttonBase} border-button-primary-border bg-button-primary-bg text-button-primary-text shadow-dock-item hover:bg-button-primary-hover-bg hover:shadow-dock-hover`;

export const buttonSecondary = `${buttonBase} border-border-default bg-surface text-foreground-primary hover:border-border-strong hover:bg-dock-item-hover-bg`;

/** Small pill label that opens a section, matching the hero's band */
export const eyebrow =
  "inline-flex items-center gap-2 rounded-full border border-band-border bg-band-bg px-3.5 py-1.5 text-[0.625rem] font-semibold tracking-[0.2em] text-band-text uppercase shadow-band-pill";

/** Selectable chip used by the interactive feature demos */
export function chip(active: boolean) {
  return `inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-[background-color,border-color,color,scale] duration-300 ease-spring active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight ${
    active
      ? "border-highlight bg-highlight text-highlight-contrast"
      : "border-border-default bg-surface-raised text-foreground-secondary hover:border-border-strong hover:text-foreground-primary"
  }`;
}
