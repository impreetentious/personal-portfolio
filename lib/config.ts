import { identity } from './identity'
import { shouldUseDemoContent } from './content'

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
  tagline: identity.tagline,
  location: identity.location,
  isIndexable,
  features: {
    showWriting: true,
  },
}

// Neutral demo records keep local layouts and smoke tests useful without a CMS.
// Production uses them only when the explicit demo flag is enabled.
export const useDemoContent = shouldUseDemoContent({
  nodeEnv: process.env.NODE_ENV,
  envFlag: process.env.NEXT_PUBLIC_USE_DEMO_CONTENT,
})
