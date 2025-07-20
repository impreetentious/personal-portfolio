import { identity } from './identity';

// Canonical origin for the deployed portfolio. Override per-environment with
// NEXT_PUBLIC_SITE_URL (e.g. a Vercel preview URL); the trailing slash is
// stripped so callers can safely template `${url}/path`.
const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfolio.sidakpreetsingh.com';

// Indexing is opt-in. This prevents previews and work-in-progress deployments
// from competing with the canonical site before an intentional public launch.
const isIndexable = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true';

export const siteConfig = {
  url: rawSiteUrl.replace(/\/+$/, ''),
  name: identity.name,
  title: `${identity.name} | Portfolio`,
  description:
    'Product strategy, tech & systems — an interactive terminal-themed portfolio.',
  email: identity.email,
  isIndexable,
  features: {
    showWriting: true,
  },
};

// The FALLBACK_* section content is a development aid only (placeholder career
// data for layout work without a CMS connection). In production a section whose
// Sanity fetch returned nothing renders nothing instead — an absent section is
// strictly better than fabricated placeholder credentials under a real name.
// Hero/Contact fallbacks are exempt: they carry real identity data.
export const showDevFallbacks = process.env.NODE_ENV !== 'production';
