'use client'

import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import {
  BarChart,
  Briefcase,
  GraduationCap,
  Mail,
  Sparkles,
  Terminal,
  Trophy,
  BookOpen,
} from 'lucide-react'

import { siteConfig } from '@/lib/config'
import { Magnetic } from '@/components/ui/Magnetic'


const NAV_SECTIONS = [ 
  { id: 'experience',   label: 'Experience', icon: Briefcase     },
  { id: 'skills',       label: 'Skills',     icon: Sparkles      },
  { id: 'metrics',      label: 'Metrics',    icon: BarChart      },
  { id: 'achievements', label: 'Awards',     icon: Trophy        },
  { id: 'education',    label: 'Education',  icon: GraduationCap },
  ...(siteConfig.features.showWriting
    ? [{ id: 'writing', label: 'Writing', icon: BookOpen }]
    : []),
  { id: 'contact',      label: 'Contact',    icon: Mail          },
]

const navigationItems = NAV_SECTIONS.map(s => ({ label: s.label, href: `#${s.id}`, icon: s.icon })) 
const OBSERVED_SECTIONS = ['home', ...NAV_SECTIONS.map(s => s.id)]

// ── Props ─────────────────────────────────────────────────────────────────────

interface NavigationProps {
  onOpenPalette?: () => void
  isPaletteOpen?: boolean
}

export function Navigation({ onOpenPalette, isPaletteOpen = false }: NavigationProps) {
  const { scrollY, scrollYProgress } = useScroll()
  const [heroExit, setHeroExit] = useState(720)
  const heroExitRef = useRef(heroExit)
  const [activeSection, setActiveSection] = useState<string>('home')
  const [hasPassedHero, setHasPassedHero] = useState(false)
  const [mobileNavHidden, setMobileNavHidden] = useState(false)
  const lastScrollY = useRef(0)
  const directionRef = useRef<'up' | 'down' | null>(null)

  useEffect(() => {
    const updateHeroExit = () => setHeroExit(window.innerHeight * 0.82)
    updateHeroExit()

    let debounceId: ReturnType<typeof setTimeout> | null = null
    const handleResize = () => {
      if (debounceId) clearTimeout(debounceId)
      debounceId = setTimeout(updateHeroExit, 150)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (debounceId) clearTimeout(debounceId)
    }
  }, [])

  // Sync heroExitRef so the motion value event handler never captures stale state
  useEffect(() => { heroExitRef.current = heroExit }, [heroExit])

  // ── Mobile Hide-on-Scroll Logic (gated to nav-visible zone) ──
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const direction = latest > lastScrollY.current ? 'down' : 'up'
    const delta     = Math.abs(latest - lastScrollY.current)
    const threshold = heroExitRef.current
    setHasPassedHero(latest >= threshold - 24)

    if (latest < threshold) {
      // Still above the nav-visible zone — always reset hidden state
      setMobileNavHidden(false)
      directionRef.current = null
    } else if (delta > 10 && direction !== directionRef.current) {
      setMobileNavHidden(direction === 'down')
      directionRef.current = direction
    }

    lastScrollY.current = latest
  })

  // ── Intersection Observer for Active Section ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-20% 0px -60% 0px' },
    )
    
    OBSERVED_SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    
    return () => observer.disconnect()
  }, [])

  // Mobile nav retains continuous scroll transform for fluid entry
  const mobileNavOpacity    = useTransform(scrollY, [heroExit - 40, heroExit + 120], [0, 1])
  const mobileNavVisibility = useTransform(scrollY, (y) => (y >= heroExit - 40 ? 'visible' : 'hidden'))

  const isOnHome = !hasPassedHero

  return (
    <div
      aria-hidden={isPaletteOpen || undefined}
      // React 18 drops boolean `inert`; the empty-string form actually reaches the DOM
      inert={isPaletteOpen ? ('' as unknown as true) : undefined}
    >

      {/* ── Scroll progress bar ── */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left pointer-events-none"
        style={{
          scaleX    : scrollYProgress,
          background: 'linear-gradient(to right, #38BDF8, #f97316)',
        }}
      />

      {/* ── Desktop wordmark (Top Left) ── */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={!isOnHome ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
        transition={{ type: 'tween', ease: 'easeOut', duration: isOnHome ? 0.18 : 0.38 }}
        className="fixed top-7 left-9 z-50 hidden md:flex items-center gap-3"
      >
        <a
          href="#home"
          aria-label="Go to top"
          className="group whitespace-nowrap font-mono text-base font-semibold tracking-tight"
        >
          <span className="text-orange-500 transition-colors duration-200 ease-out group-hover:text-orange-400">
            cd
          </span>
          <span className="text-foreground transition-colors duration-200 ease-out group-hover:text-foreground/75">
            {' '}~
          </span>
        </a>
      </motion.div>

      {/* ── Desktop Command Trigger (Bottom Left) ── */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={!isOnHome ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
        transition={{ type: 'tween', ease: 'easeOut', duration: isOnHome ? 0.18 : 0.38 }}
        className="fixed bottom-7 left-9 z-50 hidden md:flex"
      >
        <Magnetic>
        <button
          onClick={() => onOpenPalette?.()}
          aria-label="Open command palette (Ctrl+K)"
          className="group flex items-center gap-2.5 border border-white/10 bg-[#050505]/80 px-3 py-2 backdrop-blur-md transition-all duration-200 ease-out hover:border-accent/30 hover:bg-accent/10"
        >
          <Terminal className="h-4 w-4 text-foreground/50 transition-colors group-hover:text-accent" strokeWidth={2} />
          <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 transition-colors group-hover:text-accent">
            Cmd
          </span>
          <span className="ml-1 rounded-sm border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-foreground/40 transition-colors group-hover:border-accent/20 group-hover:text-accent/80">
            Ctrl+K
          </span>
        </button>
        </Magnetic>
      </motion.div>

      {/* ── Mobile bottom nav ── */}
      <motion.nav
        style={{ opacity: mobileNavOpacity, visibility: mobileNavVisibility }}
        initial={{ y: '0%' }}
        animate={{ y: mobileNavHidden ? '100%' : '0%' }}
        transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
        className="fixed inset-x-0 bottom-0 z-50 md:hidden bg-[#050505]/80 backdrop-blur-md border-t border-white/10"
      >
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-evenly px-2 sm:px-4">
          {navigationItems.map(({ label, href, icon: Icon }) => {
            const isActive = activeSection === href.slice(1)
            return (
              <a
                key={label}
                href={href}
                className="group flex flex-1 min-w-0 flex-col items-center justify-center gap-1 py-1 text-[9px] sm:text-[10px] font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                <span
                  className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center border transition-[color,background-color,border-color,box-shadow] duration-200 ease-out ${
                    isActive
                      ? 'border-accent/40 bg-accent/[0.14] text-accent shadow-[0_0_0_1px_rgba(56,189,248,0.18),0_0_16px_rgba(56,189,248,0.45)]'
                      : 'border-white/20 bg-background/35 text-white/75 group-hover:border-accent/40 group-hover:bg-accent/[0.14] group-hover:text-accent group-hover:shadow-[0_0_0_1px_rgba(56,189,248,0.18),0_0_16px_rgba(56,189,248,0.45)]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
                <span
                  className={`block w-full truncate text-center transition-colors duration-200 ease-out ${
                    isActive ? 'text-accent' : 'text-white/75 group-hover:text-accent'
                  }`}
                >
                  {label}
                </span>
              </a>
            )
          })}
        </div>
      </motion.nav>

      {/* ── Desktop side rail ── */}
      <motion.nav
        initial={{ opacity: 0, x: -32, visibility: 'hidden' }}
        animate={!isOnHome ? { opacity: 1, x: 0, visibility: 'visible' } : { opacity: 0, x: -32, visibility: 'hidden' }}
        transition={{ type: 'tween', ease: 'easeOut', duration: isOnHome ? 0.18 : 0.38 }}
        className="pointer-events-none fixed left-0 top-0 h-full w-32 z-40 hidden md:flex md:flex-col md:items-center bg-transparent"
      >
        <div className="pointer-events-auto flex flex-1 flex-col items-center justify-center py-6">
          <div className="relative flex flex-col items-center gap-6">
            {navigationItems.map(({ label, href, icon: Icon }) => {
              const isActive = activeSection === href.slice(1)
              return (
                <a
                  key={label}
                  href={href}
                  className="relative z-10 group flex w-24 min-w-0 flex-col items-center gap-2 px-3 py-2 text-[11px] font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                >
                  {/* Left hook — slides out from left on hover/active, fades in sync with other states */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute left-0 top-[30px] h-px w-5 bg-accent origin-left transition-[opacity,transform] duration-200 ease-out ${
                      isActive
                        ? 'opacity-70 scale-x-100'
                        : 'opacity-0 scale-x-50 group-hover:opacity-35 group-hover:scale-x-100'
                    }`}
                  />
                  {/* I5: Desktop rail icon badge — dual-layer shadow, bumped bg/border */}
                  <span
                    className={`flex h-11 w-11 items-center justify-center border transition-[color,background-color,border-color,box-shadow] duration-200 ease-out ${
                      isActive
                        ? 'border-accent/40 bg-accent/[0.14] text-accent shadow-[0_0_0_1px_rgba(56,189,248,0.20),0_0_22px_rgba(56,189,248,0.50)]'
                        : 'border-white/20 bg-background/35 text-white/75 group-hover:border-accent/40 group-hover:bg-accent/[0.14] group-hover:text-accent group-hover:shadow-[0_0_0_1px_rgba(56,189,248,0.14),0_0_18px_rgba(56,189,248,0.38)]'
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <span
                    className={`block w-full truncate text-center transition-colors duration-200 ease-out ${
                      isActive ? 'text-accent' : 'text-white/75 group-hover:text-accent'
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

    </div>
  )
}
