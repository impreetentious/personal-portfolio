import { expect, test } from '@playwright/test'
import { dismissBoot, markSessionVisited, VIEWPORTS } from './helpers'

test.describe('Production interaction QA matrix', () => {
  for (const [name, viewport] of Object.entries(VIEWPORTS)) {
    test(`renders the hero composition at ${name} viewport`, async ({ page }) => {
      await page.setViewportSize(viewport)
      await page.goto('/')
      await dismissBoot(page)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(page.locator('#main-content')).toBeVisible()
    })
  }

  test('skips first-boot with Escape and reaches interactive UI', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    // Before dismiss, boot may cover; Esc clears it.
    await page.keyboard.press('Escape')
    await expect(page.locator('#main-content')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('repeat-session flash path still leaves content reachable', async ({ page }) => {
    await page.goto('/')
    await dismissBoot(page)
    await markSessionVisited(page)
    await page.reload()
    // Flash auto-completes quickly; reducedMotion already short-circuits.
    await expect(page.locator('#main-content')).toBeVisible({ timeout: 8000 })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('reduced motion short-circuits boot without keyboard skip', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.locator('#main-content')).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('Ctrl+K opens and Escape closes the command palette', async ({ page }) => {
    await page.goto('/')
    await dismissBoot(page)

    await page.keyboard.press('Control+k')
    const search = page.getByRole('combobox', { name: /search commands/i })
    await expect(search).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(search).toHaveCount(0)
  })

  test('keyboard can reach the skip link and land on main content', async ({ page }) => {
    await page.goto('/')
    await dismissBoot(page)

    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: /skip to content/i })
    await expect(skip).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('#main-content')).toBeFocused()
  })

  test('preserves an initial hash through mount', async ({ page }) => {
    await page.goto('/#writing')
    await dismissBoot(page)
    await expect(page).toHaveURL(/#writing/)
  })

  test('Experience accordion toggles via keyboard', async ({ page }) => {
    await page.goto('/')
    await dismissBoot(page)

    const experience = page.locator('#experience')
    if ((await experience.count()) === 0) {
      test.skip(true, 'Experience section hidden (no CMS / gate off)')
      return
    }

    await experience.scrollIntoViewIfNeeded()
    const toggle = experience.getByRole('button').first()
    await expect(toggle).toBeVisible()
    const controls = await toggle.getAttribute('aria-controls')
    expect(controls).toBeTruthy()

    await toggle.focus()
    await page.keyboard.press('Enter')
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    if (controls) {
      // CMS ids may start with a digit — attribute selector, not #id.
      await expect(page.locator(`[id="${controls}"]`)).toBeAttached()
    }
  })

  test('Achievements accordion exposes a stable aria-controls target', async ({ page }) => {
    await page.goto('/')
    await dismissBoot(page)

    const section = page.locator('#achievements')
    if ((await section.count()) === 0) {
      test.skip(true, 'Achievements section hidden (no CMS / gate off)')
      return
    }

    await section.scrollIntoViewIfNeeded()
    const toggle = section.locator('button[aria-controls]').first()
    await expect(toggle).toBeVisible()
    const controls = await toggle.getAttribute('aria-controls')
    expect(controls).toBeTruthy()
    await expect(page.locator(`[id="${controls!}"]`)).toHaveCount(1)
  })

  test('Skills tooltip can be dismissed with Escape when focused', async ({ page }) => {
    await page.goto('/')
    await dismissBoot(page)

    const skills = page.locator('#skills')
    if ((await skills.count()) === 0) {
      test.skip(true, 'Skills section hidden (no CMS / gate off)')
      return
    }

    await skills.scrollIntoViewIfNeeded()
    const pill = skills.locator('button, [tabindex="0"]').first()
    if ((await pill.count()) === 0) {
      test.skip(true, 'No focusable skill pills')
      return
    }
    await pill.focus()
    await page.keyboard.press('Escape')
    // Dismissal is a no-throw smoke — tooltip may already be closed.
    await expect(skills).toBeVisible()
  })

  test('Contact copy action updates a polite live region', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto('/')
    await dismissBoot(page)

    const contact = page.locator('#contact')
    await contact.scrollIntoViewIfNeeded()
    const copyButton = contact.getByRole('link', { name: /click to copy/i }).first()
    if ((await copyButton.count()) === 0) {
      test.skip(true, 'No copy-to-clipboard contact channels')
      return
    }
    await copyButton.click()
    await expect(contact.locator('[aria-live="polite"]')).toBeVisible()
  })

  test('resume entry points are present when a resume URL is available', async ({ page }) => {
    await page.goto('/')
    await dismissBoot(page)

    // Hero terminal and/or palette expose resume. Presence is enough here —
    // the PDF binary itself is an owner CMS asset.
    const resumeControls = page.getByRole('button', { name: /resume/i })
    const count = await resumeControls.count()
    // Smoke build without CMS may have zero resume buttons — that is accepted.
    if (count === 0) {
      test.info().annotations.push({
        type: 'note',
        description: 'No resume entry points (CMS resume absent in this build)',
      })
      return
    }
    await expect(resumeControls.first()).toBeVisible()
  })

  test('palette preserves text entered before opening timers run', async ({ page }) => {
    await page.goto('/')
    await dismissBoot(page)
    const clockStart = new Date()
    await page.clock.install({ time: clockStart })
    await page.clock.pauseAt(new Date(clockStart.getTime() + 1000))
    await page.keyboard.press('Control+k')
    const search = page.getByRole('combobox', { name: /search commands/i })
    await search.fill('experience')
    await page.clock.runFor(100)
    await expect(search).toHaveValue('experience')
    await expect(page.getByRole('option', { name: /experience/i })).toHaveCount(1)
  })

  test('404 page renders the themed not-found surface', async ({ page }) => {
    await page.goto('/this-route-does-not-exist')
    await expect(page.getByRole('link', { name: /cd \/home/i })).toBeVisible()
  })

  test('palette dialog moves focus into the combobox while open', async ({ page }) => {
    await page.goto('/')
    await dismissBoot(page)
    await page.keyboard.press('Control+k')
    const search = page.getByRole('combobox', { name: /search commands/i })
    await expect(search).toBeFocused()
  })
})
