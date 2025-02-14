import {createClient, type QueryParams} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const apiVersion = '2024-01-01'

export const sanityClient = createClient({
  projectId: projectId ?? '',
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
})

export const sanityServerClient = createClient({
  projectId: projectId ?? '',
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
})

export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {}
): Promise<T | null> {
  if (!projectId) {
    console.warn('sanityFetch: NEXT_PUBLIC_SANITY_PROJECT_ID is not set.')
    return null
  }
  return sanityClient.fetch<T>(query, params)
}