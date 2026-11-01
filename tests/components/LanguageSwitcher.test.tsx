import { describe, it, expect } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import LanguageSwitcher from '@/components/dock/LanguageSwitcher';
import { navigation } from '../utils/navigation';
import { messages, renderWithIntl } from '../utils/intl';

/** The dock button: labelled "Language" or "भाषा" */
const trigger = () => screen.getByRole('button', { name: /^(Language|भाषा)$/ });

describe('LanguageSwitcher', () => {
  it('shows the current locale and a translated label', () => {
    renderWithIntl(<LanguageSwitcher />, { locale: 'hi' });
    const button = screen.getByRole('button', { name: messages('hi').LanguageSwitcher.label });
    expect(button.textContent).toBe('HI');
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens a menu listing every language with the current one selected', () => {
    renderWithIntl(<LanguageSwitcher />);
    expect(screen.queryByRole('button', { name: /हिन्दी/ })).toBeNull();
    fireEvent.click(trigger());
    expect(screen.getByRole('button', { name: 'Language' }).getAttribute('aria-expanded')).toBe('true');
    const english = screen.getByRole('button', { name: /English/ });
    const hindi = screen.getByRole('button', { name: /हिन्दी/ });
    expect(english.className).toContain('bg-brand-green');
    expect(hindi.className).not.toContain('bg-brand-green');
  });

  it('switches to Hindi on the same page', () => {
    renderWithIntl(<LanguageSwitcher />, { path: '/privacy' });
    fireEvent.click(trigger());
    fireEvent.click(screen.getByRole('button', { name: /हिन्दी/ }));
    expect(navigation.router.replace).toHaveBeenCalledTimes(1);
    expect(navigation.router.replace.mock.calls[0][0]).toBe('/hi/privacy');
    // The menu closes after picking
    expect(screen.queryByRole('button', { name: /English/ })).toBeNull();
  });

  it('switches back to English from the Hindi home page', () => {
    renderWithIntl(<LanguageSwitcher />, { locale: 'hi' });
    fireEvent.click(trigger());
    fireEvent.click(screen.getByRole('button', { name: /English/ }));
    expect(navigation.router.replace.mock.calls[0][0]).toBe('/en');
  });

  it('only closes the menu when the current language is picked again', () => {
    renderWithIntl(<LanguageSwitcher />);
    fireEvent.click(trigger());
    fireEvent.click(screen.getByRole('button', { name: /English/ }));
    expect(navigation.router.replace).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: /हिन्दी/ })).toBeNull();
  });

  it('closes on a click outside, but not on a click inside', () => {
    renderWithIntl(<LanguageSwitcher />);
    fireEvent.click(trigger());
    fireEvent.mouseDown(screen.getByRole('button', { name: /हिन्दी/ }));
    expect(screen.getByRole('button', { name: /हिन्दी/ })).toBeDefined();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('button', { name: /हिन्दी/ })).toBeNull();
  });
});
