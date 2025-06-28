import { createClient, type QueryParams } from '@sanity/client'
import { resumeQuery } from './queries'

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

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timerId: ReturnType<typeof setTimeout>
  const timeout = new Promise<never>((_, reject) => {
    timerId = setTimeout(
      () => reject(new Error(`Sanity fetch timed out after ${ms}ms`)),
      ms,
    )
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timerId!))
}

export async function getResumeUrl(): Promise<string | undefined> {
  try {
    const resumeData = await withTimeout(
      sanityFetch<{ url?: string } | null>(resumeQuery),
      3_000,
    )
    return resumeData?.url
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[sanityFetch] Resume fetch failed or timed out:', message)
    return undefined
  }
}