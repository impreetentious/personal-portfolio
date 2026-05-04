/** @type {import('next').NextConfig} */

const { PHASE_PRODUCTION_BUILD } = require('next/constants')

// The public portfolio and the embedded Studio get separate CSPs. The public
// page fetches Sanity on the server, while /studio is a browser application and
// needs the documented Sanity service origins. JSON-LD is inert data and does
// not need a script-src allowance of its own.
const publicContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://*.vercel-insights.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "form-action 'self'",
].join('; ')

// Sanity's current Studio system requirements list *.api.sanity.io,
// *.apicdn.sanity.io, cdn.sanity.io, *.sanity-cdn.com, media.sanity.io, and
// manage.sanity.io. SSE uses the API origins; wss is retained for Studio's
// real-time transport. Optional Sentry and Maps origins are not enabled by this
// Studio's plugin set, so they are intentionally absent.
const studioContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://sanity-cdn.com https://*.sanity-cdn.com",
  "style-src 'self' 'unsafe-inline' https://sanity-cdn.com https://*.sanity-cdn.com",
  "img-src 'self' data: blob: https://cdn.sanity.io https://media.sanity.io https://sanity-cdn.com https://*.sanity-cdn.com",
  "font-src 'self' data: https://cdn.sanity.io https://sanity-cdn.com https://*.sanity-cdn.com",
  "connect-src 'self' https://*.api.sanity.io wss://*.api.sanity.io https://*.apicdn.sanity.io https://media.sanity.io https://manage.sanity.io https://sanity-cdn.com https://*.sanity-cdn.com",
  "frame-src 'self' https://*.sanity.io",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "worker-src 'self' blob:",
  "manifest-src 'self' https://sanity-cdn.com https://*.sanity-cdn.com",
  "form-action 'self' https://*.sanity.io",
].join('; ')

const sharedSecurityHeaders = [
  // Stop browsers from MIME-sniffing responses away from their declared type.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Disallow the site being framed by other origins (clickjacking).
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Trim the referrer sent cross-origin to just the origin.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Opt out of powerful features the portfolio never uses.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  // Only meaningful over HTTPS; ignored on plain http (e.g. localhost).
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
]

const securityHeaders = [
  { key: 'Content-Security-Policy', value: publicContentSecurityPolicy },
  ...sharedSecurityHeaders,
]

const studioSecurityHeaders = [
  { key: 'Content-Security-Policy', value: studioContentSecurityPolicy },
  ...sharedSecurityHeaders,
]

const nextConfig = {
  // Don't advertise the framework in response headers.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/studio/:path*',
        headers: studioSecurityHeaders,
      },
    ]
  },
}

// A production build without a Sanity project id would ship a page whose
// content sections are all empty — career fallbacks stay off in production
// until NEXT_PUBLIC_USE_CAREER_FALLBACKS=true (see lib/config.ts). Fail the
// build loudly instead of deploying that silently. Scoped to the build phase
// so `next dev` and `next start` are unaffected.
// Intentional CMS-less smoke build: ALLOW_BUILD_WITHOUT_SANITY=true npm run build
module.exports = (phase) => {
  if (
    phase === PHASE_PRODUCTION_BUILD &&
    !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    process.env.ALLOW_BUILD_WITHOUT_SANITY !== 'true'
  ) {
    throw new Error(
      'NEXT_PUBLIC_SANITY_PROJECT_ID is not set for a production build — content ' +
        'sections would render empty (career fallbacks stay off until ' +
        'NEXT_PUBLIC_USE_CAREER_FALLBACKS=true). Set the variable (see ' +
        '.env.example), or set ALLOW_BUILD_WITHOUT_SANITY=true to build without ' +
        'CMS content anyway.',
    )
  }
  return nextConfig
}
