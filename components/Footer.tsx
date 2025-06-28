'use client'

import { GitBranch } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DISPLAY_VERSION } from '@/lib/version'

export function Footer() {
  const [sessionId, setSessionId]   = useState<string | null>(null)
  const [renderTime, setRenderTime] = useState<number | null>(null)

  useEffect(() => {
    setSessionId(
      Math.random().toString(36).slice(2, 8).padEnd(6, '0').toUpperCase()
    )
    setRenderTime(Math.round(performance.now()))
  }, [])

  return (
    <footer className="w-full">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 md:px-12 pt-4 pb-6 sm:py-8">

        {/* ── Main row ── */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-foreground/50">© 2025 Sidakpreet Singh</p>

          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-foreground/50 select-none">
            <GitBranch className="w-3 h-3" />
            <span>main</span>
            <span className="text-foreground/50">·</span>
            <span className="text-green-500/90">✓</span>
          </div>

          <p className="text-xs font-medium text-foreground/50">{DISPLAY_VERSION}</p>
        </div>

        {/* ── Metadata row ── */}
        <div
          aria-hidden="true"
          className="w-full border-t border-white/[0.04] mt-3 pt-3 flex items-center justify-between flex-wrap gap-3 sm:gap-0 select-none"
        >
          <span className="font-mono text-[10px] text-white/[0.18] tracking-[0.04em]">
            node: <span className="text-white/30">edge-01</span>
          </span>
          <span className="font-mono text-[10px] text-white/[0.18] tracking-[0.04em]">
            session: <span className="text-white/30">{sessionId ?? '------'}</span>
          </span>
          <span className="font-mono text-[10px] text-white/[0.18] tracking-[0.04em]">
            render: <span className="text-white/30">{renderTime !== null ? `${renderTime}ms` : '---'}</span>
          </span>
          <span className="font-mono text-[10px] text-white/[0.18] tracking-[0.04em]">
            loc: <span className="text-white/30">IN</span>
          </span>
        </div>

      </div>
    </footer>
  )
}
