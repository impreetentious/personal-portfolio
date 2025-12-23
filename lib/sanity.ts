import {createClient, type QueryParams} from '@sanity/client'
import {cache} from 'react'
import {
  EmptyCmsResultError,
  shouldRejectEmptyCmsResult,
} from './careerFallbacks'
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

// Next.js loads .env.local/.env into process.env for every runtime path
// (dev/build/start), so reading straight from process.env is sufficient — a
// previous hand-rolled .env file parser here was unreachable dead code.
function getSanityEnv(): SanityEnv {
  return {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
    token: process.env.SANITY_API_READ_TOKEN,
  }
}

// One client for all content fetches, built lazily on first use. Constructing a
// client isn't free and sanityFetch runs ~8×/render (the page's Promise.all), so
// a fresh client per query was pure waste. Module-level state persists across
// requests in the server runtime, which is fine — the query, params, and cache
// window are all passed per fetch, not baked into the client. useCdn is false
// because Next's Data Cache (next.revalidate) already fronts these reads.
let sanityClient: ReturnType<typeof createClient> | null = null

function getSanityClient() {
  if (!sanityClient) {
    const {projectId, dataset, token} = getSanityEnv()
    sanityClient = createClient({
      projectId: projectId ?? '',
      dataset,
      apiVersion,
      useCdn: false,
      token,
    })
  }
  return sanityClient
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

  const client = getSanityClient()

  // Every query is guarded here so a single failing/timed-out fetch degrades to
  // `null` (letting each section fall back via resolveSectionData) instead of
  // rejecting the caller's Promise.all and taking the whole page to the error
  // boundary. Exceptions: production build failures (see catch) and empty-array
  // results at production runtime (ISR empty-success protection below).
  // `next.revalidate` opts each response into Next's Data Cache so the route can
  // render statically and refresh on the ISR window rather than per request.
  try {
    const result = await withTimeout(
      client.fetch<T>(query, params, {next: {revalidate}}),
      FETCH_TIMEOUT_MS,
    )
    // An hourly ISR revalidation that *succeeds* with [] would otherwise replace
    // a good cached page with blank sections. Refuse empty arrays at runtime so
    // Next keeps the previous generation; build-time empties remain allowed.
    if (
      shouldRejectEmptyCmsResult({
        result,
        nodeEnv: process.env.NODE_ENV,
        nextPhase: process.env.NEXT_PHASE,
      })
    ) {
      throw new EmptyCmsResultError(
        '[sanityFetch] refusing empty CMS array at runtime — preserving prior ISR generation',
      )
    }
    return result
  } catch (err) {
    // Empty-array refusal must propagate so the revalidation fails closed.
    if (err instanceof EmptyCmsResultError) throw err

    const message = err instanceof Error ? err.message : String(err)
    // During the production build a failed query must fail the build: degrading
    // to `null` here would let a configured-but-unreachable Sanity (DNS, auth,
    // dataset, timeout) exit 0 and deploy a page with every content section
    // empty. Runtime (ISR revalidation) keeps the degrade-to-null behaviour,
    // and the next.config.js smoke-build escape hatch is honoured.
    if (
      process.env.NEXT_PHASE === 'phase-production-build' &&
      process.env.ALLOW_BUILD_WITHOUT_SANITY !== 'true'
    ) {
      throw new Error(`[sanityFetch] query failed during the production build: ${message}`)
    }
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
