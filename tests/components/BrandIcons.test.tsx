import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { BrandIcon } from '@/components/ui/BrandIcons';

describe('BrandIcon component', () => {
  it('renders SVG for github', () => {
    const { container } = render(<BrandIcon name="github" className="size-6" />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.classList.contains('size-6')).toBe(true);
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders SVG for discord', () => {
    const { container } = render(<BrandIcon name="discord" className="size-4" />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.querySelector('path')?.getAttribute('d')).toMatch(/^M/);
  });

  it('renders SVG for googlePlay', () => {
    const { container } = render(<BrandIcon name="googlePlay" />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.querySelectorAll('path').length).toBeGreaterThan(0);
  });
});
