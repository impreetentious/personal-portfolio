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
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'skills', label: 'Skills', icon: Sparkles },
  { id: 'metrics', label: 'Metrics', icon: BarChart },
  { id: 'achievements', label: 'Awards', icon: Trophy },
  { id: 'education', label: 'Education', icon: GraduationCap },
  ...(siteConfig.features.showWriting ? [{ id: 'writing', label: 'Writing', icon: BookOpen }] : []),
  { id: 'contact', label: 'Contact', icon: Mail },
]

const navigationItems = NAV_SECTIONS.map((s) => ({
  label: s.label,
  href: `#${s.id}`,
  icon: s.icon,
}))
const OBSERVED_SECTIONS = ['home', ...NAV_SECTIONS.map((s) => s.id)]

// ── Props ─────────────────────────────────────────────────────────────────────

interface NavigationProps {
  onOpenPalette?: () => void
  isPaletteOpen?: boolean
  isBootBlocking?: boolean
}

export function Navigation({
  onOpenPalette,
  isPaletteOpen = false,
  isBootBlocking = false,
}: NavigationProps) {
  const { scrollY, scrollYProgress } = useScroll()
  const [heroExit, setHeroExit] = useState(720)
  const heroExitRef = useRef(heroExit)
  const [activeSection, setActiveSection] = useState<string>('home')
  const [availableSectionIds, setAvailableSectionIds] = useState<Set<string> | null>(null)
  const [hasPassedHero, setHasPassedHero] = useState(false)
  const [mobileNavHidden, setMobileNavHidden] = useState(false)
  const lastScrollY = useRef(0)
  const directionRef = useRef<'up' | 'down' | null>(null)
  // Mirror the last value handed to each setter so the scroll handler only calls
  // setState when the value actually flips, not on every frame.
  const hasPassedHeroRef = useRef(false)
  const mobileNavHiddenRef = useRef(false)
  // Gate hash-sync so a deep-link (including one pointing at a hidden section)
  // is preserved until the user actually scrolls — see the effect below.
  const hasScrolledRef = useRef(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const sectionIds = NAV_SECTIONS.map(({ id }) => id).filter((id) =>
        document.getElementById(id),
      )
      setAvailableSectionIds(new Set(sectionIds))
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const updateHeroExit = () => {
      setHeroExit(window.innerHeight * 0.82)
      if (window.innerWidth >= 768 && mobileNavHiddenRef.current) {
        mobileNavHiddenRef.current = false
        setMobileNavHidden(false)
      }
    }
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
  useEffect(() => {
    heroExitRef.current = heroExit
  }, [heroExit])

  // ── Mobile Hide-on-Scroll Logic (gated to nav-visible zone) ──
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const direction = latest > lastScrollY.current ? 'down' : 'up'
    const delta = Math.abs(latest - lastScrollY.current)
    const threshold = heroExitRef.current

    const passedHero = latest >= threshold - 24
    if (passedHero !== hasPassedHeroRef.current) {
      hasPassedHeroRef.current = passedHero
      setHasPassedHero(passedHero)
    }

    const setHidden = (hidden: boolean) => {
      if (hidden !== mobileNavHiddenRef.current) {
        mobileNavHiddenRef.current = hidden
        setMobileNavHidden(hidden)
      }
    }

    if (latest < threshold) {
      // Still above the nav-visible zone — always reset hidden state
      setHidden(false)
      directionRef.current = null
    } else if (delta > 10 && direction !== directionRef.current) {
      setHidden(window.innerWidth < 768 && direction === 'down')
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

  // ── Deep-link preservation gate ──
  // A hash pointing at a hidden (CMS-empty) section can't be scrolled to, so
  // the browser never fires a scroll. Waiting for the first real scroll before
  // rewriting the URL keeps that hash intact until the user chooses to leave.
  useEffect(() => {
    const markScrolled = () => {
      hasScrolledRef.current = true
    }
    window.addEventListener('scroll', markScrolled, { passive: true, once: true })
    return () => window.removeEventListener('scroll', markScrolled)
  }, [])

  // ── Hash sync ──
  // Mirror the visible section into the URL with replaceState so the address
  // is shareable and Back doesn't drown in a history entry per section. Home
  // clears the hash entirely instead of leaving a stale `#home`.
  useEffect(() => {
    if (!hasScrolledRef.current) return
    const nextHash = activeSection === 'home' ? '' : `#${activeSection}`
    if (nextHash === window.location.hash) return
    const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`
    window.history.replaceState(window.history.state, '', nextUrl)
  }, [activeSection])

  // Mobile nav retains continuous scroll transform for fluid entry
  const mobileNavOpacity = useTransform(scrollY, [heroExit - 40, heroExit + 120], [0, 1])
  const mobileNavVisibility = useTransform(scrollY, (y) =>
    y >= heroExit - 40 ? 'visible' : 'hidden',
  )

  const isOnHome = !hasPassedHero
  const visibleNavigationItems = availableSectionIds
    ? navigationItems.filter(({ href }) => availableSectionIds.has(href.slice(1)))
    : navigationItems

  // The boot overlay covers the nav visually but doesn't block Tab focus into
  // it — without inert, an invisible control could still open the palette
  // behind the boot screen. Same treatment as the open palette.
  const isSuppressed = isPaletteOpen || isBootBlocking

  return (
    <div aria-hidden={isSuppressed || undefined} inert={isSuppressed || undefined}>
      {/* ── Scroll progress bar ── */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left pointer-events-none"
        style={{
          scaleX: scrollYProgress,
          background: 'linear-gradient(to right, #38BDF8, #f97316)',
        }}
      />

      {/* ── Desktop wordmark (Top Left) ── */}
      {/* visibility rides the tween (framer applies 'hidden' at tween end, 'visible'
          immediately) so the faded-out state is unfocusable and unclickable, not
          just transparent — same pattern as the side rail below. */}
      <motion.div
        initial={{ y: -20, opacity: 0, visibility: 'hidden' }}
        animate={
          !isOnHome
            ? { y: 0, opacity: 1, visibility: 'visible' }
            : { y: -20, opacity: 0, visibility: 'hidden' }
        }
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
            {' '}
            ~
          </span>
        </a>
      </motion.div>

      {/* ── Desktop Command Trigger (Bottom Left) ── */}
      <motion.div
        initial={{ y: 20, opacity: 0, visibility: 'hidden' }}
        animate={
          !isOnHome
            ? { y: 0, opacity: 1, visibility: 'visible' }
            : { y: 20, opacity: 0, visibility: 'hidden' }
        }
        transition={{ type: 'tween', ease: 'easeOut', duration: isOnHome ? 0.18 : 0.38 }}
        className="fixed bottom-7 left-9 z-50 hidden md:flex"
      >
        <Magnetic>
          <button
            onClick={() => onOpenPalette?.()}
            aria-label="Open command palette (Ctrl+K)"
            className="group flex items-center gap-2.5 border border-white/10 bg-[#050505]/80 px-3 py-2 backdrop-blur-md transition-all duration-200 ease-out hover:border-accent/30 hover:bg-accent/10 active:scale-95 active:bg-accent/15"
          >
            <Terminal
              className="h-4 w-4 text-foreground/70 transition-colors group-hover:text-accent"
              strokeWidth={2}
            />
            <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/70 transition-colors group-hover:text-accent">
              Cmd
            </span>
            <span className="ml-1 rounded-sm border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-foreground/70 transition-colors group-hover:border-accent/20 group-hover:text-accent">
              Ctrl+K
            </span>
          </button>
        </Magnetic>
      </motion.div>

      {/* One responsive navigation tree: bottom bar on small screens, side rail
          on desktop. Keeping a single set of links avoids shipping duplicate
          destinations and SVGs in the initial HTML. */}
      <motion.nav
        style={{ opacity: mobileNavOpacity, visibility: mobileNavVisibility }}
        initial={{ y: '0%' }}
        animate={{ y: mobileNavHidden ? '100%' : '0%' }}
        transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#050505]/80 backdrop-blur-md md:pointer-events-none md:inset-x-auto md:bottom-auto md:left-0 md:top-0 md:flex md:h-full md:w-32 md:flex-col md:items-center md:border-0 md:bg-transparent md:backdrop-blur-none"
      >
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-evenly px-2 sm:px-4 md:pointer-events-auto md:h-full md:flex-1 md:flex-col md:justify-center md:py-6">
          <div className="contents md:relative md:flex md:flex-col md:items-center md:gap-6">
            {visibleNavigationItems.map(({ label, href, icon: Icon }) => {
              const isActive = activeSection === href.slice(1)
              return (
                <a
                  key={label}
                  href={href}
                  className="group relative z-10 flex min-w-0 flex-1 flex-col items-center justify-center gap-1 py-1 text-[9px] font-medium transition-transform duration-100 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 sm:text-[10px] md:w-24 md:flex-none md:gap-2 md:px-3 md:py-2 md:text-[11px]"
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute left-0 top-[30px] hidden h-px w-5 origin-left bg-accent transition-[opacity,transform] duration-200 ease-out md:block ${
                      isActive
                        ? 'scale-x-100 opacity-70'
                        : 'scale-x-50 opacity-0 group-hover:scale-x-100 group-hover:opacity-35'
                    }`}
                  />
                  <span
                    className={`flex h-8 w-8 items-center justify-center border transition-[color,background-color,border-color,box-shadow] duration-200 ease-out sm:h-9 sm:w-9 md:h-11 md:w-11 ${
                      isActive
                        ? 'border-accent/40 bg-accent/[0.14] text-accent shadow-[0_0_0_1px_rgba(56,189,248,0.18),0_0_16px_rgba(56,189,248,0.45)] md:shadow-[0_0_0_1px_rgba(56,189,248,0.20),0_0_22px_rgba(56,189,248,0.50)]'
                        : 'border-white/20 bg-background/35 text-white/75 group-hover:border-accent/40 group-hover:bg-accent/[0.14] group-hover:text-accent group-hover:shadow-[0_0_0_1px_rgba(56,189,248,0.18),0_0_16px_rgba(56,189,248,0.45)] md:group-hover:shadow-[0_0_0_1px_rgba(56,189,248,0.14),0_0_18px_rgba(56,189,248,0.38)]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" strokeWidth={2} />
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
