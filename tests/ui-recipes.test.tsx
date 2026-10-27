import { describe, it, expect, vi, afterEach } from 'vitest';
import fc from 'fast-check';
import { act, renderHook } from '@testing-library/react';
import { dockItem } from '@/components/dock/dockItem';
import { chip } from '@/components/ui/styles';
import { useInView } from '@/components/ui/useInView';

const tokens = (classes: string) => classes.split(/\s+/).filter(Boolean);

describe('dockItem', () => {
  it('uses the primary style over the active style when both are set', () => {
    const classes = tokens(dockItem({ primary: true, isActive: true }));
    expect(classes).toContain('bg-button-primary-bg');
    expect(classes).not.toContain('bg-card-bg');
  });

  it('defaults to the idle tile', () => {
    expect(tokens(dockItem())).toContain('bg-dock-item-bg');
  });

  it('property: exactly one variant background and one width rule is applied for any flag combination', () => {
    const backgrounds = ['bg-dock-item-bg', 'bg-card-bg', 'bg-button-primary-bg'];
    fc.assert(
      fc.property(fc.boolean(), fc.boolean(), fc.boolean(), (isActive, primary, mark) => {
        const classes = tokens(dockItem({ isActive, primary, mark }));
        expect(classes.filter((c) => backgrounds.includes(c))).toHaveLength(1);
        expect(classes.includes('w-8')).toBe(mark);
        expect(classes.includes('min-w-8')).toBe(!mark);
      }),
    );
  });
});

describe('chip', () => {
  it('property: active and inactive chips never share their state classes', () => {
    fc.assert(
      fc.property(fc.boolean(), (active) => {
        const classes = tokens(chip(active));
        expect(classes.includes('bg-highlight')).toBe(active);
        expect(classes.includes('bg-surface-raised')).toBe(!active);
        expect(classes).toContain('focus-visible:outline-2');
      }),
    );
  });
});

describe('useInView', () => {
  type Callback = (entries: Pick<IntersectionObserverEntry, 'isIntersecting'>[]) => void;
  let trigger: Callback = () => {};
  const disconnect = vi.fn();
  const observe = vi.fn();

  function mockObserver() {
    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn(function (this: unknown, cb: Callback) {
        trigger = cb;
        return { observe, disconnect, unobserve: vi.fn() };
      }),
    );
  }

  afterEach(() => {
    vi.unstubAllGlobals();
    disconnect.mockClear();
    observe.mockClear();
  });

  it('reports false when the ref is not attached', () => {
    mockObserver();
    const { result } = renderHook(() => useInView({ current: null }));
    expect(result.current).toBe(false);
    expect(observe).not.toHaveBeenCalled();
  });

  it('follows the element in and out of view', () => {
    mockObserver();
    const { result } = renderHook(() => useInView({ current: document.createElement('div') }));
    expect(observe).toHaveBeenCalledTimes(1);
    act(() => trigger([{ isIntersecting: true }]));
    expect(result.current).toBe(true);
    act(() => trigger([{ isIntersecting: false }]));
    expect(result.current).toBe(false);
  });

  it('stops observing after the first intersection when once is set', () => {
    mockObserver();
    const { result } = renderHook(() => useInView({ current: document.createElement('div') }, { once: true }));
    act(() => trigger([{ isIntersecting: true }]));
    expect(result.current).toBe(true);
    expect(disconnect).toHaveBeenCalled();
  });

  it('disconnects on unmount', () => {
    mockObserver();
    const { unmount } = renderHook(() => useInView({ current: document.createElement('div') }));
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
