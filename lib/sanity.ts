import {createClient, type QueryParams} from '@sanity/client'
import {existsSync, readFileSync} from 'fs'
import path from 'path'
import {resumeQuery} from './queries'

type SanityEnv = {
  projectId?: string
  dataset: string
  token?: string
}

const apiVersion = '2024-01-01'

function readLocalEnvFile(): Record<string, string> {
  if (typeof window !== 'undefined') return {}

  const envPaths = [
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), '.env'),
  ]

  for (const envPath of envPaths) {
    if (!existsSync(envPath)) continue

    const file = readFileSync(envPath, 'utf8')
    return Object.fromEntries(
      file
        .split(/\r?\n/)
        .filter(Boolean)
        .filter((line) => !line.startsWith('#'))
        .map((line) => {
          const separatorIndex = line.indexOf('=')
          const key = line.slice(0, separatorIndex).trim()
          const value = line.slice(separatorIndex + 1).trim()
          return [key, value]
        }),
    )
  }

  return {}
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
): Promise<T | null> {
  const {projectId} = getSanityEnv()

  if (!projectId) {
    console.warn('sanityFetch: NEXT_PUBLIC_SANITY_PROJECT_ID is not set.')
    return null
  }

  const client = createSanityClient(false)
  return client.fetch<T>(query, params)
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
      sanityFetch<{url?: string; showDownloadButton?: boolean} | null>(resumeQuery),
      3_000,
    )
    if (resumeData?.showDownloadButton === false) return undefined
    return resumeData?.url
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[sanityFetch] Resume fetch failed or timed out:', message)
    return undefined
  }
}
