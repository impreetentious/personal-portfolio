'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart,
  BookOpen,
  Briefcase,
  Download,
  GraduationCap,
  Mail,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'

// ── Import the master config ──
import { siteConfig } from '@/lib/config'

// ─── Types ────────────────────────────────────────────────────────────────────

type DownloadState = 'idle' | 'compiling' | 'ready'

interface PaletteAction {
  id          : string
  shortLabel  : string
  icon        : LucideIcon
  description : string
  href?       : string
  isDownload? : boolean
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

function fuzzyMatch(query: string, target: string): boolean {
  if (!query) return true
  const q = query.toLowerCase().trim()
  const t = target.toLowerCase()
  if (t.includes(q)) return true
  let qi = 0
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++
  }
  return qi === q.length
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

  const inputRef   = useRef<HTMLInputElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Build action list — resume action only when URL is configured
  const allActions: PaletteAction[] = resumeUrl
    ? [...NAV_ACTIONS, RESUME_ACTION]
    : NAV_ACTIONS

  const filtered = allActions.filter(
    (a) => fuzzyMatch(query, a.shortLabel) || fuzzyMatch(query, a.description),
  )

  // ── Reset + focus on open ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return
    setQuery('')
    setActiveIndex(0)
    setDownloadState('idle')
    const timer = setTimeout(() => inputRef.current?.focus(), 60)
    return () => clearTimeout(timer)
  }, [isOpen])

  // ── Clamp active index when filtered list shrinks ─────────────────────────
  useEffect(() => {
    setActiveIndex((i) => Math.min(i, Math.max(0, filtered.length - 1)))
  }, [filtered.length])

  // ── Resume download handler ────────────────────────────────────────────────
  const handleDownload = useCallback(async () => {
    if (!resumeUrl || downloadState !== 'idle') return
    setDownloadState('compiling')
    try {
      const [blob] = await Promise.all([
        fetch(resumeUrl).then((r) => r.blob()),
        new Promise<void>((resolve) => setTimeout(resolve, 800)),
      ])
      const objectUrl = URL.createObjectURL(blob)
      setDownloadState('ready')

      const link    = document.createElement('a')
      link.href     = objectUrl
      link.download = 'Sidakpreet_Singh_Resume.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setTimeout(() => {
        URL.revokeObjectURL(objectUrl)
        setDownloadState('idle')
        onClose()
      }, 600)
    } catch {
      setDownloadState('idle')
    }
  }, [resumeUrl, downloadState, onClose])

  // ── Execute action ────────────────────────────────────────────────────────
  const executeAction = useCallback(
    (action: PaletteAction) => {
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

  // ── Keyboard navigation (active only when palette is open) ────────────────
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const action = filtered[activeIndex]
        if (action) executeAction(action)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, filtered, activeIndex, executeAction])

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

          {/* ── Palette modal — locked to centre using x: "-50%" ── */}
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%", scale: 0.97 }}
            animate={{ opacity: 1, y: 0,   x: "-50%", scale: 1     }}
            exit  ={{ opacity: 0, y: -14,  x: "-50%", scale: 0.97  }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.22 }}
            className="fixed top-[12vh] left-1/2 z-[90] w-full max-w-xl px-4 sm:px-0"
          >
            <div className="overflow-hidden rounded-xl border border-white/[0.12] bg-[#11111A] shadow-[0_32px_80px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)]">

              {/* ── Title bar ── */}
              <div className="flex items-center justify-between border-b border-white/[0.06] bg-surface2/50 px-4 py-2.5">
                <span className="select-none font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40">
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
              <div className="flex items-center gap-3 border-b border-white/[0.06] bg-[#0E0E14] px-5 py-4">
                <span className="select-none font-mono text-base font-bold text-accent shrink-0">
                  {'>'}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setActiveIndex(0)
                  }}
                  placeholder="Type a command or search..."
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

              {/* ── Actions list ── */}
              <div className="max-h-[440px] overflow-y-auto py-2">
                {filtered.length === 0 ? (
                  <div className="px-4 py-10 text-center font-sans text-sm text-foreground/40">
                    No commands match &ldquo;<span className="text-foreground/80">{query}</span>&rdquo;
                  </div>
                ) : (
                  filtered.map((action, i) => {
                    const Icon      = action.icon
                    const isActive  = i === activeIndex
                    const isRunning = action.isDownload && downloadState !== 'idle'

                    return (
                      <button
                        key={action.id}
                        onClick={() => !isRunning && executeAction(action)}
                        onMouseEnter={() => setActiveIndex(i)}
                        disabled={isRunning}
                        aria-selected={isActive}
                        className={`group flex w-full items-center gap-4 px-5 py-3 transition-colors duration-100 disabled:cursor-not-allowed disabled:opacity-50 ${
                          isActive ? 'bg-accent/[0.06]' : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        {/* Icon badge */}
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors duration-100 ${
                            isActive
                              ? 'border-accent/30 bg-accent/10 text-accent shadow-[0_0_12px_rgba(79,199,239,0.15)]'
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

                        {/* Enter key hint — Terminal Orange pop on active row */}
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
              <div className="flex items-center justify-between border-t border-white/[0.05] bg-[#09091A] px-5 py-2.5">
                <div className="flex items-center gap-3.5 select-none">
                  {[
                    { key: '↑↓',  label: 'navigate' },
                    { key: '↵',   label: 'select'   },
                    { key: 'Esc', label: 'close'     },
                  ].map(({ key, label }) => (
                    <span
                      key={key}
                      className="flex items-center gap-1.5 font-mono text-[10px] text-foreground/30"
                    >
                      <kbd className="rounded border border-white/[0.12] bg-white/[0.04] px-1.5 py-0.5 text-[9px] text-foreground/50">
                        {key}
                      </kbd>
                      <span>{label}</span>
                    </span>
                  ))}
                </div>
                <span className="select-none font-mono text-[10px] text-foreground/30">
                  {filtered.length}&nbsp;result{filtered.length !== 1 ? 's' : ''}
                </span>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}