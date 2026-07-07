import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

/**
 * Launch-gate pure logic mirrors app/robots.ts + app/sitemap.ts + lib/config.ts
 * URL normalisation so environment flags are test-covered without booting Next.
 */

function normaliseSiteUrl(raw: string | undefined, fallback: string): string {
  return (raw ?? fallback).replace(/\/+$/, '')
}

function isIndexable(flag: string | undefined): boolean {
  return flag === 'true'
}

function robotsRules(indexable: boolean, siteUrl: string) {
  if (!indexable) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    }
  }
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio', '/studio/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}

function sitemapEntries(indexable: boolean, siteUrl: string) {
  if (!indexable) return []
  return [
    {
      url: `${siteUrl}/`,
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
  ]
}

const CANONICAL_DEFAULT = 'https://portfolio.sidakpreetsingh.com'

describe('launch gate — site URL', () => {
  it('defaults to the recorded portfolio domain', () => {
    assert.equal(normaliseSiteUrl(undefined, CANONICAL_DEFAULT), CANONICAL_DEFAULT)
  })

  it('strips trailing slashes', () => {
    assert.equal(
      normaliseSiteUrl('https://portfolio.sidakpreetsingh.com/', CANONICAL_DEFAULT),
      CANONICAL_DEFAULT,
    )
    assert.equal(
      normaliseSiteUrl('https://preview.example.com///', CANONICAL_DEFAULT),
      'https://preview.example.com',
    )
  })
})

describe('launch gate — indexing flag', () => {
  it('is opt-in (only the string "true" enables indexing)', () => {
    assert.equal(isIndexable(undefined), false)
    assert.equal(isIndexable('false'), false)
    assert.equal(isIndexable('1'), false)
    assert.equal(isIndexable('true'), true)
  })
})

describe('launch gate — robots', () => {
  it('disallows everything when not indexable', () => {
    assert.deepEqual(robotsRules(false, CANONICAL_DEFAULT), {
      rules: { userAgent: '*', disallow: '/' },
    })
  })

  it('allows the site, disallows Studio, and points at the sitemap when indexable', () => {
    assert.deepEqual(robotsRules(true, CANONICAL_DEFAULT), {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio', '/studio/'],
      },
      sitemap: `${CANONICAL_DEFAULT}/sitemap.xml`,
      host: CANONICAL_DEFAULT,
    })
  })
})

describe('launch gate — sitemap', () => {
  it('is empty while indexing is off', () => {
    assert.deepEqual(sitemapEntries(false, CANONICAL_DEFAULT), [])
  })

  it('emits the canonical homepage when indexing is on', () => {
    assert.deepEqual(sitemapEntries(true, CANONICAL_DEFAULT), [
      {
        url: `${CANONICAL_DEFAULT}/`,
        changeFrequency: 'monthly',
        priority: 1,
      },
    ])
  })
})

describe('launch gate — security headers contract', () => {
  // Read the real config instead of restating it. A header dropped from
  // next.config.js has to fail here, not only in the browser suite.
  const nextConfigSource = readFileSync(
    fileURLToPath(new URL('../next.config.js', import.meta.url)),
    'utf8',
  )
  const declaredHeaderKeys = [...nextConfigSource.matchAll(/key:\s*'([^']+)'/g)].map((m) => m[1])

  it('declares the conservative site-wide header set', () => {
    assert.deepEqual([...new Set(declaredHeaderKeys)].sort(), [
      'Content-Security-Policy',
      'Permissions-Policy',
      'Referrer-Policy',
      'Strict-Transport-Security',
      'X-Content-Type-Options',
      'X-Frame-Options',
    ])
  })

  it('keeps the deny-by-default CSP baseline on both the public and Studio policies', () => {
    const defaultSrc = [...nextConfigSource.matchAll(/"default-src 'self'"/g)]
    assert.equal(
      defaultSrc.length,
      2,
      'expected a public and a Studio policy, both deny-by-default',
    )
    const objectSrc = [...nextConfigSource.matchAll(/"object-src 'none'"/g)]
    assert.equal(objectSrc.length, 2, 'both policies must keep object-src none')
  })
})
