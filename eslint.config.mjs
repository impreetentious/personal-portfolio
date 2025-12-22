import {defineConfig} from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

// Next 16 removes `next lint`; use its maintained flat-config presets directly.
export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    // These client-only controls deliberately initialise and synchronise local
    // UI state from browser APIs, timers, and keyboard listeners. They are not
    // React Compiler candidates; preserve their tested interaction contracts
    // while retaining the rest of Next's current Core Web Vitals rules.
    files: ['components/**/*.{ts,tsx}'],
    rules: {
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    // The project configuration intentionally remains CommonJS because its
    // phase-aware build guard uses Next's CJS constants API.
    ignores: [
      'next.config.js',
      'playwright.config.ts',
      'e2e/**',
      'tests/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
])
