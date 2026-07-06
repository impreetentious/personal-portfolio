'use client'

import { GitBranch } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 md:px-12 pt-4 pb-6 sm:py-8">
        {/* ── Main row ── */}
        <div className="flex items-center justify-between">
          <p className="font-mono hidden sm:block text-[11px] text-foreground/70">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Sidakpreet Singh
          </p>

          <p className="font-mono sm:hidden text-[11px] text-foreground/70">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span>
          </p>

          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-foreground/70 select-none">
            <GitBranch className="w-3 h-3" />
            <span>main</span>
            <span className="text-foreground/70">·</span>
            <span className="text-green-500/90">✓</span>
          </div>

          <p className="text-[11px] italic text-foreground/70">Built with curiosity and coffee.</p>
        </div>
      </div>
    </footer>
  )
}
