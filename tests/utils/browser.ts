/**
 * Stand-ins for the browser APIs jsdom does not implement (IntersectionObserver, ResizeObserver,
 * matchMedia), with handles so tests can drive them: scroll an element into view, resize it, or
 * switch on prefers-reduced-motion.
 */

type IOCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void;

export class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  readonly root: Element | Document | null = null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number> = [];
  readonly targets = new Set<Element>();
  disconnected = false;

  constructor(
    private readonly callback: IOCallback,
    options: IntersectionObserverInit = {},
  ) {
    this.rootMargin = options.rootMargin ?? '0px';
    MockIntersectionObserver.instances.push(this);
  }

  observe(target: Element): void {
    this.targets.add(target);
  }
  unobserve(target: Element): void {
    this.targets.delete(target);
  }
  disconnect(): void {
    this.targets.clear();
    this.disconnected = true;
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  /** Delivers one entry for `target` to this observer */
  fire(target: Element, isIntersecting: boolean) {
    this.callback([{ target, isIntersecting } as IntersectionObserverEntry], this);
  }
}

/** Every live observer watching `target` reports it entering (or leaving) the viewport */
export function setIntersecting(target: Element, isIntersecting = true) {
  for (const observer of MockIntersectionObserver.instances) {
    if (observer.targets.has(target)) observer.fire(target, isIntersecting);
  }
}

/** Number of live observers watching `target` */
export function observersOf(target: Element) {
  return MockIntersectionObserver.instances.filter((o) => o.targets.has(target)).length;
}

export class MockResizeObserver implements ResizeObserver {
  static instances: MockResizeObserver[] = [];
  readonly targets = new Set<Element>();
  disconnected = false;

  constructor(private readonly callback: ResizeObserverCallback) {
    MockResizeObserver.instances.push(this);
  }

  observe(target: Element): void {
    this.targets.add(target);
  }
  unobserve(target: Element): void {
    this.targets.delete(target);
  }
  disconnect(): void {
    this.targets.clear();
    this.disconnected = true;
  }
}

/** Every live ResizeObserver watching `target` is notified */
export function resize(target: Element) {
  for (const observer of MockResizeObserver.instances) {
    if (observer.targets.has(target)) {
      (observer as unknown as { callback: ResizeObserverCallback }).callback([], observer);
    }
  }
}

/* ------------------------------------------------------------------ matchMedia */

const mediaState = new Map<string, boolean>();
const mediaListeners = new Map<string, Set<(e: MediaQueryListEvent) => void>>();

function matchMedia(query: string): MediaQueryList {
  const listeners = mediaListeners.get(query) ?? new Set();
  mediaListeners.set(query, listeners);
  return {
    get matches() {
      return mediaState.get(query) ?? false;
    },
    media: query,
    onchange: null,
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.delete(cb),
    addListener: (cb: (e: MediaQueryListEvent) => void) => listeners.add(cb),
    removeListener: (cb: (e: MediaQueryListEvent) => void) => listeners.delete(cb),
    dispatchEvent: () => true,
  } as unknown as MediaQueryList;
}

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/** Sets a media query's result and notifies its change listeners */
export function setMedia(query: string, matches: boolean) {
  mediaState.set(query, matches);
  for (const cb of mediaListeners.get(query) ?? []) cb({ matches, media: query } as MediaQueryListEvent);
}

export function setReducedMotion(matches: boolean) {
  setMedia(REDUCED_MOTION, matches);
}

export function mediaListenerCount(query: string) {
  return mediaListeners.get(query)?.size ?? 0;
}

/** Installs the mocks on `window`; called from the setup file */
export function installBrowserMocks() {
  window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
  window.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
  window.matchMedia = matchMedia;
  // jsdom has no WebGL: report "no context" so components take their CSS fallback, as old browsers do
  HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext;
  window.scrollTo = (() => {}) as typeof window.scrollTo;
}

/** Clears observer registries and media state between tests */
export function resetBrowserMocks() {
  MockIntersectionObserver.instances = [];
  MockResizeObserver.instances = [];
  mediaState.clear();
  mediaListeners.clear();
}

/** Resolves after the next animation frame, so effects scheduled with requestAnimationFrame have run */
export function nextFrame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}
