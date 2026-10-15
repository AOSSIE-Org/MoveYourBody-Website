class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

class MockResizeObserver implements ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

if (typeof window !== 'undefined') {
  if (!window.IntersectionObserver) {
    window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
  }
  if (!window.ResizeObserver) {
    window.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
  }
}
