'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion }         from 'framer-motion'
import type { ReactNode } from 'react'
import { Navigation }     from '@/components/Navigation'
import { CommandPalette } from '@/components/CommandPalette'

interface LayoutShellProps {
  children   : ReactNode
  resumeUrl? : string
}

export function LayoutShell({ children, resumeUrl }: LayoutShellProps) {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)

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

  return (
    <>
      <Navigation onOpenPalette={openPalette} isPaletteOpen={isPaletteOpen} />

      {/*
        When the palette opens, <main> scales to 0.98 and blurs to 4px.
        transformOrigin '50% 30%' creates a natural "zoom back" feel rather
        than collapsing toward the very top edge.
        pointerEvents is cut immediately (not animated) since it's binary.
      */}
      <motion.main
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
        {children}
      </motion.main>

      <CommandPalette
        isOpen    = {isPaletteOpen}
        onClose   = {closePalette}
        resumeUrl = {resumeUrl}
      />
    </>
  )
}