import { identity } from './identity'
import { shouldUseCareerFallbacks } from './careerFallbacks'

// Canonical origin for the deployed portfolio. Override per-environment with
// NEXT_PUBLIC_SITE_URL (e.g. a Vercel preview URL); the trailing slash is
// stripped so callers can safely template `${url}/path`.
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfolio.sidakpreetsingh.com'

// Indexing is opt-in. This prevents previews and work-in-progress deployments
// from competing with the canonical site before an intentional public launch.
const isIndexable = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true'

export const siteConfig = {
  url: rawSiteUrl.replace(/\/+$/, ''),
  name: identity.name,
  title: `${identity.name} | Portfolio`,
  description: 'Product strategy, tech & systems — an interactive terminal-themed portfolio.',
  email: identity.email,
  isIndexable,
  features: {
    showWriting: true,
  },
}

// P8 production gate. Career-section fallbacks (Experience/Skills/Metrics/
// Achievements/Education/Writing) stay development-only until the owner vets
// real copy in lib/careerFallbacks.ts and sets
// NEXT_PUBLIC_USE_CAREER_FALLBACKS=true. Hero/Contact identity fallbacks are
// always production-safe and are unaffected by this switch.
export const useCareerFallbacks = shouldUseCareerFallbacks({
  nodeEnv: process.env.NODE_ENV,
  envFlag: process.env.NEXT_PUBLIC_USE_CAREER_FALLBACKS,
})

/** @deprecated Prefer useCareerFallbacks — kept as a thin alias for readability. */
export const showDevFallbacks = useCareerFallbacks
