import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { PhoneFrame } from '@/components/ui/PhoneFrame';

describe('PhoneFrame component', () => {
  it('renders children within the phone container', () => {
    render(
      <PhoneFrame>
        <div data-testid="app-screen">Workout Session</div>
      </PhoneFrame>
    );

    const screenElement = screen.getByTestId('app-screen');
    expect(screenElement).toBeDefined();
    expect(screenElement.textContent).toBe('Workout Session');
  });

  it('applies custom className to the outer frame', () => {
    const { container } = render(
      <PhoneFrame className="custom-test-class">
        <div>Content</div>
      </PhoneFrame>
    );

    const outer = container.firstChild as HTMLElement;
    expect(outer.classList.contains('custom-test-class')).toBe(true);
  });
});
