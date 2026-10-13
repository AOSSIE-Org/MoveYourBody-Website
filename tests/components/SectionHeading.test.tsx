import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { SectionHeading, highlight } from '@/components/ui/SectionHeading';

describe('SectionHeading component', () => {
  it('renders eyebrow and title', () => {
    render(<SectionHeading eyebrow="FEATURES" title="Smart Micro-Workouts" />);
    expect(screen.getByText('FEATURES')).toBeDefined();
    expect(screen.getByText('Smart Micro-Workouts')).toBeDefined();
  });

  it('renders subtitle when provided', () => {
    render(
      <SectionHeading
        eyebrow="PRIVACY"
        title="Zero tracking"
        subtitle="All processing happens on-device."
      />
    );
    expect(screen.getByText('All processing happens on-device.')).toBeDefined();
  });

  it('highlight helper wraps text with font-normal and text-highlight class', () => {
    const { container } = render(<div>{highlight('Personalized')}</div>);
    const span = container.querySelector('span');
    expect(span?.textContent).toBe('Personalized');
    expect(span?.classList.contains('text-highlight')).toBe(true);
  });
});
