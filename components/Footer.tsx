'use client'

import { GitBranch } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Footer() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [renderTime, setRenderTime] = useState<number | null>(null)

  useEffect(() => {
    setSessionId(Math.random().toString(36).slice(2, 8).padEnd(6, '0').toUpperCase())
    setRenderTime(Math.round(performance.now()))
  }, [])

  return (
    <footer className="w-full">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 md:px-12 pt-4 pb-6 sm:py-8">
        {/* ── Main row ── */}
        <div className="flex items-center justify-between">
          <p className="font-mono hidden sm:block text-[11px] text-foreground/50">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Sidakpreet Singh
          </p>

          <p className="font-mono sm:hidden text-[11px] text-foreground/50">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span>
          </p>

          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-foreground/50 select-none">
            <GitBranch className="w-3 h-3" />
            <span>main</span>
            <span className="text-foreground/50">·</span>
            <span className="text-green-500/90">✓</span>
          </div>

          <p className="text-[11px] italic text-foreground/50">
            Built with curiosity, coffee and AI.
          </p>
        </div>

        {/* ── Metadata row ── */}
        <div
          aria-hidden="true"
          className="w-full border-t border-white/[0.04] mt-3 pt-3 flex items-center justify-between flex-wrap gap-3 sm:gap-0 select-none"
        >
          <span className="hidden sm:block font-mono text-[10px] text-white/[0.18] tracking-[0.04em]">
            node: <span className="text-white/30">edge-01</span>
          </span>

          <span className="font-mono text-[10px] text-white/[0.18] tracking-[0.04em]">
            session: <span className="text-white/30">{sessionId ?? '------'}</span>
          </span>

          <span className="font-mono text-[10px] text-white/[0.18] tracking-[0.04em]">
            render:{' '}
            <span className="text-white/30">{renderTime !== null ? `${renderTime}ms` : '---'}</span>
          </span>

          <span className="font-mono text-[10px] text-white/[0.18] tracking-[0.04em]">
            loc: <span className="text-white/30">IN</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
