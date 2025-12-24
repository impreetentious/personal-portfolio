/** @type {import('next').NextConfig} */

const { PHASE_PRODUCTION_BUILD } = require('next/constants')

// Baseline security headers applied to every route. Intentionally conservative:
// no Content-Security-Policy is set here because the embedded Sanity Studio at
// /studio and the inline JSON-LD script need a carefully-authored policy that is
// out of scope for these headers — the ones below are safe site-wide.
const securityHeaders = [
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

const nextConfig = {
  // Don't advertise the framework in response headers.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
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
