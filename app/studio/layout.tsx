import type {Metadata} from 'next'
import type {ReactNode} from 'react'

// The Studio is an authoring tool, not indexable content — keep search engines
// out of it (mirrors the disallow rule in app/robots.ts). The title fills the
// browser tab during the ~8s Studio JS load; Sanity replaces it dynamically as
// the editor navigates.
export const metadata: Metadata = {
  title  : 'Studio · Sidakpreet Singh',
  robots : {index: false, follow: false},
}

/**
 * Studio layout isolation wrapper.
 *
 * Problem this solves:
 *   Every route renders inside LayoutShell's <motion.main>, which carries
 *   min-height and bottom padding (and, on content routes, the Navigation and
 *   boot overlays). LayoutShell already skips the nav/palette/boot chrome for
 *   /studio, but the Studio still needs to fill the full viewport with none of
 *   that inherited layout or padding.
 *
 * Solution:
 *   This layout renders a position:fixed, inset-0, z-index:9999 container.
 *   Fixed positioning is relative to the viewport (not the containing block),
 *   so any ancestor sizing/padding has zero effect on the Studio, and the high
 *   z-index keeps it above the portfolio chrome as a belt-and-braces measure.
 *
 * This layout only applies to routes under /studio — all other pages are
 * completely unaffected.
 */
export default function StudioLayout({children}: {children: ReactNode}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
      }}
    >
      {children}
    </div>
  )
}
