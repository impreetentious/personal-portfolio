import { expect, test } from '@playwright/test'

test.describe('No-JS degradation', () => {
  test.use({ javaScriptEnabled: false })

  test('content is readable without JavaScript (boot cover suppressed)', async ({ page }) => {
    await page.goto('/')

    // noscript hides [data-boot-cover]; pending must not leave <main> aria-hidden.
    await expect(page.locator('#main-content')).toBeAttached()
    await expect(page.locator('main')).not.toHaveAttribute('aria-hidden', 'true')
    await expect(page.getByRole('heading', { level: 1 })).toBeAttached()
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Sidakpreet/i)

    const coverHidden = await page.evaluate(() => {
      const cover = document.querySelector('[data-boot-cover]')
      if (!cover) return true
      return getComputedStyle(cover).display === 'none'
    })
    expect(coverHidden).toBe(true)
  })
})
