const base =
  "relative inline-flex h-8 flex-none cursor-pointer items-center justify-center gap-2 rounded-lg border text-[0.625rem] tracking-widest whitespace-nowrap uppercase transition-[translate,scale,color,border-color,background-color,box-shadow] duration-250 ease-spring hover:-translate-y-0.5 hover:scale-106";

const variants = {
  idle: "font-medium border-transparent bg-dock-item-bg text-foreground-secondary hover:border-border-strong hover:bg-dock-item-hover-bg hover:text-dock-item-hover-text hover:shadow-dock-item",
  active: "font-medium border-border-strong bg-card-bg text-stat-value shadow-dock-item-active",
  primary:
    "border-button-primary-border bg-button-primary-bg font-semibold text-button-primary-text shadow-dock-item hover:bg-button-primary-hover-bg",
};

/** Dock tile classes; `mark` is the square logo tile. */
export function dockItem({
  isActive = false,
  primary = false,
  mark = false,
}: { isActive?: boolean; primary?: boolean; mark?: boolean } = {}) {
  return [
    base,
    variants[primary ? "primary" : isActive ? "active" : "idle"],
    mark ? "w-8 overflow-hidden" : "min-w-8 px-1.5 sm:px-2.5 lg:px-3.5",
  ].join(" ");
}

/** Glass panel that holds a group of dock items */
export const dockPanel =
  "pointer-events-auto relative isolate flex h-11 items-center gap-0.5 rounded-2xl border border-dock-border bg-dock-bg p-1.5 shadow-dock backdrop-blur-md transition-[border-color,box-shadow] sm:gap-1 duration-350 ease-smooth hover:border-border-strong hover:shadow-dock-hover motion-safe:animate-enter-down";

/** Icon slot inside a dock item */
export const dockGlyph = "size-3.5 flex-none opacity-80";
