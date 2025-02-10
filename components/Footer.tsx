import { GitBranch } from 'lucide-react'
import { DISPLAY_VERSION } from '@/lib/version'

export function Footer() {
  return (
    <footer className="w-full">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 md:px-12 pt-4 pb-6 sm:py-8 flex items-center justify-between">

        <p className="text-sm text-foreground/80">© 2025 Sidakpreet Singh</p>

        {/* ── Git detail — remove this entire block to revert to minimal footer ── */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-foreground/80 select-none">
          <GitBranch className="w-3 h-3" />
          <span>main</span>
          <span className="text-foreground/15">·</span>
          <span className="text-green-500/40">✓</span>
        </div>
        {/* ── */}

        <p className="text-sm font-medium text-foreground/80">{DISPLAY_VERSION}</p>

      </div>
    </footer>
  )
}