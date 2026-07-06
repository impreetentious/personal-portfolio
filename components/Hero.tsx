'use client'

import { useEffect, useRef } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { WindowsTerminal } from '@/components/ui/WindowsTerminal'
import { useBootComplete } from '@/components/BootContext'
import { FALLBACK_HERO } from '@/lib/identity'
import type { HeroData } from '@/lib/queries'

type HeroProps = {
  data: HeroData | null
  resumeUrl?: string
}

export function Hero({ data, resumeUrl }: HeroProps) {
  const hero = data ?? FALLBACK_HERO
  const bootComplete = useBootComplete()
  const prefersReduced = useReducedMotion()

  // ── Mouse parallax ────────────────────────────────────────────────────────
  const sectionRef = useRef<HTMLElement>(null)
  const rawX = useMotionValue(0.5)
  const rawY = useMotionValue(0.5)

  const { scrollY } = useScroll()
  const scrollIndicatorOpacity = useTransform(scrollY, (y) => {
    const threshold = typeof window !== 'undefined' ? window.innerHeight * 0.5 : 400
    return y <= threshold ? 1 : Math.max(0, 1 - (y - threshold) / 150)
  })

  // Map the full mouse travel to a ±6% nudge from the base origin
  const gx = useTransform(rawX, [0, 1], [12, 24]) // 18% ± 6%
  const gy = useTransform(rawY, [0, 1], [18, 30]) // 24% ± 6%

  const gradientBg = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(78,168,248,0.16), transparent 26rem)`

  useEffect(() => {
    // Skip the ambient parallax entirely for users who prefer reduced motion.
    if (prefersReduced) return
    const section = sectionRef.current
    if (!section) return

    let rafId: number | null = null
    const onMouseMove = (e: MouseEvent) => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect()
        rawX.set((e.clientX - rect.left) / rect.width)
        rawY.set((e.clientY - rect.top) / rect.height)
        rafId = null
      })
    }

    section.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => {
      section.removeEventListener('mousemove', onMouseMove)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [rawX, rawY, prefersReduced])

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-label="Introduction"
      className="relative min-h-screen overflow-hidden px-6 pt-10 pb-40 sm:px-8 md:px-12 md:pt-8 md:pb-20"
    >
      {/* Parallax gradient — origin tracks mouse ±6% from base (18%, 24%) */}
      <motion.div className="absolute inset-0" style={{ background: gradientBg }} />

      <div className="relative mx-auto flex min-h-[calc(100vh-12rem)] max-w-6xl items-center">
        <div className="w-full border-l-0 pl-0 md:border-l md:border-accent/30 md:pl-10">
          <WindowsTerminal
            key={hero.bio}
            name={hero.name}
            tagline={hero.tagline}
            bio={hero.bio}
            resumeUrl={resumeUrl}
            profileFields={hero.profileFields}
            terminalSkills={hero.terminalSkills}
            startTyping={bootComplete}
          />
        </div>
      </div>

      <motion.div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        style={{
          opacity: scrollIndicatorOpacity,
          pointerEvents: 'none',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, type: 'tween', ease: 'easeOut', duration: 0.6 }}
          className="flex flex-col items-center gap-3 text-xs font-medium uppercase tracking-[0.35em] text-accent"
        >
          <motion.span
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            Scroll
          </motion.span>
          <motion.span
            initial={{ scaleY: 0 }}
            animate={{ scaleY: [0.35, 1, 0.35] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="h-12 w-px origin-top bg-accent/70"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
