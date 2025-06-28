'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion }         from 'framer-motion'
import type { ReactNode } from 'react'
import { Navigation }     from '@/components/Navigation'
import { CommandPalette } from '@/components/CommandPalette'
import { BootSequence }   from '@/components/BootSequence'
import { BootProvider }   from '@/components/BootContext'

interface LayoutShellProps {
  children   : ReactNode
  resumeUrl? : string
}
//
type BootPhase = 'pending' | 'show' | 'done'

export function LayoutShell({ children, resumeUrl }: LayoutShellProps) {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)
  const [bootPhase,     setBootPhase]     = useState<BootPhase>('pending')

  useEffect(() => {
    setBootPhase('show')
  }, [])

  const handleBootComplete = useCallback(() => {
    setBootPhase('done')
  }, [])

  // ── Palette handlers ──────────────────────────────────────────────────────
  const openPalette  = useCallback(() => setIsPaletteOpen(true),  [])
  const closePalette = useCallback(() => setIsPaletteOpen(false), [])

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    if (!isPaletteOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isPaletteOpen])

  // ── A3: Body scroll lock during boot phases ───────────────────────────────
  useEffect(() => {
    if (bootPhase === 'pending' || bootPhase === 'show') {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [bootPhase])

  // ── Derived flags ─────────────────────────────────────────────────────────
  // bootBlocking: true while the page should be inert (pending or playing)
  const bootBlocking = bootPhase !== 'done'

  return (
    <>
      {/* Static cover — shown only during the pending check to block the page */}
      {bootPhase === 'pending' && (
        <div
          aria-hidden="true"
          style={{
            position    : 'fixed',
            inset       : 0,
            zIndex      : 200,
            background  : '#050505',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Full animated boot sequence — first visit only */}
      {bootPhase === 'show' && (
        <BootSequence onComplete={handleBootComplete} />
      )}

      <Navigation onOpenPalette={openPalette} isPaletteOpen={isPaletteOpen} />

      <motion.main
        aria-hidden={(isPaletteOpen || bootBlocking) || undefined}
        inert={(isPaletteOpen || bootBlocking) || undefined}
        initial={{ scale: 1, filter: 'blur(0px)' }}
        animate={
          isPaletteOpen
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
        <BootProvider value={bootPhase === 'done'}>
          {children}
        </BootProvider>
      </motion.main>

      <CommandPalette
        isOpen    = {isPaletteOpen}
        onClose   = {closePalette}
        resumeUrl = {resumeUrl}
      />
    </>
  )
}
