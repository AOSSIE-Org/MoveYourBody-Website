import { describe, it, expect, vi, afterEach } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import SupportContent from '@/components/support/SupportContent';
import { AOSSIE_URL, GITHUB_SPONSORS_URL } from '@/config/links';
import { SUPPORT_LOGOS, SUPPORTERS } from '@/config/support';
import { locales, messages, renderWithIntl } from '../utils/intl';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('SupportContent', () => {
  it.each(locales)('renders the support widget with the %s copy', (locale) => {
    const t = messages(locale);
    const { container } = renderWithIntl(<SupportContent />, { locale });
    expect(screen.getByText(t.Support.title)).toBeDefined();
    expect(screen.getByText(t.Support.aossieDescription)).toBeDefined();
    expect(screen.getByText(t.Footer.tagline)).toBeDefined();
    expect(container.textContent).toContain(t.Support.madeBy);
    expect(container.textContent).toContain(t.Support.supportedBy);
  });

  it('opens GitHub Sponsors in a new tab without an opener', () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    renderWithIntl(<SupportContent />);
    fireEvent.click(screen.getByRole('button', { name: 'GitHub Sponsors' }));
    expect(open).toHaveBeenCalledWith(GITHUB_SPONSORS_URL, '_blank', 'noopener,noreferrer');
  });

  it('links AOSSIE and shows both logos from public/brand', () => {
    const { container } = renderWithIntl(<SupportContent />);
    expect([...container.querySelectorAll('a')].map((a) => a.getAttribute('href'))).toContain(AOSSIE_URL);
    expect(screen.getByAltText('AOSSIE').getAttribute('src')).toBe(SUPPORT_LOGOS.organization);
    expect(screen.getByAltText('MoveYourBody').getAttribute('src')).toBe(SUPPORT_LOGOS.project);
  });

  it('lists Google Summer of Code and Stability Nexus as supporters, linking to their sites', () => {
    renderWithIntl(<SupportContent />);
    expect(SUPPORTERS.map((s) => s.name)).toEqual(['Google Summer of Code', 'Stability Nexus']);
    for (const { name, link } of SUPPORTERS) {
      expect(screen.getByText(name).closest('a')?.getAttribute('href')).toBe(link);
    }
  });
});
