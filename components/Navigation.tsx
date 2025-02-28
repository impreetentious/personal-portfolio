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

// ── Import the master config ──
import { siteConfig } from '@/lib/config'


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
  const [activeSection, setActiveSection] = useState<string>('home')
  const [mobileNavHidden, setMobileNavHidden] = useState(false)
  const lastScrollY = useRef(0)
  const directionRef = useRef<'up' | 'down' | null>(null)

  // ── Calculate Hero section height for entrance triggers ──
  useEffect(() => {
    const updateHeroExit = () => setHeroExit(window.innerHeight * 0.82)
    updateHeroExit()
    window.addEventListener('resize', updateHeroExit)
    return () => window.removeEventListener('resize', updateHeroExit)
  }, [])

  // ── Modern Mobile Hide-on-Scroll Logic ──
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const direction = latest > lastScrollY.current ? 'down' : 'up'
    const delta = Math.abs(latest - lastScrollY.current)
    // Only trigger hide/show if we've scrolled past the top 80px and movement is intentional (>10px)
    if (latest > 80 && delta > 10 && direction !== directionRef.current) { 
      setMobileNavHidden(direction === 'down')
    } else if (latest <= 80 && directionRef.current !== null) {
      setMobileNavHidden(false)
    }
    directionRef.current = latest > 80 ? direction : null
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
  const mobileNavOpacity     = useTransform(scrollY, [heroExit - 40, heroExit + 120], [0, 1])
  const mobileNavVisibility  = useTransform(scrollY, (y) => (y >= heroExit - 40 ? 'visible' : 'hidden'))

  const isOnHome = activeSection === 'home'

  // ── When the command palette is open, suppress the entire nav from the
  //    accessibility tree and prevent it from intercepting keyboard events.
  //    All children are position:fixed so the wrapper div has zero visual impact.
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      aria-hidden={isPaletteOpen || undefined}
      inert={isPaletteOpen || undefined}
    >

      {/* ── Scroll progress bar ── */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left pointer-events-none"
        style={{
          scaleX: scrollYProgress,
          background: 'linear-gradient(to right, #4fc7ef, #f97316)',
        }}
      />

      {/* ── Desktop wordmark (Top Left) ── */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={!isOnHome ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.4 }}
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
            {' '}/d c:\
          </span>
        </a>
      </motion.div>

      {/* ── Desktop Command Trigger (Bottom Left) ── */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={!isOnHome ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.4 }}
        className="fixed bottom-7 left-9 z-50 hidden md:flex"
      >
        <button
          onClick={onOpenPalette}
          aria-label="Open command palette (Ctrl+K)"
          className="group flex items-center gap-2.5 border border-white/10 bg-[#07070F]/80 px-3 py-2 backdrop-blur-md transition-all duration-200 ease-out hover:border-accent/30 hover:bg-accent/10"
        >
          <Terminal className="h-4 w-4 text-foreground/50 transition-colors group-hover:text-accent" strokeWidth={2} />
          <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 transition-colors group-hover:text-accent">
            Cmd
          </span>
          <span className="ml-1 rounded-sm border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-foreground/40 transition-colors group-hover:border-accent/20 group-hover:text-accent/80">
            Ctrl+K
          </span>
        </button>
      </motion.div>

      {/* ── Mobile bottom nav ── */}
      <motion.nav
        style={{ opacity: mobileNavOpacity, visibility: mobileNavVisibility }}
        animate={{ y: mobileNavHidden ? '100%' : '0%' }}
        transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
        className="fixed inset-x-0 bottom-0 z-50 md:hidden bg-[#07070F]/80 backdrop-blur-md border-t border-white/10"
      >
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-evenly px-2 sm:px-4">
          {navigationItems.map(({ label, href, icon: Icon }) => {
            const isActive = activeSection === href.slice(1)
            return (
              <a
                key={label}
                href={href}
                className="group flex flex-1 min-w-0 flex-col items-center justify-center gap-1 py-1 text-[9px] sm:text-[10px] font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/70"
              >
                <span
                  className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center border transition-[color,background-color,border-color,box-shadow] duration-200 ease-out ${
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
        </div>
      </motion.nav>

      {/* ── Desktop side rail ── */}
      <motion.nav
        initial={{ opacity: 0, x: -32, visibility: 'hidden' }}
        animate={!isOnHome ? { opacity: 1, x: 0, visibility: 'visible' } : { opacity: 0, x: -32, visibility: 'hidden' }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.4 }}
        className="pointer-events-none fixed left-0 top-0 h-full w-32 z-40 hidden md:flex md:flex-col md:items-center bg-transparent"
      >
        <div className="pointer-events-auto flex flex-1 flex-col items-center justify-center py-6">
          <div className="relative flex flex-col items-center gap-6">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-white/10 -z-10"
            />
            {navigationItems.map(({ label, href, icon: Icon }) => {
              const isActive = activeSection === href.slice(1)
              return (
                <a
                  key={label}
                  href={href}
                  className="relative z-10 group flex w-24 min-w-0 flex-col items-center gap-2 px-3 py-2 text-[11px] font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/70 bg-[#07070F]"
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

    </div>
  )
}
