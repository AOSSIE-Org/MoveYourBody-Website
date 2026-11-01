import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { createLiquidMetalRenderer } from '@/components/ui/liquidMetalRenderer';
import { MockIntersectionObserver, resize, setIntersecting, setReducedMotion } from './utils/browser';
import { createFakeGL, setRect, type FakeGLOptions } from './utils/webgl';

/** Renderers created by the current test, destroyed in afterEach so their listeners never leak into the next */
const liveRenderers: (() => void)[] = [];

function setup(options?: FakeGLOptions) {
  const { gl, record } = createFakeGL(options);
  const canvas = document.createElement('canvas');
  const stage = document.createElement('div');
  const button = document.createElement('a');
  stage.append(canvas, button);
  document.body.appendChild(stage);
  canvas.getContext = vi.fn(() => gl) as unknown as typeof canvas.getContext;
  setRect(stage, { width: 300, height: 100 });
  setRect(button, { left: 50, top: 25, width: 200, height: 50 });
  const destroy = createLiquidMetalRenderer({ canvas, stage, button });
  liveRenderers.push(destroy);
  /** Draw calls that composite onto the canvas, i.e. finished frames */
  const framesDrawn = () => record.draws.filter((fbo) => fbo === null).length;
  return { gl, record, canvas, stage, button, destroy, framesDrawn };
}

const advance = (ms: number) => vi.advanceTimersByTime(ms);
const uniform = (record: ReturnType<typeof setup>['record'], name: string) => record.uniforms.get(name) as number & number[];

beforeEach(() => {
  vi.useFakeTimers();
  // Start well after page load, as a real button would
  vi.advanceTimersByTime(10_000);
});
afterEach(() => {
  liveRenderers.splice(0).forEach((destroy) => destroy());
  vi.useRealTimers();
  document.body.innerHTML = '';
  Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });
});

describe('createLiquidMetalRenderer', () => {
  it('does nothing without WebGL2, leaving the CSS button', () => {
    const canvas = document.createElement('canvas');
    const stage = document.createElement('div');
    const button = document.createElement('button');
    const destroy = createLiquidMetalRenderer({ canvas, stage, button });
    fireEvent.pointerEnter(button, { pointerType: 'mouse' });
    expect(stage.dataset.hot).toBeUndefined();
    expect(vi.getTimerCount()).toBe(0);
    expect(() => destroy()).not.toThrow();
  });

  it('builds five programs whose uniforms come from their shaders', () => {
    const { record } = setup();
    expect(record.linkedPrograms).toHaveLength(5);
    expect(record.shaderSources.every((src) => src.startsWith('#version 300 es'))).toBe(true);
    expect(record.linkedPrograms[0].uniforms).toEqual(expect.arrayContaining(['uHover', 'uRip[0]', 'uP[0]']));
  });

  it('sizes the canvas to the stage in device pixels, capped at 2x', () => {
    Object.defineProperty(window, 'devicePixelRatio', { value: 3, configurable: true });
    const { canvas, record } = setup();
    expect([canvas.width, canvas.height]).toEqual([600, 200]);
    advance(16);
    // The pill centre is measured from the bottom-left, as gl_FragCoord is
    expect(uniform(record, 'uC')).toEqual([300, 100]);
    expect(uniform(record, 'uHalf')).toEqual([200, 50]);
  });

  it('renders each frame through offscreen passes and composites onto the canvas last', () => {
    const { record, framesDrawn } = setup();
    advance(16);
    expect(framesDrawn()).toBe(1);
    expect(record.draws.at(-1)).toBeNull();
    // metal, rim, two blur buffers and two bloom buffers
    expect(new Set(record.draws.filter(Boolean)).size).toBe(6);
  });

  it('uses half-float targets when available and 8-bit ones otherwise', () => {
    const half = setup();
    const { constants } = createFakeGL();
    expect(new Set(half.record.textureFormats)).toEqual(new Set([constants.RGBA16F]));
    half.destroy();
    const byte = setup({ halfFloat: false });
    expect(new Set(byte.record.textureFormats)).toEqual(new Set([constants.RGBA8]));
  });

  it('throttles idle frames and draws every frame while hovered', () => {
    const { button, framesDrawn } = setup();
    advance(1000);
    const idle = framesDrawn();
    fireEvent.pointerEnter(button, { pointerType: 'mouse', clientX: 150, clientY: 50 });
    const before = framesDrawn();
    advance(1000);
    const active = framesDrawn() - before;
    expect(idle).toBeLessThanOrEqual(31);
    expect(active).toBeGreaterThan(idle * 1.5);
  });

  it('lights up on mouse hover only, easing the hover uniform in and out', () => {
    const { button, stage, record } = setup();
    fireEvent.pointerEnter(button, { pointerType: 'touch' });
    expect(stage.dataset.hot).toBeUndefined();

    fireEvent.pointerEnter(button, { pointerType: 'mouse', clientX: 150, clientY: 50 });
    expect(stage.dataset.hot).toBe('true');
    advance(32);
    const early = uniform(record, 'uHover');
    advance(2000);
    expect(early).toBeGreaterThan(0);
    expect(uniform(record, 'uHover')).toBe(1);

    fireEvent.pointerLeave(button, { pointerType: 'touch' });
    expect(stage.dataset.hot).toBe('true');
    fireEvent.pointerLeave(button, { pointerType: 'mouse' });
    expect(stage.dataset.hot).toBe('false');
    advance(5000);
    expect(uniform(record, 'uHover')).toBe(0);
  });

  it('drags the cursor well toward the pointer while hovered, and ignores the pointer otherwise', () => {
    const { button, record } = setup();
    fireEvent.pointerMove(window, { clientX: 250, clientY: 50 });
    advance(100);
    expect(uniform(record, 'uPtr').slice(0, 3)).toEqual([0, 0, 0]);

    // Enter at the button's centre, then move one button height to the right
    fireEvent.pointerEnter(button, { pointerType: 'mouse', clientX: 150, clientY: 50 });
    fireEvent.pointerMove(window, { clientX: 200, clientY: 50 });
    advance(2000);
    const [x, y, strength] = uniform(record, 'uPtr');
    expect(x).toBeCloseTo(1, 1);
    expect(y).toBeCloseTo(0, 5);
    expect(strength).toBe(1);
  });

  it('presses and ripples from the pointer, releasing on pointer up anywhere', () => {
    const { button, stage, record } = setup();
    fireEvent.pointerDown(button, { clientX: 150, clientY: 75 });
    expect(stage.dataset.press).toBe('true');
    expect(stage.dataset.hot).toBe('true');
    advance(16);
    const [rx, ry, , live] = uniform(record, 'uRip');
    expect([rx, ry, live]).toEqual([0, 0.5, 1]);

    fireEvent.pointerUp(window);
    expect(stage.dataset.press).toBe('false');
    advance(1000);
    expect(uniform(record, 'uPress')).toBe(0);
    // A ripple lives for four seconds of animation time
    advance(4000);
    expect(uniform(record, 'uRip')[3]).toBe(0);
  });

  it('cycles ripples through three slots', () => {
    const { button, record } = setup();
    for (let i = 0; i < 4; i++) {
      fireEvent.pointerDown(button, { clientX: 50 + i * 50, clientY: 50 });
      fireEvent.pointerUp(window);
      advance(16);
    }
    const rip = uniform(record, 'uRip');
    // The fourth press reuses the first slot
    expect([rip[0], rip[4], rip[8]]).toEqual([1, -1, 0]);
    expect([rip[3], rip[7], rip[11]]).toEqual([1, 1, 1]);
  });

  it('presses from the keyboard with Enter and Space, ignoring auto-repeat and other keys', () => {
    const { button, stage, record } = setup();
    fireEvent.keyDown(button, { key: 'a' });
    expect(stage.dataset.press).toBeUndefined();
    fireEvent.keyDown(button, { key: 'Enter', repeat: true });
    expect(stage.dataset.press).toBeUndefined();

    fireEvent.keyDown(button, { key: ' ' });
    expect(stage.dataset.press).toBe('true');
    advance(16);
    expect(uniform(record, 'uRip').slice(0, 2)).toEqual([0, 0]);
    fireEvent.keyUp(button, { key: 'a' });
    expect(stage.dataset.press).toBe('true');
    fireEvent.keyUp(button, { key: 'Enter' });
    expect(stage.dataset.press).toBe('false');
  });

  it('glows for keyboard focus but not for pointer focus', () => {
    const { button, stage } = setup();
    button.matches = () => false;
    fireEvent.focus(button);
    expect(stage.dataset.hot).toBe('false');
    button.matches = (selector: string) => selector === ':focus-visible';
    fireEvent.focus(button);
    expect(stage.dataset.hot).toBe('true');
    fireEvent.blur(button);
    expect(stage.dataset.hot).toBe('false');
  });

  it('freezes time and skips identical frames with reduced motion', () => {
    setReducedMotion(true);
    const { framesDrawn, record } = setup();
    advance(1000);
    expect(framesDrawn()).toBe(1);
    expect(uniform(record, 'uT')).toBe(0);
  });

  it('redraws at the new size after a resize with reduced motion, even right after a frame', () => {
    setReducedMotion(true);
    const { stage, canvas, framesDrawn } = setup();
    advance(16);
    expect(framesDrawn()).toBe(1);
    // Resizing clears the canvas, so the next idle frame must not be skipped as "already drawn"
    setRect(stage, { width: 400, height: 100 });
    resize(stage);
    advance(1000);
    expect(canvas.width).toBe(400);
    expect(framesDrawn()).toBe(2);
  });

  it('advances time without reduced motion', () => {
    const { button, record } = setup();
    fireEvent.pointerEnter(button, { pointerType: 'mouse', clientX: 150, clientY: 50 });
    advance(1000);
    expect(uniform(record, 'uT')).toBeGreaterThan(0.5);
  });

  it('parks while off screen and resumes when visible again', () => {
    const { button, framesDrawn } = setup();
    setIntersecting(button, false);
    advance(100);
    const parked = framesDrawn();
    expect(vi.getTimerCount()).toBe(0);
    advance(1000);
    expect(framesDrawn()).toBe(parked);

    setIntersecting(button, true);
    advance(1000);
    expect(framesDrawn()).toBeGreaterThan(parked);
    // A visibility change while already running does not start a second loop
    setIntersecting(button, true);
    expect(vi.getTimerCount()).toBe(1);
  });

  it('re-measures on the next frame after a resize', () => {
    const { stage, canvas, record } = setup();
    expect(canvas.width).toBe(300);
    setRect(stage, { width: 500, height: 100 });
    resize(stage);
    advance(16);
    expect(canvas.width).toBe(500);
    expect(uniform(record, 'uRes')).toEqual([500, 100]);
  });

  it('releases every GL object and listener when destroyed', () => {
    const { destroy, record, button, stage } = setup();
    destroy();
    expect(record.deleted).toMatchObject({ programs: 5, textures: 6, framebuffers: 6, buffers: 1, vertexArrays: 1 });
    expect(vi.getTimerCount()).toBe(0);
    expect(MockIntersectionObserver.instances.every((o) => o.disconnected)).toBe(true);
    fireEvent.pointerDown(button, { clientX: 1, clientY: 1 });
    expect(stage.dataset.press).toBeUndefined();
  });

  it('reports shader compile errors with the source', () => {
    expect(() => setup({ compiles: false })).toThrow(/syntax error[\s\S]*#version 300 es/);
  });

  it('reports link errors', () => {
    expect(() => setup({ links: false })).toThrow('Program link failed');
  });

  it('reports a context that cannot create shaders or programs', () => {
    expect(() => setup({ shaders: false })).toThrow('Shader creation failed');
    expect(() => setup({ programs: false })).toThrow('Program creation failed');
  });
});
