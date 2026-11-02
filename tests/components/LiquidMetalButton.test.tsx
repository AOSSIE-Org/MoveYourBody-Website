import { describe, it, expect, vi, afterEach } from 'vitest';
import fc from 'fast-check';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { LiquidMetalButton } from '@/components/ui/LiquidMetalButton';
import { MockResizeObserver, resize } from '../utils/browser';
import { createFakeGL, setRect } from '../utils/webgl';

const wrapper = (container: HTMLElement) => container.firstElementChild as HTMLElement;
const stage = (container: HTMLElement) => wrapper(container).firstElementChild as HTMLElement;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('LiquidMetalButton', () => {
  it('renders a link that opens safely in a new tab', () => {
    render(<LiquidMetalButton href="https://example.org" target="_blank" aria-label="Get it" title="Get it" />);
    const link = screen.getByRole('link', { name: 'Get it' });
    expect(link.getAttribute('href')).toBe('https://example.org');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.getAttribute('title')).toBe('Get it');
  });

  it('keeps an explicit rel, and adds none for same-tab links', () => {
    const { rerender } = render(<LiquidMetalButton href="/a" target="_blank" rel="nofollow" />);
    expect(screen.getByRole('link').getAttribute('rel')).toBe('nofollow');
    rerender(<LiquidMetalButton href="/a" />);
    expect(screen.getByRole('link').hasAttribute('rel')).toBe(false);
  });

  it('renders a button with a click handler when there is no href', () => {
    const onClick = vi.fn();
    render(<LiquidMetalButton id="cta" onClick={onClick} label="Install" />);
    const button = screen.getByRole('button', { name: 'Install' });
    expect(button.getAttribute('type')).toBe('button');
    expect(button.id).toBe('cta');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('prefers children over label, and falls back to "Download Now"', () => {
    const { rerender } = render(<LiquidMetalButton label="Label">Child</LiquidMetalButton>);
    expect(screen.getByRole('button').textContent).toBe('Child');
    rerender(<LiquidMetalButton label="Label" />);
    expect(screen.getByRole('button').textContent).toBe('Label');
    rerender(<LiquidMetalButton />);
    expect(screen.getByRole('button').textContent).toBe('Download Now');
  });

  it('shows the download icon by default, a custom icon, or none', () => {
    const { rerender } = render(<LiquidMetalButton />);
    expect(screen.getByRole('button').querySelector('svg[viewBox="0 0 115 115"]')).not.toBeNull();
    rerender(<LiquidMetalButton icon={<i data-testid="custom" />} />);
    expect(screen.getByTestId('custom')).toBeDefined();
    expect(screen.getByRole('button').querySelector('svg')).toBeNull();
    rerender(<LiquidMetalButton icon={null} />);
    expect(screen.getByRole('button').children).toHaveLength(1);
  });

  it('merges a custom style and class onto the wrapper', () => {
    const { container } = render(<LiquidMetalButton className="extra" style={{ margin: '4px' }} />);
    expect(wrapper(container).className).toContain('extra');
    expect(wrapper(container).className).toContain('inline-flex');
    expect(wrapper(container).style.margin).toBe('4px');
  });

  it('starts at 52px, or a clamp in hero mode, before measuring', () => {
    const { container, rerender } = render(<LiquidMetalButton />);
    expect(wrapper(container).style.getPropertyValue('--liquid-btn-h')).toBe('52px');
    rerender(<LiquidMetalButton size="hero" />);
    expect(wrapper(container).style.getPropertyValue('--liquid-btn-h')).toBe('clamp(38px, 14.6722cqw, 56px)');
    expect(wrapper(container).className).toContain('size-full');
  });

  it('property: an explicit height sets both the initial and the measured height', () => {
    const height = fc.oneof(
      fc.integer({ min: 1, max: 400 }),
      fc.integer({ min: 1, max: 40 }).map((n) => `${n}rem`),
    );
    fc.assert(
      fc.property(height, (h) => {
        const expected = typeof h === 'number' ? `${h}px` : h;
        const { container } = render(<LiquidMetalButton height={h} />);
        expect(wrapper(container).style.getPropertyValue('--liquid-btn-h')).toBe(expected);
        expect(stage(container).style.getPropertyValue('--h')).toBe(expected);
        expect(stage(container).style.getPropertyValue('--liquid-btn-h')).toBe(expected);
        cleanup();
      }),
      { numRuns: 30 },
    );
  });

  it('measures the default size as 52px', () => {
    const { container } = render(<LiquidMetalButton />);
    expect(stage(container).style.getPropertyValue('--h')).toBe('52px');
  });

  describe('hero mode', () => {
    function renderHero(box: { width: number; height: number }) {
      const spy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
        return { left: 0, top: 0, right: box.width, bottom: box.height, x: 0, y: 0, toJSON: () => ({}), ...box } as DOMRect;
      });
      const result = render(<LiquidMetalButton size="hero" />);
      return { ...result, spy };
    }

    it('sizes the button at 22.28% of the container height', () => {
      const { container } = renderHero({ width: 410, height: 270 });
      expect(stage(container).style.getPropertyValue('--h')).toBe('60.2px');
    });

    it('derives the height from the 41:27 aspect ratio before layout gives one', () => {
      const { container } = renderHero({ width: 410, height: 0 });
      expect(stage(container).style.getPropertyValue('--h')).toBe('60.2px');
    });

    it('falls back to 54px when the container has no size at all', () => {
      const { container } = renderHero({ width: 0, height: 0 });
      expect(stage(container).style.getPropertyValue('--h')).toBe('54px');
    });

    it('re-measures when the container resizes, and stops when unmounted', () => {
      const { container, spy, unmount } = renderHero({ width: 410, height: 270 });
      spy.mockImplementation(() => ({ left: 0, top: 0, width: 205, height: 135 }) as DOMRect);
      act(() => resize(wrapper(container)));
      expect(stage(container).style.getPropertyValue('--h')).toBe('30.1px');
      unmount();
      expect(MockResizeObserver.instances.every((o) => o.disconnected)).toBe(true);
    });
  });

  it('starts the WebGL renderer and destroys it on unmount', () => {
    const { gl, record } = createFakeGL();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => gl as unknown as RenderingContext);
    const { container, unmount } = render(<LiquidMetalButton />);
    setRect(stage(container), { width: 200, height: 60 });
    expect(record.linkedPrograms).toHaveLength(5);
    fireEvent.pointerDown(screen.getByRole('button'), { clientX: 0, clientY: 0 });
    expect(stage(container).dataset.press).toBe('true');
    unmount();
    expect(record.deleted.programs).toBe(5);
  });

  it('falls back to the CSS button when the renderer fails to start', () => {
    const { gl } = createFakeGL({ compiles: false });
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => gl as unknown as RenderingContext);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<LiquidMetalButton label="Still here" />);
    expect(warn.mock.calls[0][0]).toMatch(/falling back to CSS/);
    expect(screen.getByRole('button', { name: 'Still here' })).toBeDefined();
  });
});
