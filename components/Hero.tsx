'use client'

import {useEffect, useRef, useState} from 'react'
import {motion, useMotionTemplate, useMotionValue, useTransform} from 'framer-motion'
import {WindowsTerminal} from '@/components/ui/WindowsTerminal'

interface HeroData {
  name: string
  tagline: string
  bio: string
}

const FALLBACK_HERO: HeroData = {
  name: 'Sidakpreet Singh',
  tagline: 'Building practical products with code, grit, clarity and AI.',
  bio: 'Welcome to my portfolio! Hope you find something interesting to read, or maybe we can build something together!',
}

type HeroProps = {
  data: HeroData | null
  resumeUrl?: string
}

export function Hero({data, resumeUrl}: HeroProps) {
  const hero = data ?? FALLBACK_HERO

  const [scrollY, setScrollY] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    const onResize = () => setViewportHeight(window.innerHeight)

    setScrollY(window.scrollY)
    setViewportHeight(window.innerHeight)

    window.addEventListener('scroll', onScroll, {passive: true})
    window.addEventListener('resize', onResize, {passive: true})

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const scrollThreshold = viewportHeight * 0.5
  const scrollIndicatorOpacity =
    viewportHeight === 0 || scrollY <= scrollThreshold
      ? 1
      : Math.max(0, 1 - (scrollY - scrollThreshold) / 150)

  // ── Mouse parallax ────────────────────────────────────────────────────────
  // rawX/rawY are normalised 0–1 across the section; default 0.5 keeps the
  // gradient exactly at its original origin (18%, 24%) until the mouse moves.
  const sectionRef = useRef<HTMLElement>(null)
  const rawX       = useMotionValue(0.5)
  const rawY       = useMotionValue(0.5)

  // Map the full mouse travel to a ±6% nudge from the base origin
  const gx = useTransform(rawX, [0, 1], [12, 24]) // 18% ± 6%
  const gy = useTransform(rawY, [0, 1], [18, 30]) // 24% ± 6%

  const gradientBg = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(78,168,248,0.16), transparent 26rem)`

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const onMouseMove = (e: MouseEvent) => {
      const {left, top, width, height} = section.getBoundingClientRect()
      rawX.set((e.clientX - left) / width)
      rawY.set((e.clientY - top) / height)
    }

    section.addEventListener('mousemove', onMouseMove)
    return () => section.removeEventListener('mousemove', onMouseMove)
  }, [rawX, rawY])

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen overflow-hidden px-6 pt-10 pb-40 sm:px-8 md:px-12 md:pt-8 md:pb-20"
    >
      {/* Parallax gradient — origin tracks mouse ±6% from base (18%, 24%) */}
      <motion.div className="absolute inset-0" style={{background: gradientBg}} />

      <div className="relative mx-auto flex min-h-[calc(100vh-12rem)] max-w-6xl items-center">
        <motion.div
          initial={{opacity: 0, y: 24}}
          animate={{opacity: 1, y: 0}}
          transition={{type: 'tween', ease: 'easeOut', duration: 0.6}}
          className="w-full border-l-0 pl-0 md:border-l md:border-accent/30 md:pl-10"
        >
          <WindowsTerminal
            name={hero.name}
            tagline={hero.tagline}
            bio={hero.bio}
            resumeUrl={resumeUrl}
          />
        </motion.div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        style={{
          opacity: scrollIndicatorOpacity,
          transition: 'opacity 0.2s ease-out',
          pointerEvents: 'none',
        }}
      >
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{delay: 0.8, type: 'tween', ease: 'easeOut', duration: 0.6}}
          className="flex flex-col items-center gap-3 text-xs font-medium uppercase tracking-[0.35em] text-accent"
        >
          <motion.span
            animate={{opacity: [0.35, 1, 0.35]}}
            transition={{duration: 1.8, repeat: Infinity, ease: 'easeInOut'}}
          >
            Scroll
          </motion.span>
          <motion.span
            initial={{scaleY: 0}}
            animate={{scaleY: [0.35, 1, 0.35]}}
            transition={{duration: 1.8, repeat: Infinity, ease: 'easeInOut'}}
            className="h-12 w-px origin-top bg-accent/70"
          />
        </motion.div>
      </div>
    </section>
  )
}
