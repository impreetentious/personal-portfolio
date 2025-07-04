'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  BarChart,
  BookOpen,
  Briefcase,
  Download,
  GraduationCap,
  Layers,
  Mail,
  Sparkles,
  Terminal,
  Trophy,
  User,
  Wifi,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// ── Import the master config ──
import { siteConfig } from '@/lib/config'

// ─── Types ────────────────────────────────────────────────────────────────────

type DownloadState = 'idle' | 'compiling' | 'ready'

interface PaletteAction {
  id                : string
  shortLabel        : string
  icon?             : LucideIcon
  description?      : string
  href?             : string
  isDownload?       : boolean
  isTerminalOutput? : boolean
  colorMode?        : 'hi' | 'ok' | 'warn' | 'dim' | 'default'
  textLine?         : string | React.ReactNode
}

// ─── Navigation Action Definitions ───────────────────────────────────────────

const NAV_ACTIONS: PaletteAction[] = [
  {
    id          : 'experience',
    shortLabel  : 'Experience',
    icon        : Briefcase,
    description : 'Work history & roles',
    href        : '#experience',
  },
  {
    id          : 'skills',
    shortLabel  : 'Skills',
    icon        : Sparkles,
    description : 'Tech stack & tools',
    href        : '#skills',
  },
  {
    id          : 'metrics',
    shortLabel  : 'Metrics',
    icon        : BarChart,
    description : 'Impact numbers',
    href        : '#metrics',
  },
  {
    id          : 'awards',
    shortLabel  : 'Awards',
    icon        : Trophy,
    description : 'Results & recognitions',
    href        : '#achievements',
  },
  {
    id          : 'education',
    shortLabel  : 'Education',
    icon        : GraduationCap,
    description : 'Academic background',
    href        : '#education',
  },
  
  // ── Feature Flag Toggle ──
  ...(siteConfig.features.showWriting
    ? [
        {
          id          : 'writing',
          shortLabel  : 'Writing',
          icon        : BookOpen,
          description : 'Articles & Publications',
          href        : '#writing',
        },
      ]
    : []),
    
  {
    id          : 'contact',
    shortLabel  : 'Contact',
    icon        : Mail,
    description : 'Get in touch',
    href        : '#contact',
  },
]

const RESUME_ACTION: PaletteAction = {
  id          : 'resume',
  shortLabel  : 'Download Resume',
  icon        : Download,
  description : 'Compile & export resume.pdf',
  isDownload  : true,
}

// ─── Terminal Engine Dictionaries ─────────────────────────────────────────────

const HELP_ACTIONS: PaletteAction[] = [
  { id: 'cmd-who',    shortLabel: '> who',    icon: User,      description: 'about me' },
  { id: 'cmd-ping',   shortLabel: '> ping',   icon: Wifi,      description: 'connection test' },
  { id: 'cmd-status', shortLabel: '> status', icon: Activity,  description: 'system report' },
  { id: 'cmd-stack',  shortLabel: '> stack',  icon: Layers,    description: 'tech stack' },
  { id: 'cmd-hire',   shortLabel: '> hire',   icon: Briefcase, description: 'work with me' },
]

const TERMINAL_OUTPUTS: Record<string, PaletteAction[]> = {
  'who': [
    { id: 'w1', shortLabel: '', isTerminalOutput: true, colorMode: 'hi',      textLine: '  Sidakpreet Singh — Product Strategy & GTM professional.' },
    { id: 'w2', shortLabel: '', isTerminalOutput: true, colorMode: 'hi',      textLine: '  IIM Indore MBA · HCLSoftware · ex-Bain' },
    { id: 'w3', shortLabel: '', isTerminalOutput: true, colorMode: 'hi',      textLine: '  Building things that didn\'t exist before.' },
  ],
  'ping': [
    { id: 'p1', shortLabel: '', isTerminalOutput: true, colorMode: 'default', textLine: '  Ping sidakpreetsingh.com: 32 bytes of data' },
    { id: 'p2', shortLabel: '', isTerminalOutput: true, colorMode: 'ok',      textLine: '  64 bytes from edge-01: seq=0 ttl=69 time=0.69ms' },
    { id: 'p3', shortLabel: '', isTerminalOutput: true, colorMode: 'hi',      textLine: '  pong. ✓' },
  ],
  'status': [
    { id: 's1', shortLabel: '', isTerminalOutput: true, colorMode: 'hi',      textLine: '  system.status → all green' },
    { id: 's2', shortLabel: '', isTerminalOutput: true, colorMode: 'ok',      textLine: '  domain      live ✓' },
    { id: 's3', shortLabel: '', isTerminalOutput: true, colorMode: 'ok',      textLine: '  portfolio   deployed & active ✓' },
    { id: 's4', shortLabel: '', isTerminalOutput: true, colorMode: 'ok',      textLine: '  ambition    unbounded' },
  ],
  'stack': [
    { id: 'k1', shortLabel: '', isTerminalOutput: true, colorMode: 'default', textLine: '  tech.stack → activating....' },
    { id: 'k2', shortLabel: '', isTerminalOutput: true, colorMode: 'ok',      textLine: '  framework   Next.js 14 (App Router)' },
    { id: 'k3', shortLabel: '', isTerminalOutput: true, colorMode: 'ok',      textLine: '  styling     Tailwind CSS + Framer Motion' },
    { id: 'k4', shortLabel: '', isTerminalOutput: true, colorMode: 'ok',      textLine: '  content     Sanity CMS Headless' },
  ],
  'hire': [
    { id: 'h1', shortLabel: '', isTerminalOutput: true, colorMode: 'hi',      textLine: '  Initiating hire sequence...' },
    { id: 'h2', shortLabel: '', isTerminalOutput: true, colorMode: 'ok',      textLine: '  email     hello@sidakpreetsingh.com' },
    { id: 'h3', shortLabel: '', isTerminalOutput: true, colorMode: 'ok',      textLine: '  linkedin  linkedin.com/in/sidakpreetsinghk' },
    { id: 'h4', shortLabel: '', isTerminalOutput: true, colorMode: 'default', textLine: '  Note: Serious enquiries only. Coffee optional.' },
  ],
}

// ─── Download Label / Colour Maps ─────────────────────────────────────────────

const DOWNLOAD_LABEL: Record<DownloadState, string> = {
  idle      : 'Download Resume',
  compiling : '[COMPILING...]',
  ready     : '[READY]',
}

const DOWNLOAD_COLOR_CLASS: Record<DownloadState, string> = {
  idle      : '',
  compiling : 'text-amber-300/90',
  ready     : 'text-green-300/90',
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface CommandPaletteProps {
  isOpen    : boolean
  onClose   : () => void
  resumeUrl?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CommandPalette({ isOpen, onClose, resumeUrl }: CommandPaletteProps) {
  const [query,         setQuery        ] = useState('')
  const [activeIndex,   setActiveIndex  ] = useState(0)
  const [downloadState, setDownloadState] = useState<DownloadState>('idle')

  const inputRef             = useRef<HTMLInputElement>(null)
  const overlayRef           = useRef<HTMLDivElement>(null)
  const downloadTimeoutRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const downloadSessionRef   = useRef(0)
  const modalRef             = useRef<HTMLDivElement>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  const allActions = useMemo<PaletteAction[]>(
    () => (resumeUrl ? [...NAV_ACTIONS, RESUME_ACTION] : NAV_ACTIONS),
    [resumeUrl],
  )

  // ── Strict Terminal Engine ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    
    // 1. Idle State: Force the user to type
    if (!q) return []

    // 2. Strict Exact Matches
    if (q === 'help') return HELP_ACTIONS
    if (q === 'nav' || q === 'navigate' || q === 'navigation') return allActions
    if (TERMINAL_OUTPUTS[q]) return TERMINAL_OUTPUTS[q]

    // 3. Fallback: No fuzzy matching allowed anymore. Return empty.
    return []
  }, [allActions, query])

  // ── Cleanup floating download timer ───────────────────────────────────────
  useEffect(() => {
    return () => {
      if (downloadTimeoutRef.current) clearTimeout(downloadTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return
    downloadSessionRef.current++
    if (downloadTimeoutRef.current) {
      clearTimeout(downloadTimeoutRef.current)
      downloadTimeoutRef.current = null
    }
    setQuery('')
    setActiveIndex(0)
    setDownloadState('idle')
    const timer = setTimeout(() => inputRef.current?.focus(), 60)
    return () => clearTimeout(timer)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null
    return () => {
      previouslyFocusedRef.current?.focus?.()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const modal = modalRef.current
      if (!modal) return
      const focusable = Array.from(
        modal.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute('disabled'))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handleTab)
    return () => window.removeEventListener('keydown', handleTab)
  }, [isOpen, filtered.length])

  // ── Clamp active index when filtered list shrinks ─────────────────────────
  useEffect(() => {
    setActiveIndex((i) => Math.min(i, Math.max(0, filtered.length - 1)))
  }, [filtered.length])

  const handleDownload = useCallback(async () => {
    if (!resumeUrl || downloadState !== 'idle') return
    const session = ++downloadSessionRef.current
    setDownloadState('compiling')
    try {
      const [blob] = await Promise.all([
        fetch(resumeUrl).then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`)
          return r.blob()
        }),
        new Promise<void>((resolve) => setTimeout(resolve, 800)),
      ])
      if (session !== downloadSessionRef.current) return
      const objectUrl = URL.createObjectURL(blob)
      setDownloadState('ready')

      const link    = document.createElement('a')
      link.href     = objectUrl
      link.download = 'Sidakpreet_Singh_Resume.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      downloadTimeoutRef.current = setTimeout(() => {
        URL.revokeObjectURL(objectUrl)
        setDownloadState('idle')
        onClose()
      }, 600)
    } catch (error) {
      if (session !== downloadSessionRef.current) return
      console.error('[handleDownload] Resume fetch failed:', error)
      setDownloadState('idle')
    }
  }, [resumeUrl, downloadState, onClose])

  // ── Execute action ────────────────────────────────────────────────────────
  const executeAction = useCallback(
    (action: PaletteAction) => {
      // Terminal rows are unclickable
      if (action.isTerminalOutput) return

      // Terminal triggers dynamically change the search query
      if (action.id.startsWith('cmd-')) {
        setQuery(action.id.replace('cmd-', ''))
        setActiveIndex(0)
        inputRef.current?.focus()
        return
      }

      if (action.isDownload) {
        handleDownload()
        return
      }
      if (action.href) {
        const target = document.querySelector(action.href)
        target?.scrollIntoView({ behavior: 'smooth' })
        onClose()
      }
    },
    [handleDownload, onClose],
  )


  const filteredRef      = useRef(filtered)
  const activeIndexRef   = useRef(activeIndex)
  const executeActionRef = useRef(executeAction)
  const queryRef         = useRef(query)

  filteredRef.current      = filtered
  activeIndexRef.current   = activeIndex
  executeActionRef.current = executeAction
  queryRef.current         = query

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      const currentFiltered    = filteredRef.current
      const currentActiveIndex = activeIndexRef.current
      const currentQuery       = queryRef.current.toLowerCase().trim()

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, currentFiltered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const action = currentFiltered[currentActiveIndex]
        if (action) executeActionRef.current(action)
      } else if (e.key === 'Escape') {
        // 1. Hijack the Escape Key in the Capture Phase
        if (TERMINAL_OUTPUTS[currentQuery]) {
          // If viewing terminal text, block the event and go back to 'help'
          e.preventDefault()
          e.stopPropagation()
          e.stopImmediatePropagation()
          setQuery('help')
          setActiveIndex(0)
        } else if (currentQuery !== '') {
          // If they typed something else, block the event and clear to Idle
          e.preventDefault()
          e.stopPropagation()
          e.stopImmediatePropagation()
          setQuery('')
          setActiveIndex(0)
        } else {
          // If already in Idle state, allow it to close
          e.preventDefault()
          onClose()
        }
      }
    }
    
    window.addEventListener('keydown', handler, { capture: true })
    return () => window.removeEventListener('keydown', handler, { capture: true })
  }, [isOpen, onClose])

  // ── Click-outside close ───────────────────────────────────────────────────
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose()
  }

  // ── Label / colour resolution helpers ────────────────────────────────────
  const resolveLabel = (action: PaletteAction): string =>
    action.isDownload ? DOWNLOAD_LABEL[downloadState] : action.shortLabel

  const resolveLabelClass = (action: PaletteAction, isActive: boolean): string => {
    if (!action.isDownload) return isActive ? 'text-accent' : 'text-foreground/85'
    return downloadState !== 'idle'
      ? DOWNLOAD_COLOR_CLASS[downloadState]
      : isActive
        ? 'text-accent'
        : 'text-foreground/85'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Dimming overlay ── */}
          <motion.div
            ref={overlayRef}
            onClick={handleOverlayClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
          />

          {/* ── Palette modal ── */}
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%", scale: 0.97 }}
            animate={{ opacity: 1, y: 0,   x: "-50%", scale: 1     }}
            exit  ={{ opacity: 0, y: -14,  x: "-50%", scale: 0.97  }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.22 }}
            className="fixed top-[12vh] left-1/2 z-[90] w-full max-w-xl px-4 sm:px-0"
          >
            <div ref={modalRef} className="relative overflow-hidden rounded-xl border border-white/[0.12] bg-[#0A0A0E] shadow-[0_32px_80px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)]">

              {/* ── Terminal Scan Beam ── */}
              <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden rounded-xl">
                <motion.div
                  initial={{ y: '-100%' }}
                  animate={{ y: '800%' }}
                  transition={{ duration: 1.6, ease: 'easeInOut' }}
                  className="absolute left-0 top-0 h-[80px] w-full bg-gradient-to-b from-transparent via-[#00E5FF]/10 to-transparent"
                />
              </div>

              {/* ── Relative container to position content above scan beam ── */}
              <div className="relative z-10">
                {/* ── Title bar ── */}
                <div className="flex items-center justify-between border-b border-white/[0.06] bg-surface2/50 px-4 py-2.5">
                  <span className="select-none font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/70">
                    COMMAND PALETTE
                  </span>
                  <button
                    onClick={onClose}
                    aria-label="Close command palette"
                    className="flex h-5 w-5 items-center justify-center rounded text-foreground/30 transition-colors duration-150 hover:bg-white/[0.07] hover:text-foreground/80"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* ── Search row ── */}
                <div className="flex items-center gap-3 border-b border-white/[0.06] bg-[#080810] px-5 py-4">
                  <span className="select-none font-mono text-base font-bold text-[#00E5FF] shrink-0 animate-pulse">
                    ▍
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setActiveIndex(0)
                    }}
                    placeholder="Type 'navigate' or 'help' to begin..."
                    className="flex-1 bg-transparent font-sans text-[15px] font-medium text-foreground placeholder:text-foreground/40 focus:outline-none"
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                  />
                  {query && (
                    <button
                      onClick={() => {
                        setQuery('')
                        setActiveIndex(0)
                        inputRef.current?.focus()
                      }}
                      aria-label="Clear search"
                      className="shrink-0 text-foreground/30 transition-colors hover:text-foreground/70"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* ── Actions list / Idle State ── */}
                <div className="max-h-[440px] overflow-y-auto py-2">
                  {filtered.length === 0 && !query ? (
                    // IDLE STATE: 1pt larger, brighter colors
                    <div className="px-5 py-6 text-left font-mono text-[12px] leading-relaxed text-foreground/60">
                      <span className="text-[#00E5FF]/80">#</span> system.idle<br/>
                      <span className="pl-[14px]">awaiting command input...</span>
                    </div>
                  ) : filtered.length === 0 && query ? (
                    // NO MATCH STATE: True terminal error format
                    <div className="px-5 py-8 text-left font-mono text-[12px] text-foreground/50">
                      <span className="text-[#ff5f57]">command not found:</span> {query}<br/>
                      <span className="text-foreground/40 mt-1 block">try typing &apos;help&apos; or &apos;navigate&apos;</span>
                    </div>
                  ) : (
                    filtered.map((action, i) => {
                      
                      // Render Terminal Output Lines (Read-Only)
                      if (action.isTerminalOutput) {
                        const colorClass = 
                          action.colorMode === 'hi' ? 'text-[#00E5FF]' : 
                          action.colorMode === 'ok' ? 'text-[#4ec94e]' : 
                          action.colorMode === 'warn' ? 'text-[#c88040]' : 
                          'text-foreground/60'

                        return (
                          <div key={action.id} className="flex w-full items-center px-5 py-2 text-left">
                            <span className={`font-mono text-xs leading-relaxed tracking-tight whitespace-pre ${colorClass}`}>
                              {action.textLine}
                            </span>
                          </div>
                        )
                      }

                      // Render Standard Clickable Navigation Items
                      const Icon      = action.icon || Terminal
                      const isActive  = i === activeIndex
                      const isRunning = action.isDownload && downloadState !== 'idle'

                      return (
                        <button
                          key={action.id}
                          onClick={() => !isRunning && executeAction(action)}
                          onMouseEnter={() => setActiveIndex(i)}
                          disabled={isRunning}
                          data-selected={isActive}
                          className={`group flex w-full items-center gap-4 px-5 py-3 transition-colors duration-100 disabled:cursor-not-allowed disabled:opacity-50 ${
                            isActive ? 'bg-accent/[0.06]' : 'hover:bg-white/[0.02]'
                          }`}
                        >
                          {/* Icon badge */}
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors duration-100 ${
                              isActive
                                ? 'border-accent/30 bg-accent/10 text-accent shadow-[0_0_12px_rgba(56,189,248,0.22)]'
                                : 'border-white/[0.06] bg-white/[0.02] text-foreground/40 group-hover:border-white/[0.12] group-hover:text-foreground/70'
                            }`}
                          >
                            <Icon className="h-4 w-4" strokeWidth={1.8} />
                          </span>

                          {/* Text block */}
                          <div className="min-w-0 flex-1 text-left">
                            <p
                              className={`font-sans text-[15px] font-medium leading-none transition-colors duration-100 ${resolveLabelClass(action, isActive)}`}
                            >
                              {resolveLabel(action)}
                            </p>
                            <p className="mt-1.5 font-mono text-[10.5px] tracking-wide leading-none text-foreground/40">
                              {action.description}
                            </p>
                          </div>

                          {/* Enter key hint */}
                          {isActive && (
                            <kbd className="shrink-0 select-none rounded border border-success/30 bg-success/10 px-1.5 py-0.5 font-mono text-[10px] text-success shadow-[0_0_8px_rgba(208,117,47,0.2)]">
                              ↵
                            </kbd>
                          )}
                        </button>
                      )
                    })
                  )}
                </div>

                {/* ── Footer hint bar ── */}
                <div className="flex items-center justify-between border-t border-white/[0.05] bg-[#060608] px-5 py-2.5">
                  <div className="flex items-center gap-3.5 select-none">
                    {/* Only show navigation hints if a list actually exists */}
                    {filtered.length > 0 && (
                      <>
                        <span className="flex items-center gap-1.5 font-mono text-[10px] text-foreground/30">
                          <kbd className="rounded border border-white/[0.12] bg-white/[0.04] px-1.5 py-0.5 text-[9px] text-foreground/50">
                            ↑↓
                          </kbd>
                          <span>navigate</span>
                        </span>
                        <span className="flex items-center gap-1.5 font-mono text-[10px] text-foreground/30">
                          <kbd className="rounded border border-white/[0.12] bg-white/[0.04] px-1.5 py-0.5 text-[9px] text-foreground/50">
                            ↵
                          </kbd>
                          <span>select</span>
                        </span>
                      </>
                    )}
                    <span className="flex items-center gap-1.5 font-mono text-[10px] text-foreground/30">
                      <kbd className="rounded border border-white/[0.12] bg-white/[0.04] px-1.5 py-0.5 text-[9px] text-foreground/50">
                        Esc
                      </kbd>
                      <span>close</span>
                    </span>
                  </div>

                  {/* Live Telemetry System */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00E5FF] opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00E5FF]"></span>
                      </span>
                      <span className="select-none font-mono text-[10px] tracking-widest text-[#00E5FF]/80">
                        SYS.ONLINE
                      </span>
                    </div>
                    
                    <div className="h-3 w-px bg-white/10" />
                    
                    <span className="select-none font-mono text-[10px] text-foreground/30">
                      node: <span className="text-foreground/50">edge-01</span>
                    </span>
                    
                    <div className="h-3 w-px bg-white/10" />
                    
                    <span className="select-none font-mono text-[10px] text-foreground/30">
                      loc: <span className="text-foreground/50">IN</span>
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}