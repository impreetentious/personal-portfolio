'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect } from 'react'

// Route-level error boundary. Catches runtime errors thrown while rendering the
// page (e.g. a Sanity fetch failing at request time) and replaces Next's default
// unstyled error screen with an on-brand "runtime exception" terminal view.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surface the failure for logging / monitoring.
    console.error(error)
  }, [error])

  return (
    <div id="main-content" tabIndex={-1} className="min-h-screen bg-background flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-16 outline-none">

      {/* Ambient red fog — matches the 404 error state */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 52% at 50% 46%, rgba(244,71,71,0.065), transparent)',
        }}
      />

      <div className="relative z-10 w-full max-w-2xl">

        {/* Pre-window error badge */}
        <motion.p
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'tween', ease: 'easeOut', duration: 0.38 }}
          className="mb-4 font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-red-500/45 select-none"
        >
          uncaught exception · 500 runtime error
        </motion.p>

        {/* ╔══ VS Code editor window ══════════════════════════════════════════╗ */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'tween', ease: 'easeOut', duration: 0.48, delay: 0.06 }}
          className="rounded-xl overflow-hidden border border-white/[0.08] shadow-panel"
        >

          {/* ── Title bar ── */}
          <div className="flex items-center h-9 bg-[#0c0d14] border-b border-white/[0.05]">
            <div className="flex items-center gap-2 pl-3 pr-2.5 h-full bg-[#13161c] border-r border-white/[0.07] min-w-0 max-w-[60vw] sm:max-w-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500/80 shrink-0" aria-hidden="true" />
              <span className="font-mono text-[10.5px] sm:text-xs text-white/50 truncate select-none flex-1">
                error.tsx
              </span>
            </div>
            <div className="flex-1" />
            <div className="hidden sm:flex items-center h-9 px-4 font-mono text-[10.5px] tracking-widest text-white/25 select-none">
              TERMINAL
            </div>
          </div>

          {/* ── Terminal body — runtime stack ── */}
          <div className="bg-[#0e1014] px-4 sm:px-6 py-5 font-mono text-[12px] sm:text-[13px] leading-[1.9] overflow-x-auto">
            <p className="whitespace-nowrap">
              <span className="text-[#4bd0e7ff] select-none">PS&nbsp;</span>
              <span className="text-[#4bd0e7ff]">C:\portfolio</span>
              <span className="text-white/35 mx-1">{'>'}</span>
              <span className="text-white/70">npm run start</span>
            </p>
            <p className="text-white/30 mt-2">▲ Next.js — rendering route /</p>
            <p className="text-red-300/85 mt-3">✕ Unhandled Runtime Error</p>
            <p className="text-red-300/70 pl-4 break-words whitespace-pre-wrap">
              {error?.message ||
                'An unexpected error occurred while rendering this page.'}
            </p>
            {error?.digest && (
              <p className="text-white/25 pl-4 mt-1">digest: {error.digest}</p>
            )}
            <p className="text-[#6A9955] mt-3">
              {'// logged to the console — retry the render, or head home.'}
            </p>
          </div>

          {/* ── Actions ── */}
          <div className="bg-[#0e1014] border-t border-white/[0.06] px-4 sm:px-6 py-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 rounded-md border border-accent/30 bg-accent/10 px-3.5 py-2 font-mono text-xs sm:text-sm text-accent transition-colors duration-200 hover:bg-accent/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/60"
            >
              <span aria-hidden="true">↻</span> retry render
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3.5 py-2 font-mono text-xs sm:text-sm text-white/70 transition-colors duration-200 hover:border-white/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/60"
            >
              <span aria-hidden="true">→</span> cd /home
            </Link>
          </div>

          {/* ── Status bar — red for error state ── */}
          <div
            className="flex items-center justify-between h-[22px] px-3 select-none shrink-0"
            style={{ backgroundColor: '#c42b1c' }}
          >
            <span className="font-mono text-xs text-white/85 leading-none">main</span>
            <span className="font-mono text-xs text-white/90 leading-none">✕&nbsp;1 error</span>
          </div>

        </motion.div>
        {/* ╚═══════════════════════════════════════════════════════════════════╝ */}

        {/* Below-window caption */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'tween', ease: 'easeOut', duration: 0.5, delay: 1.0 }}
          className="mt-5 sm:mt-6 text-center font-mono text-[10.5px] sm:text-[11px] text-white/[0.18] select-none"
        >
          Something threw while rendering. It&apos;s not you — it&apos;s the server.
        </motion.p>

      </div>
    </div>
  )
}
