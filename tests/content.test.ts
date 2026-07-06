import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  resolveSectionData,
  shouldPropagateCmsError,
  shouldUseDemoContent,
} from '../lib/content.ts'
import { demoContent } from '../lib/demoContent.ts'

describe('shouldUseDemoContent', () => {
  it('enables neutral fixtures in development', () => {
    assert.equal(shouldUseDemoContent({ nodeEnv: 'development', envFlag: undefined }), true)
    assert.equal(shouldUseDemoContent({ nodeEnv: 'development', envFlag: 'false' }), true)
  })

  it('requires an explicit flag in production', () => {
    assert.equal(shouldUseDemoContent({ nodeEnv: 'production', envFlag: undefined }), false)
    assert.equal(shouldUseDemoContent({ nodeEnv: 'production', envFlag: 'false' }), false)
    assert.equal(shouldUseDemoContent({ nodeEnv: 'production', envFlag: 'true' }), true)
  })
})

describe('resolveSectionData', () => {
  const demo = [{ id: 'demo', label: 'Demo' }]
  const cms = [{ id: 'cms', label: 'Live' }]

  it('prefers non-empty CMS data', () => {
    assert.deepEqual(resolveSectionData(cms, demo, false), cms)
    assert.deepEqual(resolveSectionData(cms, demo, true), cms)
  })

  it('uses demo content only when enabled', () => {
    assert.deepEqual(resolveSectionData(null, demo, true), demo)
    assert.deepEqual(resolveSectionData(undefined, demo, true), demo)
    assert.deepEqual(resolveSectionData([], demo, true), demo)
    assert.deepEqual(resolveSectionData(null, demo, false), [])
    assert.deepEqual(resolveSectionData([], demo, false), [])
  })
})

describe('shouldPropagateCmsError', () => {
  it('propagates production runtime failures so ISR can retain stale content', () => {
    assert.equal(
      shouldPropagateCmsError({
        nodeEnv: 'production',
        nextPhase: undefined,
        allowBuildWithoutSanity: undefined,
      }),
      true,
    )
  })

  it('propagates production build failures without the smoke escape hatch', () => {
    assert.equal(
      shouldPropagateCmsError({
        nodeEnv: 'production',
        nextPhase: 'phase-production-build',
        allowBuildWithoutSanity: undefined,
      }),
      true,
    )
  })

  it('allows the explicit CMS-less smoke build to degrade to null', () => {
    assert.equal(
      shouldPropagateCmsError({
        nodeEnv: 'production',
        nextPhase: 'phase-production-build',
        allowBuildWithoutSanity: 'true',
      }),
      false,
    )
  })

  it('allows development failures to degrade to null', () => {
    assert.equal(
      shouldPropagateCmsError({
        nodeEnv: 'development',
        nextPhase: undefined,
        allowBuildWithoutSanity: undefined,
      }),
      false,
    )
  })
})

describe('demo content', () => {
  it('covers every optional portfolio section with explicitly neutral fixtures', () => {
    assert.ok(demoContent.experience[0]?.company.startsWith('Example'))
    assert.ok(demoContent.skills.every((entry) => entry.items.length > 0))
    assert.equal(demoContent.metrics[0]?.sub, 'Development fixture')
    assert.ok(demoContent.achievements[0]?.event.startsWith('Example'))
    assert.ok(demoContent.education[0]?.institution.startsWith('Example'))
    assert.equal(demoContent.writing[0]?.url, 'https://example.com')
  })
})
