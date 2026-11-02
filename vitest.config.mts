import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    // Whole-page renders and property runs are slow under coverage instrumentation on shared CI runners
    testTimeout: 20_000,
    // next-intl imports `next/navigation` without an extension, which only resolves when Vite bundles it
    server: { deps: { inline: ['next-intl'] } },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'lcov'],
      // The whole application: every page, layout, component, hook and helper under src/
      include: ['src/**/*.{ts,tsx}'],
      // Only files with no runtime code are left out
      exclude: [
        'src/**/*.d.ts', // type declarations only (next-intl AppConfig, the share button's types)
      ],
      thresholds: { lines: 90, functions: 90, branches: 90, statements: 90 },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
});
