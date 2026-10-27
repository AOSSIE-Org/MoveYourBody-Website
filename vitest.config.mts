import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'lcov'],
      // Logic modules and shared UI recipes. Visual sections are verified by the build and visual review.
      include: [
        'src/config/**',
        'src/i18n/metadata.ts',
        'src/i18n/messages.ts',
        'src/app/sitemap.ts',
        'src/app/manifest.ts',
        'src/components/dock/dockItem.ts',
        'src/components/ui/styles.ts',
        'src/components/ui/useInView.ts',
        'src/components/ui/Reveal.tsx',
        'src/components/ui/SectionHeading.tsx',
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
