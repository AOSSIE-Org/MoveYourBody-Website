import { describe, it, expect } from 'vitest';
import en from '@/messages/en.json';
import hi from '@/messages/hi.json';

type JsonObj = Record<string, unknown>;

function getLeafKeys(obj: JsonObj, prefix = ''): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...getLeafKeys(value as JsonObj, fullPath));
    } else {
      keys.push(fullPath);
    }
  }
  return keys;
}

describe('i18n Messages Parity', () => {
  const enKeys = getLeafKeys(en);
  const hiKeys = getLeafKeys(hi);

  it('contains the same translation keys in English and Hindi', () => {
    const missingInHi = enKeys.filter((k) => !hiKeys.includes(k));
    const extraInHi = hiKeys.filter((k) => !enKeys.includes(k));

    expect(missingInHi).toEqual([]);
    expect(extraInHi).toEqual([]);
  });

  it('ensures translation values are non-empty unless explicitly allowed', () => {
    // Stat units can legitimately be empty (e.g., raw count like "100+")
    const isAllowedEmpty = (path: string) => path.endsWith('.unit');

    function assertNoUnexpectedEmpty(obj: JsonObj, path = '') {
      for (const [k, v] of Object.entries(obj)) {
        const full = path ? `${path}.${k}` : k;
        if (typeof v === 'string') {
          if (!isAllowedEmpty(full)) {
            expect(v.trim().length, `Unexpected empty string at ${full}`).toBeGreaterThan(0);
          }
        } else if (v && typeof v === 'object' && !Array.isArray(v)) {
          assertNoUnexpectedEmpty(v as JsonObj, full);
        }
      }
    }

    assertNoUnexpectedEmpty(en);
    assertNoUnexpectedEmpty(hi);
  });
});
