'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, MotionConfig } from 'framer-motion'
import type { ReactNode }  from 'react'
import { Navigation }      from '@/components/Navigation'
import { CommandPalette }  from '@/components/CommandPalette'
import { BootSequence }    from '@/components/BootSequence'
import { BootProvider }    from '@/components/BootContext'
import { PaletteProvider } from '@/components/PaletteContext'
import { usePathname }     from 'next/navigation'

interface LayoutShellProps {
  children   : ReactNode
  resumeUrl? : string
}

type BootPhase = 'pending' | 'show' | 'done'

export function LayoutShell({ children, resumeUrl }: LayoutShellProps) {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)
  const [paletteQuery,  setPaletteQuery]  = useState('')
  const [bootPhase,     setBootPhase]     = useState<BootPhase>('pending')
  
  const pathname = usePathname()
  const isStudio = pathname?.startsWith('/studio')

  useEffect(() => {
    // Escape hatch for the Sanity Studio
    if (isStudio) {
      setBootPhase('done')
      return
    }
    setBootPhase('show')
  }, [isStudio])

  const handleBootComplete = useCallback(() => {
    setBootPhase('done')
  }, [])

  // ── Palette handlers ──────────────────────────────────────────────────────
  const openPalette  = useCallback((initialQuery = '') => {
    // Guard: callers wired as onClick={openPalette} pass a click event, not a
    // string — coerce anything non-string back to the blank idle prompt
    setPaletteQuery(typeof initialQuery === 'string' ? initialQuery : '')
    setIsPaletteOpen(true)
  }, [])
  const closePalette = useCallback(() => setIsPaletteOpen(false), [])

  // Stable context value so terminal/hero triggers can open the palette from
  // deep in the page tree without re-rendering consumers on every toggle
  const paletteContextValue = useMemo(() => ({ openPalette }), [openPalette])

  useEffect(() => {
    // Disable command palette shortcuts while in Studio
    if (isStudio) return 
    
    const handler = (e: KeyboardEvent) => {
      // Ctrl+K only — !metaKey explicitly excludes any Cmd binding
      if (e.ctrlKey && !e.metaKey && e.key === 'k') {
        e.preventDefault()
        // Don't let the palette open behind the boot overlay — it would render
        // under the boot screen and leave the scroll lock in an ambiguous state.
        if (bootPhase !== 'done') return
        setPaletteQuery('') // shortcut opens the blank idle prompt
        setIsPaletteOpen((prev) => !prev)
        return
      }
      if (e.key === 'Escape') {
        setIsPaletteOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isStudio, bootPhase])

  // ── Body scroll lock ──────────────────────────────────────────────────────
  // Single owner for `body.overflow`: the boot overlay and the palette both want
  // to lock scroll, so deriving one boolean (instead of two effects that each
  // save/restore) avoids the case where one effect's cleanup restored a stale
  // value the other still needed, permanently locking the page.
  useEffect(() => {
    if (isStudio) return
    const shouldLock =
      isPaletteOpen || bootPhase === 'pending' || bootPhase === 'show'
    if (!shouldLock) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isPaletteOpen, bootPhase, isStudio])

  // ── Derived flags ─────────────────────────────────────────────────────────
  const bootBlocking = !isStudio && bootPhase !== 'done'

  // React 18 drops boolean `inert`; the empty-string form actually reaches the DOM
  const mainInert = (isPaletteOpen || bootBlocking) ? ('' as unknown as true) : undefined

  return (
    // reducedMotion="user" makes every descendant motion component honour the OS
    // "reduce motion" setting — disabling transform/layout entrances (Skills,
    // Writing, Education, ScrollReveal, etc.) globally instead of per-component.
    <MotionConfig reducedMotion="user">
      {/* Keyboard skip link — first focusable element; jumps past the nav to content */}
      {!isStudio && (
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[400] focus-visible:rounded-md focus-visible:border focus-visible:border-accent/40 focus-visible:bg-surface focus-visible:px-4 focus-visible:py-2 focus-visible:font-mono focus-visible:text-sm focus-visible:text-accent focus-visible:shadow-panel"
        >
          Skip to content
        </a>
      )}

      {/* Static cover — shown only during the pending check to block the page */}
      {bootPhase === 'pending' && !isStudio && (
        <div
          aria-hidden="true"
          style={{
            position     : 'fixed',
            inset        : 0,
            zIndex       : 200,
            background   : '#050505',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Full animated boot sequence — first visit only */}
      {bootPhase === 'show' && !isStudio && (
        <BootSequence onComplete={handleBootComplete} />
      )}

      {/* Exclude Navigation from Studio */}
      {!isStudio && (
        <Navigation onOpenPalette={openPalette} isPaletteOpen={isPaletteOpen} />
      )}

      <motion.main
        aria-hidden={(isPaletteOpen || bootBlocking) || undefined}
        inert={mainInert}
        initial={{ scale: 1, filter: 'blur(0px)' }}
        animate={
          isPaletteOpen && !isStudio
            ? { scale: 0.98, filter: 'blur(4px)' }
            : { scale: 1,    filter: 'blur(0px)' }
        }
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
        className="min-h-screen pb-3 md:pb-4"
        style={{
          transformOrigin : '50% 30%',
          pointerEvents   : isPaletteOpen ? 'none' : 'auto',
        }}
      >
        <PaletteProvider value={paletteContextValue}>
          <BootProvider value={bootPhase === 'done' || !!isStudio}>
            {children}
          </BootProvider>
        </PaletteProvider>
      </motion.main>

      {/* Exclude Command Palette from Studio */}
      {!isStudio && (
        <CommandPalette
          isOpen       = {isPaletteOpen}
          onClose      = {closePalette}
          resumeUrl    = {resumeUrl}
          initialQuery = {paletteQuery}
        />
      )}
    </MotionConfig>
  )
}