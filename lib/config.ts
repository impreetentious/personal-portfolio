// Canonical origin for the deployed portfolio. Override per-environment with
// NEXT_PUBLIC_SITE_URL (e.g. a Vercel preview URL); the trailing slash is
// stripped so callers can safely template `${url}/path`.
const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfolio.sidakpreetsingh.com';

export const siteConfig = {
  url: rawSiteUrl.replace(/\/+$/, ''),
  name: 'Sidakpreet Singh',
  title: 'Sidakpreet Singh | Portfolio',
  description:
    'Product strategy, tech & systems — an interactive terminal-themed portfolio.',
  email: 'work@sidakpreetsingh.com',
  features: {
    showWriting: true,
  },
};