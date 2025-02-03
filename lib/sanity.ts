import {createClient, type QueryParams} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const apiVersion = '2024-01-01'

if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Add it to .env.local.')
}

/**
 * CDN-backed in production for fast edge reads; bypassed in development
 * so content changes appear immediately without cache delays.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
})

/**
 * Server-only client — adds the read token so unpublished / draft documents
 * are included. Never pass it to Client Components.
 */
export const sanityServerClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
})

export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {}
): Promise<T> {
  return sanityClient.fetch<T>(query, params)
}