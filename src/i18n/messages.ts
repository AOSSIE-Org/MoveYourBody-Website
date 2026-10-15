import enMessages from '../messages/en.json';
import hiMessages from '../messages/hi.json';

/** English is the source catalog; every other locale must match its shape. */
export type Messages = typeof enMessages;

// Compile-time parity check: a missing or renamed key in hi.json fails `tsc`.
const hi: Messages = hiMessages;

export const messagesMap: Record<string, Messages> = {
  en: enMessages,
  hi,
};

export const defaultMessages = enMessages;
