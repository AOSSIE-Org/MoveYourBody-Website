import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SpotlightGroup } from '@/components/ui/Spotlight';
import { setRect } from '../utils/webgl';

function renderGroup() {
  render(
    <SpotlightGroup className="grid">
      <div data-spotlight data-testid="card">
        <p>inside</p>
      </div>
      <p>outside</p>
    </SpotlightGroup>,
  );
  const card = screen.getByTestId('card');
  setRect(card, { left: 100, top: 50, width: 200, height: 100 });
  return card;
}

describe('SpotlightGroup', () => {
  it('passes its class to the wrapper', () => {
    renderGroup();
    expect(screen.getByTestId('card').parentElement?.className).toBe('grid');
  });

  it('writes the mouse position relative to the hovered card', () => {
    const card = renderGroup();
    fireEvent.pointerMove(screen.getByText('inside'), { pointerType: 'mouse', clientX: 130, clientY: 90 });
    expect(card.style.getPropertyValue('--mx')).toBe('30px');
    expect(card.style.getPropertyValue('--my')).toBe('40px');
  });

  it('ignores touch and pen, and pointers outside any card', () => {
    const card = renderGroup();
    fireEvent.pointerMove(screen.getByText('inside'), { pointerType: 'touch', clientX: 130, clientY: 90 });
    fireEvent.pointerMove(screen.getByText('outside'), { pointerType: 'mouse', clientX: 130, clientY: 90 });
    expect(card.style.getPropertyValue('--mx')).toBe('');
  });
});
