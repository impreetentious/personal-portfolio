'use client'

import {motion, useMotionValueEvent, useScroll, useTransform} from 'framer-motion'
import {useEffect, useRef, useState} from 'react'
import {
  BarChart,
  Briefcase,
  GraduationCap,
  Mail,
  Sparkles,
  Trophy,
} from 'lucide-react'

const navigationItems = [
  {label: 'Experience',   href: '#experience',   icon: Briefcase},
  {label: 'Skills',       href: '#skills',        icon: Sparkles},
  {label: 'Metrics',      href: '#metrics',       icon: BarChart},
  {label: 'Achievements', href: '#achievements',  icon: Trophy},
  {label: 'Education',    href: '#education',     icon: GraduationCap},
  {label: 'Contact',      href: '#contact',       icon: Mail},
]

/**
 * Section IDs monitored by the IntersectionObserver.
 * Active-state highlighting fires when one of these sections enters
 * the central 20% band of the viewport (rootMargin: -20% top / -60% bottom).
 */
const OBSERVED_SECTIONS = [
  'home',
  'experience',
  'skills',
  'metrics',
  'achievements',
  'education',
  'contact',
]

export function Navigation() {
  const {scrollY} = useScroll()
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
    // Mobile nav direction detection. Only toggle after the user has
    // scrolled 80 px so the nav doesn't flicker at the very top of the page.
    const direction = latest > lastScrollY.current ? 'down' : 'up'
    if (latest > 80) {
      setMobileNavHidden(direction === 'down')
    } else {
      setMobileNavHidden(false)
    }
    lastScrollY.current = latest
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
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

  const desktopNavOpacity = useTransform(scrollY, [heroExit - 40, heroExit + 120], [0, 1])
  const desktopNavX = useTransform(scrollY, [heroExit - 40, heroExit + 120], [-32, 0])

  // visibility: hidden keeps the rail out of compositing while opacity is 0,
  // preventing any compositing artefacts from bleeding through the hero.
  const desktopNavVisibility = useTransform(
    scrollY,
    (y) => (y >= heroExit - 40 ? 'visible' : 'hidden'),
  )

  const mobileNavOpacity = useTransform(scrollY, [heroExit - 40, heroExit + 120], [0, 1])
  const mobileNavVisibility = useTransform(
    scrollY,
    (y) => (y >= heroExit - 40 ? 'visible' : 'hidden'),
  )

  const isOnHome = activeSection === 'home'

  return (
    <>
      {/*
        Top-left path label — hidden on mobile (handled by outer hidden md:flex).
        Two inner variants handle the md→lg and lg+ breakpoints:
          • md up to lg: shortened prompt  →  C:\>  cd \
          • lg and above: full path        →  C:\Users\SidakpreetSingh>
      */}
      <motion.div
        initial={{y: -20, opacity: 0}}
        animate={!isOnHome ? {y: 0, opacity: 1} : {y: -20, opacity: 0}}
        transition={{type: 'tween', ease: 'easeOut', duration: 0.4}}
        className="fixed top-7 left-9 z-50 hidden md:flex items-center"
      >
        <a
          href="#home"
          aria-label="Go to top"
          className="group whitespace-nowrap font-mono text-base font-semibold tracking-tight"
        >
          {/* Full path — lg screens and above */}
          <span className="hidden lg:inline">
            <span className="text-foreground transition-colors duration-200 ease-out group-hover:text-foreground/75">
              C:\Users\SidakpreetSingh
            </span>
            <span className="text-orange-500">&gt;</span>
          </span>

          {/* Short path — md screens up to lg */}
          <span className="inline lg:hidden">
            <span className="text-foreground transition-colors duration-200 ease-out group-hover:text-foreground/75">
              C:\
            </span>
            <span className="text-orange-500">&gt;</span>
            <span className="text-foreground transition-colors duration-200 ease-out group-hover:text-foreground/75">
              {' '}cd \
            </span>
          </span>
        </a>
      </motion.div>

      {/*
        Mobile bottom navigation bar
        Two-axis motion composition:
          • opacity / visibility → style prop (fade-in curve via useTransform)
          • y translate          → animate prop (slides off bottom based on scroll direction)
      */}
      <motion.nav
        style={{
          opacity: mobileNavOpacity,
          visibility: mobileNavVisibility,
        }}
        animate={{y: mobileNavHidden ? '100%' : '0%'}}
        transition={{type: 'tween', ease: 'easeOut', duration: 0.28}}
        className="fixed inset-x-0 bottom-0 z-50 md:hidden bg-[#07070F]/80 backdrop-blur-md border-t border-white/10"
      >
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-around px-4">
          {navigationItems.map(({label, href, icon: Icon}) => {
            const isActive = activeSection === href.slice(1)
            return (
              <a
                key={label}
                href={href}
                className="group flex min-w-0 flex-col items-center gap-1 p-1 text-[10px] font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/70"
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
                  className={`truncate transition-colors duration-200 ease-out ${
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

      <motion.nav
        style={{
          opacity: desktopNavOpacity,
          x: desktopNavX,
          visibility: desktopNavVisibility,
          // Explicitly marks the GPU-promoted compositor layer as transparent
          // to prevent the browser from painting an opaque slab on the layer.
          backgroundColor: 'transparent',
        }}
        className="pointer-events-none fixed left-0 top-0 h-full w-28 z-40 hidden md:flex md:flex-col md:items-center"
      >
        <div className="pointer-events-auto flex flex-1 flex-col items-center justify-center py-6">
          {/* Items wrapper — establishes the positioning context for the wire */}
          <div className="relative flex flex-col items-center gap-4">
            {/* Vertical wire — structural spine of the floating layout */}
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
                  // bg-[#07070F] is the solid site-background mask that hides
                  // the wire passing through the button's bounding box.
                  // relative z-10 ensures the <a> renders above the -z-10 wire.
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
                    className={`truncate transition-colors duration-200 ease-out ${
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