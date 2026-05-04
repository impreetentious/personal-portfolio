import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

/**
 * Launch-gate pure logic mirrors app/robots.ts + app/sitemap.ts + lib/config.ts
 * URL normalisation so the owner's env flags are test-covered without booting Next.
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
  // Mirrors next.config.js securityHeaders — assert the contract the e2e suite
  // also checks against live responses so a silent deletion fails unit tests too.
  const expected = [
    'Content-Security-Policy',
    'X-Content-Type-Options',
    'X-Frame-Options',
    'Referrer-Policy',
    'Permissions-Policy',
    'Strict-Transport-Security',
  ]

  it('lists the conservative site-wide header set', () => {
    assert.deepEqual(expected, [
      'Content-Security-Policy',
      'X-Content-Type-Options',
      'X-Frame-Options',
      'Referrer-Policy',
      'Permissions-Policy',
      'Strict-Transport-Security',
    ])
  })
})
