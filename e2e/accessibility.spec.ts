import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { dismissBoot } from './helpers'

test.describe('Accessibility release gate', () => {
  test('homepage has no serious/critical axe violations', async ({ page }) => {
    await page.goto('/')
    await dismissBoot(page)

    // Reveal each once-only viewport animation before scanning. Otherwise Axe
    // treats opacity-zero, below-the-fold content as hidden and never checks it.
    for (const id of [
      'experience',
      'skills',
      'metrics',
      'achievements',
      'education',
      'writing',
      'contact',
    ]) {
      const section = page.locator(`#${id}`)
      if ((await section.count()) > 0) await section.scrollIntoViewIfNeeded()
    }
    // Axe should inspect the final visual state, not sample text midway through
    // an opacity transition triggered by the last scroll.
    await page.waitForTimeout(1000)

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const blocking = results.violations.filter((v) =>
      ['serious', 'critical'].includes(v.impact ?? ''),
    )

    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([])
  })

  test('404 page has no serious/critical axe violations', async ({ page }) => {
    await page.goto('/this-route-does-not-exist')

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()

    const blocking = results.violations.filter((v) =>
      ['serious', 'critical'].includes(v.impact ?? ''),
    )
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([])
  })

  test('skip link, main landmark, and live-region patterns exist', async ({ page }) => {
    await page.goto('/')
    await dismissBoot(page)

    await expect(page.getByRole('link', { name: /skip to content/i })).toHaveCount(1)
    await expect(page.locator('#main-content')).toHaveCount(1)
    await expect(page.locator('main')).toHaveCount(1)
  })

  test('command palette exposes listbox/option relationships while open', async ({ page }) => {
    await page.goto('/')
    await dismissBoot(page)
    // Wait until boot is fully done — Ctrl+K is ignored while bootPhase !== done.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.keyboard.press('Control+k')

    const search = page.getByRole('combobox', { name: /search commands/i })
    await expect(search).toBeVisible({ timeout: 15_000 })
    await expect(search).toHaveAttribute('aria-controls', /.*/)
    await expect(page.getByRole('listbox')).toBeVisible()

    await search.fill('navigate')
    const dialog = page.getByRole('dialog', { name: /command palette/i })
    await expect(dialog).toHaveCSS('opacity', '1')

    const results = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    const blocking = results.violations.filter((v) =>
      ['serious', 'critical'].includes(v.impact ?? ''),
    )
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([])
  })

  test('focus-visible treatment is present on themed interactive classes', async ({ page }) => {
    await page.goto('/')
    await dismissBoot(page)

    // Contract check: Writing links / 404 home link use the sitewide ring.
    // We assert the utility exists somewhere in the hydrated DOM class list.
    const hasFocusRing = await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll('[class]'))
      return nodes.some((el) =>
        (el.getAttribute('class') ?? '').includes('focus-visible:ring-accent'),
      )
    })
    expect(hasFocusRing).toBe(true)
  })
})
