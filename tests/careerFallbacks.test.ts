import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  careerFallbacks,
  resolveSectionData,
  shouldRejectEmptyCmsResult,
  shouldUseCareerFallbacks,
} from '../lib/careerFallbacks.ts'

describe('shouldUseCareerFallbacks', () => {
  it('is on in development regardless of the production gate flag', () => {
    assert.equal(shouldUseCareerFallbacks({ nodeEnv: 'development', envFlag: undefined }), true)
    assert.equal(shouldUseCareerFallbacks({ nodeEnv: 'development', envFlag: 'false' }), true)
  })

  it('is off in production until the owner flips the gate', () => {
    assert.equal(shouldUseCareerFallbacks({ nodeEnv: 'production', envFlag: undefined }), false)
    assert.equal(shouldUseCareerFallbacks({ nodeEnv: 'production', envFlag: 'false' }), false)
  })

  it('is on in production when NEXT_PUBLIC_USE_CAREER_FALLBACKS=true', () => {
    assert.equal(shouldUseCareerFallbacks({ nodeEnv: 'production', envFlag: 'true' }), true)
  })
})

describe('resolveSectionData', () => {
  const fallback = [{ id: 'fb', label: 'Fallback' }]
  const cms = [{ id: 'cms', label: 'Live' }]

  it('prefers non-empty CMS data', () => {
    assert.deepEqual(resolveSectionData(cms, fallback, false), cms)
    assert.deepEqual(resolveSectionData(cms, fallback, true), cms)
  })

  it('degrades to fallback on CMS miss when the gate allows', () => {
    assert.deepEqual(resolveSectionData(null, fallback, true), fallback)
    assert.deepEqual(resolveSectionData(undefined, fallback, true), fallback)
    assert.deepEqual(resolveSectionData([], fallback, true), fallback)
  })

  it('hides the section on CMS miss when the gate is off', () => {
    assert.deepEqual(resolveSectionData(null, fallback, false), [])
    assert.deepEqual(resolveSectionData([], fallback, false), [])
  })

  it('treats empty successful CMS arrays as a miss (ISR empty-success path)', () => {
    assert.deepEqual(resolveSectionData([], fallback, true), fallback)
  })
})

describe('shouldRejectEmptyCmsResult', () => {
  it('rejects empty arrays at production runtime (ISR protection)', () => {
    assert.equal(
      shouldRejectEmptyCmsResult({
        result: [],
        nodeEnv: 'production',
        nextPhase: undefined,
      }),
      true,
    )
  })

  it('allows empty arrays during the production build', () => {
    assert.equal(
      shouldRejectEmptyCmsResult({
        result: [],
        nodeEnv: 'production',
        nextPhase: 'phase-production-build',
      }),
      false,
    )
  })

  it('allows empty arrays in development', () => {
    assert.equal(
      shouldRejectEmptyCmsResult({
        result: [],
        nodeEnv: 'development',
        nextPhase: undefined,
      }),
      false,
    )
  })

  it('does not reject non-empty or non-array results', () => {
    assert.equal(
      shouldRejectEmptyCmsResult({
        result: [{ id: 'x' }],
        nodeEnv: 'production',
        nextPhase: undefined,
      }),
      false,
    )
    assert.equal(
      shouldRejectEmptyCmsResult({
        result: null,
        nodeEnv: 'production',
        nextPhase: undefined,
      }),
      false,
    )
  })
})

describe('careerFallbacks owner slots', () => {
  it('exposes every P8 section slot with at least one entry', () => {
    assert.ok(careerFallbacks.experience.length > 0)
    assert.ok(careerFallbacks.skills.length > 0)
    assert.ok(careerFallbacks.metrics.length > 0)
    assert.ok(careerFallbacks.achievements.length > 0)
    assert.ok(careerFallbacks.education.length > 0)
    assert.ok(careerFallbacks.writing.length > 0)
  })
})
