import {createClient, type QueryParams} from '@sanity/client'
import {existsSync, readFileSync} from 'fs'
import path from 'path'
import {cache} from 'react'
import {resumeQuery} from './queries'

type SanityEnv = {
  projectId?: string
  dataset: string
  token?: string
}

const apiVersion = '2024-01-01'

// Default ISR window for content fetches. Rendered pages and the underlying
// Sanity responses revalidate on this cadence instead of refetching per request.
const DEFAULT_REVALIDATE_SECONDS = 3600

// Hard ceiling for any single content fetch so a slow/hung Sanity request can't
// stall server rendering indefinitely.
const FETCH_TIMEOUT_MS = 8000

// Local env files never change while the process runs, so read them at most once
// instead of on every getSanityEnv() call (previously ~18 sync disk reads per
// page load). Cached across requests within the same server process.
let localEnvCache: Record<string, string> | null = null

function readLocalEnvFile(): Record<string, string> {
  if (typeof window !== 'undefined') return {}
  if (localEnvCache) return localEnvCache

  const envPaths = [
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), '.env'),
  ]

  const merged: Record<string, string> = {}
  for (const envPath of envPaths) {
    if (!existsSync(envPath)) continue

    const file = readFileSync(envPath, 'utf8')
    for (const line of file.split(/\r?\n/)) {
      if (!line || line.startsWith('#')) continue
      const separatorIndex = line.indexOf('=')
      if (separatorIndex === -1) continue
      const key = line.slice(0, separatorIndex).trim()
      // First file to define a key wins (.env.local takes precedence over .env).
      if (!(key in merged)) merged[key] = line.slice(separatorIndex + 1).trim()
    }
  }

  localEnvCache = merged
  return localEnvCache
}

function getSanityEnv(): SanityEnv {
  const localEnv = readLocalEnvFile()

  return {
    projectId:
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
      localEnv.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset:
      process.env.NEXT_PUBLIC_SANITY_DATASET ??
      localEnv.NEXT_PUBLIC_SANITY_DATASET ??
      'production',
    token:
      process.env.SANITY_API_READ_TOKEN ??
      localEnv.SANITY_API_READ_TOKEN,
  }
}

function createSanityClient(useCdn: boolean) {
  const {projectId, dataset, token} = getSanityEnv()

  return createClient({
    projectId: projectId ?? '',
    dataset,
    apiVersion,
    useCdn,
    token,
  })
}

export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
  revalidate: number = DEFAULT_REVALIDATE_SECONDS,
): Promise<T | null> {
  const {projectId} = getSanityEnv()

  if (!projectId) {
    console.warn('sanityFetch: NEXT_PUBLIC_SANITY_PROJECT_ID is not set.')
    return null
  }

  const client = createSanityClient(false)

  // Every query is guarded here so a single failing/timed-out fetch degrades to
  // `null` (letting each section fall back to its FALLBACK_* data) instead of
  // rejecting the caller's Promise.all and taking the whole page to the error
  // boundary.
  // `next.revalidate` opts each response into Next's Data Cache so the route can
  // render statically and refresh on the ISR window rather than per request.
  try {
    return await withTimeout(
      client.fetch<T>(query, params, {next: {revalidate}}),
      FETCH_TIMEOUT_MS,
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[sanityFetch] query failed or timed out:', message)
    return null
  }
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

// Wrapped in React.cache so the two independent callers in a single render pass
// (RootLayout + Home) share one fetch per request instead of hitting Sanity —
// and re-reading the env — twice. sanityFetch already guards errors/timeouts.
export const getResumeUrl = cache(async (): Promise<string | undefined> => {
  const resumeData = await sanityFetch<{url?: string; showDownloadButton?: boolean}>(
    resumeQuery,
  )
  if (resumeData?.showDownloadButton === false) return undefined
  return resumeData?.url
})
