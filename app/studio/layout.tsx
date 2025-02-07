import type {ReactNode} from 'react'

/**
 * Studio layout isolation wrapper.
 *
 * Problem this solves:
 *   The root app/layout.tsx wraps all children inside a <div class="md:pl-28">
 *   and renders the portfolio Navigation on every page. Sanity Studio needs to
 *   fill the full viewport with no inherited padding or overlapping nav elements.
 *
 * Solution:
 *   This layout renders a position:fixed, inset-0, z-index:9999 container.
 *   Fixed positioning is always relative to the viewport (not the containing
 *   block), so the root layout's padding div has zero effect on the Studio.
 *   The z-index keeps the Studio above the portfolio Navigation (z-50 / z-40).
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
