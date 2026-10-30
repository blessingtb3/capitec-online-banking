/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Simulated browser DOM for React component tests
    environment: 'jsdom',
    // Makes describe/it/expect available without importing them
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    // Unit tests live in a `tests/` folder next to the component they cover,
    // named <ComponentName>.test.tsx
    include: ['src/**/tests/**/*.test.{ts,tsx,js,jsx}'],
    css: true,
  },
})
