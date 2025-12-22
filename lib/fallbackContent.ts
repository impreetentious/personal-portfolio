/**
 * P8 fallback content surface.
 *
 * Re-exports the owner-slot module so section components have one import path.
 * Edit careerFallbacks.* slots with vetted copy; flip the production gate via
 * NEXT_PUBLIC_USE_CAREER_FALLBACKS (see lib/config.ts).
 */
export {
  careerFallbacks,
  resolveSectionData,
  shouldRejectEmptyCmsResult,
  shouldUseCareerFallbacks,
  EmptyCmsResultError,
} from './careerFallbacks'
