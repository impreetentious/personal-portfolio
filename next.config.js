/** @type {import('next').NextConfig} */

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
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  // Only meaningful over HTTPS; ignored on plain http (e.g. localhost).
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
]

const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig
