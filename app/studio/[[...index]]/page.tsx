import { notFound } from 'next/navigation'
import StudioClient from './StudioClient'

/**
 * Embedded Sanity Studio is an authoring surface, not a public page.
 * Enable explicitly via NEXT_PUBLIC_ENABLE_STUDIO=true (local .env.local).
 * Production deploys should leave it unset/false and use Sanity's hosted
 * Studio or project ACLs instead of exposing /studio on the public origin.
 */
export default function StudioPage() {
  if (process.env.NEXT_PUBLIC_ENABLE_STUDIO !== 'true') {
    notFound()
  }
  return <StudioClient />
}
