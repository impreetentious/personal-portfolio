import { notFound } from 'next/navigation'
import StudioClient from './StudioClient'

/**
 * Embedded Sanity Studio is an authoring surface, not a public page.
 * Enable explicitly via NEXT_PUBLIC_ENABLE_STUDIO=true. The route receives the
 * Sanity-specific production CSP from next.config.js.
 */
export default function StudioPage() {
  if (process.env.NEXT_PUBLIC_ENABLE_STUDIO !== 'true') {
    notFound()
  }
  return <StudioClient />
}
