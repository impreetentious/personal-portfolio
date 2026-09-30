// Shared helpers for the Playwright suite; keep assertions out of here.
import { expect, type Page } from '@playwright/test'

/** Skip the first-boot overlay (Esc) so tests can reach interactive UI quickly. */
export async function dismissBoot(page: Page) {
  // Boot cover / sequence is present on first visit; Esc/Space short-circuits it.
  // Reduced-motion contexts already skip — pressing Esc is still a no-op then.
  await page.keyboard.press('Escape')
  await expect(page.locator('[data-boot-cover]')).toHaveCount(0, { timeout: 5000 })
  // Boot sequence root is a fixed full-screen div without a test id; wait for
  // the skip-link / main content to become reachable instead.
  await expect(page.locator('#main-content')).toBeVisible({ timeout: 8000 })
}

/** Mark the tab session as already visited so the next load plays the flash. */
export async function markSessionVisited(page: Page) {
  await page.evaluate(() => {
    try {
      sessionStorage.setItem('sps-session-visited', '1')
    } catch {
      // ignore
    }
  })
}

export const VIEWPORTS = {
  phone: { width: 390, height: 844 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
} as const
