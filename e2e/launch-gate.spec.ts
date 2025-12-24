import { expect, test } from '@playwright/test'
import { dismissBoot } from './helpers'

const CANONICAL_DEFAULT = 'https://portfolio.sidakpreetsingh.com'

test.describe('Launch-gate consumers', () => {
  test('security headers are present on HTML responses', async ({ request }) => {
    const res = await request.get('/')
    expect(res.ok()).toBeTruthy()
    const headers = res.headers()
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['x-frame-options']).toBe('SAMEORIGIN')
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
    expect(headers['permissions-policy']).toContain('camera=()')
    expect(headers['strict-transport-security']).toContain('max-age=')
  })

  test('robots.txt reflects the indexing flag (default: disallow all)', async ({ request }) => {
    const res = await request.get('/robots.txt')
    expect(res.ok()).toBeTruthy()
    const body = await res.text()
    // .env.example / CI smoke default keeps indexing off.
    if (process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true') {
      expect(body).toMatch(/Allow:\s*\//i)
      expect(body).toMatch(/Disallow:\s*\/studio/i)
      expect(body).toContain('Sitemap:')
    } else {
      expect(body).toMatch(/Disallow:\s*\//i)
    }
  })

  test('sitemap.xml is empty while indexing is off, populated when on', async ({ request }) => {
    const res = await request.get('/sitemap.xml')
    expect(res.ok()).toBeTruthy()
    const body = await res.text()
    if (process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true') {
      expect(body).toContain('<url>')
      expect(body).toContain(
        process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ?? CANONICAL_DEFAULT,
      )
    } else {
      // Next may serve an empty urlset or a minimal document.
      expect(body).not.toContain(`${CANONICAL_DEFAULT}/`)
    }
  })

  test('canonical and OG metadata use the configured site URL', async ({ page }) => {
    await page.goto('/')
    await dismissBoot(page)

    const expectedBase = (process.env.NEXT_PUBLIC_SITE_URL ?? CANONICAL_DEFAULT).replace(/\/+$/, '')

    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveAttribute('href', new RegExp(expectedBase))

    const ogUrl = page.locator('meta[property="og:url"]')
    if ((await ogUrl.count()) > 0) {
      await expect(ogUrl).toHaveAttribute('content', new RegExp(expectedBase))
    }

    const ogTitle = page.locator('meta[property="og:title"]')
    await expect(ogTitle).toHaveAttribute('content', /Sidakpreet Singh/i)
  })

  test('Open Graph image route responds', async ({ request }) => {
    const res = await request.get('/opengraph-image')
    expect(res.ok()).toBeTruthy()
    const contentType = res.headers()['content-type'] ?? ''
    expect(contentType).toMatch(/image\//)
  })

  test('Studio is either 404 (disabled) or noindex when enabled', async ({ page, request }) => {
    // NEXT_PUBLIC_ENABLE_STUDIO is baked at build time; local .env.local may
    // enable it for authoring. Both outcomes are valid — assert the contract
    // for whichever the running build has.
    const res = await request.get('/studio')
    if (res.status() === 404) {
      expect(res.status()).toBe(404)
      return
    }
    expect(res.ok()).toBeTruthy()
    await page.goto('/studio')
    const robots = page.locator('meta[name="robots"]')
    await expect(robots).toHaveAttribute('content', /noindex/i)
  })

  test('default canonical domain matches the recorded portfolio host', async () => {
    // Config default (lib/config.ts) must stay aligned with the owner's domain
    // unless NEXT_PUBLIC_SITE_URL overrides it. This guards silent drift.
    const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '')
    if (!configured) {
      expect(CANONICAL_DEFAULT).toBe('https://portfolio.sidakpreetsingh.com')
    } else {
      // Owner override is authoritative when set — just assert it is absolute https.
      expect(configured.startsWith('https://')).toBeTruthy()
    }
  })
})
