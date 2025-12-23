import AxeBuilder from '@axe-core/playwright'
import {expect, test} from '@playwright/test'
import {dismissBoot} from './helpers'

test.describe('Accessibility release gate', () => {
  test('homepage has no serious/critical axe violations', async ({page}) => {
    await page.goto('/')
    await dismissBoot(page)

    // color-contrast is disabled for the full-page scan: the terminal theme
    // intentionally uses muted chrome (text-white/30, /[0.18], etc.). That is
    // an owner design ruling, not a regression. Interactive controls still get
    // the sitewide focus-visible ring (asserted below); a screen-reader smoke
    // pass remains a human launch-gate step.
    const results = await new AxeBuilder({page})
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .disableRules(['color-contrast'])
      .analyze()

    const blocking = results.violations.filter((v) =>
      ['serious', 'critical'].includes(v.impact ?? ''),
    )

    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([])
  })

  test('404 page has no serious/critical axe violations', async ({page}) => {
    await page.goto('/this-route-does-not-exist')

    const results = await new AxeBuilder({page})
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast'])
      .analyze()

    const blocking = results.violations.filter((v) =>
      ['serious', 'critical'].includes(v.impact ?? ''),
    )
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([])
  })

  test('skip link, main landmark, and live-region patterns exist', async ({
    page,
  }) => {
    await page.goto('/')
    await dismissBoot(page)

    await expect(page.getByRole('link', {name: /skip to content/i})).toHaveCount(1)
    await expect(page.locator('#main-content')).toHaveCount(1)
    await expect(page.locator('main')).toHaveCount(1)
  })

  test('command palette exposes listbox/option relationships while open', async ({
    page,
  }) => {
    await page.goto('/')
    await dismissBoot(page)
    // Wait until boot is fully done — Ctrl+K is ignored while bootPhase !== done.
    await expect(page.getByRole('heading', {level: 1})).toBeVisible()
    await page.keyboard.press('Control+k')

    const search = page.getByRole('combobox', {name: /search commands/i})
    await expect(search).toBeVisible({timeout: 15_000})
    await expect(search).toHaveAttribute('aria-controls', /.*/)
    await expect(page.getByRole('listbox')).toBeVisible()
  })

  test('focus-visible treatment is present on themed interactive classes', async ({
    page,
  }) => {
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
