'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion }         from 'framer-motion'
import type { ReactNode } from 'react'
import { Navigation }     from '@/components/Navigation'
import { CommandPalette } from '@/components/CommandPalette'
import { BootSequence }   from '@/components/BootSequence'
import { BootProvider }   from '@/components/BootContext'
import { usePathname }    from 'next/navigation'

interface LayoutShellProps {
  children   : ReactNode
  resumeUrl? : string
}

type BootPhase = 'pending' | 'show' | 'done'

export function LayoutShell({ children, resumeUrl }: LayoutShellProps) {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)
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
  const openPalette  = useCallback(() => setIsPaletteOpen(true),  [])
  const closePalette = useCallback(() => setIsPaletteOpen(false), [])

  useEffect(() => {
    // Disable command palette shortcuts while in Studio
    if (isStudio) return 
    
    const handler = (e: KeyboardEvent) => {
      // Ctrl+K only — !metaKey explicitly excludes any Cmd binding
      if (e.ctrlKey && !e.metaKey && e.key === 'k') {
        e.preventDefault()
        setIsPaletteOpen((prev) => !prev)
        return
      }
      if (e.key === 'Escape') {
        setIsPaletteOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isStudio])

  useEffect(() => {
    if (!isPaletteOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isPaletteOpen])

  // ── Body scroll lock during boot phases ───────────────────────────────
  useEffect(() => {
    if (isStudio) return
    if (bootPhase === 'pending' || bootPhase === 'show') {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [bootPhase, isStudio])

  // ── Derived flags ─────────────────────────────────────────────────────────
  const bootBlocking = !isStudio && bootPhase !== 'done'

  // React 18 drops boolean `inert`; the empty-string form actually reaches the DOM
  const mainInert = (isPaletteOpen || bootBlocking) ? ('' as unknown as true) : undefined

  return (
    <>
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
        <BootProvider value={bootPhase === 'done' || !!isStudio}>
          {children}
        </BootProvider>
      </motion.main>

      {/* Exclude Command Palette from Studio */}
      {!isStudio && (
        <CommandPalette
          isOpen    = {isPaletteOpen}
          onClose   = {closePalette}
          resumeUrl = {resumeUrl}
        />
      )}
    </>
  )
}