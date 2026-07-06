import { defineConfig } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

// Next 16 removes `next lint`; use its maintained flat-config presets directly.
export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    // The project configuration intentionally remains CommonJS because its
    // phase-aware build guard uses Next's CJS constants API.
    ignores: ['next.config.js', 'playwright-report/**', 'test-results/**'],
  },
])
