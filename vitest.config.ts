/// <reference types="vitest/config" />

import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['./tests/vitest.setup.ts'],
  },
});
