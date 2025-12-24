'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// Shared resume-download engine used by both the hero terminal (WindowsTerminal)
// and the command palette. Centralising it fixes the bugs that the two
// hand-rolled copies drifted into independently:
//   • the created object URL is tracked in a ref and always revoked — on the
//     post-download timer, on cancel, and on unmount — so navigating away or
//     closing mid-flight never leaks it;
//   • `cancel()` bumps a session token so a fetch that resolves after the user
//     closes/navigates is ignored instead of silently firing a save dialog;
//   • failures surface an explicit `'error'` state instead of silently resetting.

export type DownloadState = 'idle' | 'compiling' | 'ready' | 'error'

// Minimum time the "compiling" state is shown so the transition reads as a real
// step rather than a flicker, even when the asset is served from cache.
const MIN_COMPILE_MS = 800
// How long the terminal error state lingers before returning to idle.
const ERROR_RESET_MS = 2000

type UseResumeDownloadOptions = {
  fileName?: string
  // How long the 'ready' state shows before reverting to idle + firing onComplete.
  readyDelayMs?: number
  // Fired once a download has completed successfully (e.g. auto-close the palette).
  onComplete?: () => void
}

export function useResumeDownload(
  resumeUrl: string | undefined,
  { fileName = 'resume.pdf', readyDelayMs = 500, onComplete }: UseResumeDownloadOptions = {},
) {
  const [state, setState] = useState<DownloadState>('idle')

  const sessionRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const objectUrlRef = useRef<string | null>(null)

  // Keep the latest onComplete without re-creating `start`/`cancel` every render.
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const revokeUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
  }, [])

  // Abort any in-flight/pending download and release its resources. Bumping the
  // session invalidates a fetch that resolves after this call.
  const cancel = useCallback(() => {
    sessionRef.current++
    clearTimer()
    revokeUrl()
    setState('idle')
  }, [clearTimer, revokeUrl])

  // Release the object URL + timer if the component unmounts mid-flight.
  useEffect(
    () => () => {
      clearTimer()
      revokeUrl()
    },
    [clearTimer, revokeUrl],
  )

  const start = useCallback(async () => {
    if (!resumeUrl || state !== 'idle') return
    const session = ++sessionRef.current
    setState('compiling')

    try {
      const [blob] = await Promise.all([
        fetch(resumeUrl).then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`)
          return r.blob()
        }),
        new Promise<void>((resolve) => setTimeout(resolve, MIN_COMPILE_MS)),
      ])
      if (session !== sessionRef.current) return

      const objectUrl = URL.createObjectURL(blob)
      objectUrlRef.current = objectUrl
      setState('ready')

      const link = document.createElement('a')
      link.href = objectUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      timerRef.current = setTimeout(() => {
        timerRef.current = null
        revokeUrl()
        if (session !== sessionRef.current) return
        setState('idle')
        onCompleteRef.current?.()
      }, readyDelayMs)
    } catch (error) {
      if (session !== sessionRef.current) return
      console.error('[useResumeDownload] Resume fetch failed:', error)
      setState('error')
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        if (session === sessionRef.current) setState('idle')
      }, ERROR_RESET_MS)
    }
  }, [resumeUrl, state, fileName, readyDelayMs, revokeUrl])

  return { state, start, cancel }
}
