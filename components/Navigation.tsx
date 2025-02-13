'use client'

import {motion, useMotionValueEvent, useScroll, useTransform} from 'framer-motion'
import {useEffect, useRef, useState} from 'react'
import {
  BarChart,
  Briefcase,
  GraduationCap,
  Mail,
  Sparkles,
  Terminal,
  Trophy,
} from 'lucide-react'

const navigationItems = [
  {label: 'Experience', href: '#experience',  icon: Briefcase},
  {label: 'Skills',     href: '#skills',       icon: Sparkles},
  {label: 'Metrics',    href: '#metrics',      icon: BarChart},
  {label: 'Awards',     href: '#achievements', icon: Trophy},
  {label: 'Education',  href: '#education',    icon: GraduationCap},
  {label: 'Contact',    href: '#contact',      icon: Mail},
]

const OBSERVED_SECTIONS = [
  'home',
  'experience',
  'skills',
  'metrics',
  'achievements',
  'education',
  'contact',
]

// ── Props ─────────────────────────────────────────────────────────────────────

interface NavigationProps {
  onOpenPalette? : () => void
  isPaletteOpen? : boolean
}

export function Navigation({ onOpenPalette, isPaletteOpen: _isPaletteOpen }: NavigationProps) {
  const {scrollY, scrollYProgress} = useScroll()
  const [heroExit, setHeroExit] = useState(720)
  const [activeSection, setActiveSection] = useState<string>('home')
  const [mobileNavHidden, setMobileNavHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const updateHeroExit = () => setHeroExit(window.innerHeight * 0.82)
    updateHeroExit()
    window.addEventListener('resize', updateHeroExit)
    return () => window.removeEventListener('resize', updateHeroExit)
  }, [])

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const direction = latest > lastScrollY.current ? 'down' : 'up'
    const delta = Math.abs(latest - lastScrollY.current)
    if (latest > 80) {
      if (delta > 10) setMobileNavHidden(direction === 'down')
    } else {
      setMobileNavHidden(false)
    }
    lastScrollY.current = latest
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      {rootMargin: '-20% 0px -60% 0px'},
    )
    OBSERVED_SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const desktopNavOpacity    = useTransform(scrollY, [heroExit - 40, heroExit + 120], [0, 1])
  const desktopNavX          = useTransform(scrollY, [heroExit - 40, heroExit + 120], [-32, 0])
  const desktopNavVisibility = useTransform(scrollY, (y) => (y >= heroExit - 40 ? 'visible' : 'hidden'))
  const mobileNavOpacity     = useTransform(scrollY, [heroExit - 40, heroExit + 120], [0, 1])
  const mobileNavVisibility  = useTransform(scrollY, (y) => (y >= heroExit - 40 ? 'visible' : 'hidden'))

  const isOnHome = activeSection === 'home'

  return (
    <>
      {/* ── Scroll progress bar ── */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left pointer-events-none"
        style={{
          scaleX: scrollYProgress,
          background: 'linear-gradient(to right, #4fc7ef, #f97316)',
        }}
      />

      {/* ── Desktop wordmark + Ctrl+K badge ── */}
      <motion.div
        initial={{y: -20, opacity: 0}}
        animate={!isOnHome ? {y: 0, opacity: 1} : {y: -20, opacity: 0}}
        transition={{type: 'tween', ease: 'easeOut', duration: 0.4}}
        className="fixed top-7 left-9 z-50 hidden md:flex items-center gap-3"
      >
        <a
          href="#home"
          aria-label="Go to top"
          className="group whitespace-nowrap font-mono text-base font-semibold tracking-tight"
        >
          <span className="text-foreground transition-colors duration-200 ease-out group-hover:text-foreground/75">
            C:\
          </span>
          <span className="text-orange-500">&gt;</span>
          <span className="text-foreground transition-colors duration-200 ease-out group-hover:text-foreground/75">
            {' '}cd \
          </span>
        </a>

        {/* Ctrl+K hint badge */}
        <button
          onClick={onOpenPalette}
          aria-label="Open command palette"
          className="select-none font-mono text-[10px] border border-white/[0.10] px-2 py-1 leading-none text-foreground/30 transition-colors duration-200 hover:border-accent/35 hover:text-accent/60"
        >
          Ctrl+K
        </button>
      </motion.div>

      {/* ── Mobile bottom nav ── */}
      <motion.nav
        style={{opacity: mobileNavOpacity, visibility: mobileNavVisibility}}
        animate={{y: mobileNavHidden ? '100%' : '0%'}}
        transition={{type: 'tween', ease: 'easeOut', duration: 0.28}}
        className="fixed inset-x-0 bottom-0 z-50 md:hidden bg-[#07070F]/80 backdrop-blur-md border-t border-white/10"
      >
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-evenly px-4">
          {navigationItems.map(({label, href, icon: Icon}) => {
            const isActive = activeSection === href.slice(1)
            return (
              <a
                key={label}
                href={href}
                className="group flex flex-1 min-w-0 flex-col items-center justify-center gap-1 py-1 text-[10px] font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/70"
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center border transition-[color,background-color,border-color,box-shadow] duration-200 ease-out ${
                    isActive
                      ? 'border-purple-500/30 bg-purple-500/10 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                      : 'border-white/20 bg-background/35 text-white/75 group-hover:border-purple-500/30 group-hover:bg-purple-500/10 group-hover:text-purple-400 group-hover:shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
                <span
                  className={`block w-full truncate text-center transition-colors duration-200 ease-out ${
                    isActive ? 'text-purple-400' : 'text-white/75 group-hover:text-purple-400'
                  }`}
                >
                  {label}
                </span>
              </a>
            )
          })}

          {/* ── Command palette trigger (7th item) ── */}
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Open command palette (Ctrl+K)"
            className="group flex flex-1 min-w-0 flex-col items-center justify-center gap-1 py-1 text-[10px] font-medium focus:outline-none focus:ring-2 focus:ring-accent/70"
          >
            <span className="flex h-9 w-9 items-center justify-center border border-accent/20 bg-accent/[0.06] text-accent/55 transition-[color,background-color,border-color,box-shadow] duration-200 ease-out group-hover:border-accent/40 group-hover:bg-accent/[0.12] group-hover:text-accent group-hover:shadow-[0_0_12px_rgba(79,199,239,0.2)]">
              <Terminal className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
            <span className="block w-full truncate text-center text-accent/55 transition-colors duration-200 ease-out group-hover:text-accent">
              Ctrl+K
            </span>
          </button>
        </div>
      </motion.nav>

      {/* ── Desktop side rail ── */}
      <motion.nav
        style={{
          opacity: desktopNavOpacity,
          x: desktopNavX,
          visibility: desktopNavVisibility,
          backgroundColor: 'transparent',
        }}
        className="pointer-events-none fixed left-0 top-0 h-full w-28 z-40 hidden md:flex md:flex-col md:items-center"
      >
        <div className="pointer-events-auto flex flex-1 flex-col items-center justify-center py-6">
          <div className="relative flex flex-col items-center gap-6">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-white/10 -z-10"
            />
            {navigationItems.map(({label, href, icon: Icon}) => {
              const isActive = activeSection === href.slice(1)
              return (
                <a
                  key={label}
                  href={href}
                  className="relative z-10 group flex w-20 min-w-0 flex-col items-center gap-2 px-3 py-2 text-[11px] font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/70 bg-[#07070F]"
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center border transition-[color,background-color,border-color,box-shadow] duration-200 ease-out ${
                      isActive
                        ? 'border-purple-500/30 bg-purple-500/10 text-purple-400 shadow-[0_0_16px_rgba(168,85,247,0.25)]'
                        : 'border-white/20 bg-background/35 text-white/75 group-hover:border-purple-500/30 group-hover:bg-purple-500/10 group-hover:text-purple-400 group-hover:shadow-[0_0_16px_rgba(168,85,247,0.25)]'
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <span
                    className={`block w-full truncate text-center transition-colors duration-200 ease-out ${
                      isActive ? 'text-purple-400' : 'text-white/75 group-hover:text-purple-400'
                    }`}
                  >
                    {label}
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      </motion.nav>
    </>
  )
}