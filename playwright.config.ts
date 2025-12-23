import {defineConfig, devices} from '@playwright/test'

const PORT = 3004
const BASE_URL = `http://127.0.0.1:${PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 60_000,
  expect: {timeout: 10_000},
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    // Prefer reduced motion in the default context so boot doesn't burn the
    // full sequence budget; individual tests override when they need motion.
    contextOptions: {
      reducedMotion: 'reduce',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome']},
    },
  ],
  webServer: {
    command: `npx next start -p ${PORT} -H 127.0.0.1`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      PORT: String(PORT),
      ALLOW_BUILD_WITHOUT_SANITY: process.env.ALLOW_BUILD_WITHOUT_SANITY ?? 'true',
    },
  },
})
