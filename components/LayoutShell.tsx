'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  animate,
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'
import type { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Navigation } from '@/components/Navigation'
import { CommandPalette } from '@/components/CommandPalette'
import { BootSequence } from '@/components/BootSequence'
import { SessionRestoredFlash } from '@/components/SessionRestoredFlash'
import { BootProvider } from '@/components/BootContext'
import { PaletteProvider } from '@/components/PaletteContext'
import { usePathname } from 'next/navigation'

interface LayoutShellProps {
  children: ReactNode
  resumeUrl?: string
}

// 'full'  → first visit in this browser tab session → play full boot sequence
// 'flash' → same-session repeat load → play brief "session restored" flash
type BootPhase = 'pending' | 'full' | 'flash' | 'done'

const SESSION_VISITED_KEY = 'sps-session-visited'

export function LayoutShell({ children, resumeUrl }: LayoutShellProps) {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)
  const [paletteQuery, setPaletteQuery] = useState('')
  const [bootPhase, setBootPhase] = useState<BootPhase>('pending')

  const pathname = usePathname()
  const isStudio = pathname?.startsWith('/studio')
  const isPortfolio = pathname === '/'

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!isPortfolio) {
        setBootPhase('done')
        return
      }
      // Same tab session → skip full boot for a brief flash. sessionStorage is
      // cleared when the tab closes, so a fresh tab still gets the full sequence.
      let hasVisited = false
      try {
        hasVisited = sessionStorage.getItem(SESSION_VISITED_KEY) === '1'
      } catch {
        // Private-mode Safari or blocked storage — fall through to full boot.
      }
      setBootPhase(hasVisited ? 'flash' : 'full')
    })
    return () => cancelAnimationFrame(frame)
  }, [isPortfolio])

  const handleBootComplete = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_VISITED_KEY, '1')
    } catch {
      // Ignore; the visitor still gets a full boot on next load, which is fine.
    }
    setBootPhase('done')
  }, [])

  // ── Palette handlers ──────────────────────────────────────────────────────
  const openPalette = useCallback((initialQuery = '') => {
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
    if (!isPortfolio) return

    const handler = (e: KeyboardEvent) => {
      // Ctrl+K on any OS, plus ⌘K on Mac. Visual hints in the UI still show
      // "Ctrl+K" stays visible to match the Windows/terminal theme;
      // the extra Cmd binding is a functional courtesy, not a visual one.
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
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
  }, [isPortfolio, bootPhase])

  // ── Body scroll lock ──────────────────────────────────────────────────────
  // One effect owns the body lock: the boot overlay and the palette both want
  // to lock scroll, so deriving one boolean (instead of two effects that each
  // save/restore) avoids the case where one effect's cleanup restored a stale
  // value the other still needed, permanently locking the page.
  // Uses the position:fixed pattern (not just overflow:hidden) because iOS
  // Safari ignores body overflow for touch scrolling; the saved scroll offset
  // is restored instantly on unlock so smooth-scroll CSS can't animate it.
  useEffect(() => {
    if (isStudio) return
    const shouldLock = isPaletteOpen || bootPhase !== 'done'
    if (!shouldLock) return
    const scrollY = window.scrollY
    const { style } = document.body
    style.position = 'fixed'
    style.top = `-${scrollY}px`
    style.left = '0'
    style.right = '0'
    style.overflow = 'hidden'
    return () => {
      style.position = ''
      style.top = ''
      style.left = ''
      style.right = ''
      style.overflow = ''
      window.scrollTo({ top: scrollY, left: 0, behavior: 'instant' })
    }
  }, [isPaletteOpen, bootPhase, isStudio])

  // ── Derived flags ─────────────────────────────────────────────────────────
  // Only the real boot overlays (`full` / `flash`) must inert the tree.
  // `pending` is the pre-effect check: without JS that effect never runs, so
  // treating pending as blocking would leave <main aria-hidden inert> forever
  // (noscript only hides the visual cover). Brief pre-hydration tab access is
  // an accepted trade for no-JS readability.
  const bootBlocking = isPortfolio && (bootPhase === 'full' || bootPhase === 'flash')

  // Use the empty-string form so `inert` is emitted as a native HTML attribute.
  const mainInert = isPaletteOpen || bootBlocking ? ('' as unknown as true) : undefined

  // Palette-open push-back: blur + scale <main> down. Scale rides framer's
  // declarative `animate` prop (scale:1 resolves to `transform: none` at rest,
  // harmless). `filter` is derived from a numeric driver via useTransform so the
  // resting value maps to the literal `none` — never a real filter function.
  // That matters because any filter (even `blur(0px)`) makes <main> a containing
  // block for the whole page, breaking `position: fixed` for descendants and
  // pinning it to its own compositor layer. Framer can't interpolate to/from
  // `none`, so we animate the blur *amount* (0↔4) and let the transform pick the
  // `none` cutoff — the map is the only place `none` is ever produced.
  const wantsBlur = isPaletteOpen && !isStudio
  const prefersReduced = useReducedMotion()
  const blurAmount = useMotionValue(0)
  const mainFilter = useTransform(blurAmount, (v) => (v < 0.05 ? 'none' : `blur(${v}px)`))
  const hasOpenedRef = useRef(false)

  useEffect(() => {
    if (wantsBlur) {
      hasOpenedRef.current = true
      if (prefersReduced) {
        blurAmount.set(4)
        return
      }
      const controls = animate(blurAmount, 4, { duration: 0.3, ease: 'easeOut' })
      return () => controls.stop()
    }
    // Closing. Skip on the very first mount (nothing was ever blurred) so the
    // page doesn't flash a phantom un-blur on first paint.
    if (!hasOpenedRef.current) return
    if (prefersReduced) {
      blurAmount.set(0)
      return
    }
    const controls = animate(blurAmount, 0, { duration: 0.3, ease: 'easeOut' })
    return () => controls.stop()
  }, [wantsBlur, prefersReduced, blurAmount])

  return (
    // reducedMotion="user" makes every descendant motion component honour the OS
    // "reduce motion" setting — disabling transform/layout entrances (Skills,
    // Writing, Education, ScrollReveal, etc.) globally instead of per-component.
    <MotionConfig reducedMotion="user">
      {/* Keyboard skip link — first focusable element; jumps past the nav to content */}
      {isPortfolio && (
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[400] focus-visible:rounded-md focus-visible:border focus-visible:border-accent/40 focus-visible:bg-surface focus-visible:px-4 focus-visible:py-2 focus-visible:font-mono focus-visible:text-sm focus-visible:text-accent focus-visible:shadow-panel"
        >
          Skip to content
        </a>
      )}

      {/* Without JS the boot effect never runs, so the SSR'd 'pending' cover
          would blanket the page forever — let no-JS visitors read the content. */}
      {isPortfolio && (
        <noscript>
          <style>{`[data-boot-cover]{display:none !important}`}</style>
        </noscript>
      )}

      {/* Static cover — shown only during the pending check to block the page */}
      {bootPhase === 'pending' && isPortfolio && (
        <div
          aria-hidden="true"
          data-boot-cover=""
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: '#050505',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Full animated boot sequence — first tab-session load only. Visitors
          can skip via the button, Esc, or Space (see BootSequence). */}
      {bootPhase === 'full' && isPortfolio && <BootSequence onComplete={handleBootComplete} />}

      {/* Session-restored micro-flash — same-tab repeat load. Very brief, not
          a blank skip; conveys "we picked up where you were" and auto-fades. */}
      {bootPhase === 'flash' && isPortfolio && (
        <SessionRestoredFlash onComplete={handleBootComplete} />
      )}

      {/* Exclude Navigation from Studio. Navigation lives outside <main>, so the
          boot overlay's inert on <main> never covers it — pass the boot state
          explicitly or its (invisible) controls stay Tab-reachable during boot. */}
      {isPortfolio && (
        <Navigation
          onOpenPalette={openPalette}
          isPaletteOpen={isPaletteOpen}
          isBootBlocking={bootBlocking}
        />
      )}

      <motion.main
        aria-hidden={isPaletteOpen || bootBlocking || undefined}
        inert={mainInert}
        initial={{ scale: 1 }}
        animate={{ scale: wantsBlur ? 0.98 : 1 }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
        className="min-h-screen pb-3 md:pb-4"
        style={{
          filter: mainFilter,
          transformOrigin: '50% 30%',
          pointerEvents: isPaletteOpen ? 'none' : 'auto',
        }}
      >
        <PaletteProvider value={paletteContextValue}>
          <BootProvider value={bootPhase === 'done' || !isPortfolio}>{children}</BootProvider>
        </PaletteProvider>
      </motion.main>

      {/* Exclude Command Palette from Studio */}
      {isPortfolio && (
        <CommandPalette
          isOpen={isPaletteOpen}
          onClose={closePalette}
          resumeUrl={resumeUrl}
          initialQuery={paletteQuery}
        />
      )}

      {/* Vercel Analytics + Speed Insights — public-site only. Studio authoring
          traffic is excluded from the visitor performance baseline. Both
          packages self-gate in development and beacon only on Vercel. */}
      {!isStudio && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
    </MotionConfig>
  )
}
