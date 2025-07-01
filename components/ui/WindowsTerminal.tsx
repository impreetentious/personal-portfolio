'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { HeroProfileField, HeroTerminalSkill } from '@/lib/queries'

type WindowsTerminalProps = {
  name: string
  tagline: string
  bio: string
  resumeUrl?: string
  profileFields?: HeroProfileField[]
  terminalSkills?: HeroTerminalSkill[]
  startTyping?: boolean
}

const BASE_TYPE_DELAY = 22
const MIN_TYPE_DELAY  = 4
const MAX_VELOCITY    = 8

const FALLBACK_PROFILE_FIELDS: HeroProfileField[] = [
  { key: 'Location', value: 'Delhi NCR, India', column: 'left' },
  { key: 'Email',    value: 'work@sidakpreetsingh.com', url: 'mailto:work@sidakpreetsingh.com', column: 'left' },
  { key: 'Phone',    value: '+91 90344 31886', url: 'tel:+919034431886', column: 'right' },
  { key: 'LinkedIn', value: 'Sidakpreet Singh', url: 'https://linkedin.com/in/sidakpreetsinghk', column: 'right' },
]

const FALLBACK_TERMINAL_SKILLS: HeroTerminalSkill[] = [
  { label: 'React',      dot: '#61AFEF' },
  { label: 'Next.js',    dot: '#4EC9B0' },
  { label: 'TypeScript', dot: '#4FC1FF' },
  { label: 'Tailwind',   dot: '#38BDF8' },
  { label: 'Python',     dot: '#DCDCAA' },
  { label: 'Node.js',    dot: '#A3E635' },
]

const SHOW_WORKING_STATUS = false

type DownloadState = 'idle' | 'compiling' | 'ready'

const DOWNLOAD_LABEL: Record<DownloadState, string> = {
  idle:      '↓ resume.pdf',
  compiling: '[COMPILING...]',
  ready:     '[READY]',
}

const DOWNLOAD_COLOR: Record<DownloadState, string> = {
  idle:      'text-white',
  compiling: 'text-amber-300/90',
  ready:     'text-green-300/90',
}

const IST_FORMATTER = new Intl.DateTimeFormat('en-GB', { 
  timeZone: 'Asia/Kolkata',
  hour:     '2-digit',
  minute:   '2-digit',
  second:   '2-digit',
  hour12:   false,
})

function getISTTime(): string {
  const parts = IST_FORMATTER.formatToParts(new Date())
  const h = parts.find((p) => p.type === 'hour')?.value   ?? '00'
  const m = parts.find((p) => p.type === 'minute')?.value ?? '00'
  const s = parts.find((p) => p.type === 'second')?.value ?? '00'
  return `${h}:${m}:${s} IST`
}

function PropertyRow({ propKey, value, href }: { propKey: string; value: string; href?: string }) {
  const valueNode = href ? (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="inline-block transition-all duration-150 ease-out hover:-translate-y-0.5 hover:text-[#4FC1FF]"
    >
      {value}
    </a>
  ) : (
    <span>{value}</span>
  )

  return (
    <div className="flex items-center font-mono text-xs sm:text-sm">
      <span className="text-accent shrink-0">{propKey}</span>
      <span
        aria-hidden="true"
        className="flex-1 mx-2 min-w-[8px] self-center"
        style={{
          height: '1px',
          background: 'repeating-linear-gradient(90deg, #2c2c2c 0, #2c2c2c 3px, transparent 3px, transparent 9px)',
        }}
      />
      <span className="text-foreground/24 shrink-0">:</span>
      <span className="ml-2 text-[#ce9178] min-w-0 break-all sm:break-normal shrink-0">
        <span className="text-foreground/18">&quot;</span>
        {valueNode}
        <span className="text-foreground/18">&quot;</span>
      </span>
      <span className="ml-0.5 text-foreground/14 shrink-0">;</span>
    </div>
  )
}

function SkillChip({ label, dot }: HeroTerminalSkill) {
  return (
    <span className="font-mono text-xs bg-white/[0.03] border border-white/10 px-2.5 py-1 rounded-md text-foreground/90 flex items-center gap-1.5 whitespace-nowrap select-none">
      <span
        aria-hidden="true"
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: dot, boxShadow: `0 0 6px ${dot}99` }}
      />
      {label}
    </span>
  )
}

function MinimizeIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <rect x="0" y="7" width="10" height="1" fill="currentColor" />
    </svg>
  )
}

function MaximizeIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <rect x="0.5" y="0.5" width="9" height="9" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

function CloseXIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden="true">
      <line x1="0.5" y1="0.5" x2="9.5" y2="9.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="square" />
      <line x1="9.5" y1="0.5" x2="0.5" y2="9.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="square" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="11" height="12" viewBox="0 0 11 12" fill="none" aria-hidden="true">
      <path
        d="M1 3.5h9M3.5 3.5V2a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v1.5M2.5 3.5l.6 7h5.8l.6-7"
        stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

function PSIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true" className="shrink-0">
      <polyline
        points="1.5,4 5.5,6.5 1.5,9"
        stroke="#61AFEF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
      />
      <line x1="7" y1="9" x2="11.5" y2="9" stroke="#61AFEF" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function WorkingStatus() {
  return (
    <div className="flex items-center gap-1.5">
      <span
        aria-hidden="true"
        className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"
      />
      <span className="font-mono text-xs text-white/85 leading-none">Open to work</span>
    </div>
  )
}

function GitBranchIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
      <circle cx="2.5" cy="2"  r="1.3" stroke="white" strokeWidth="0.85" strokeOpacity="0.80" />
      <circle cx="8.5" cy="9"  r="1.3" stroke="white" strokeWidth="0.85" strokeOpacity="0.80" />
      <circle cx="8.5" cy="2"  r="1.3" stroke="white" strokeWidth="0.85" strokeOpacity="0.80" />
      <path d="M2.5 3.3V7a1.5 1.5 0 0 0 1.5 1.5h3" stroke="white" strokeWidth="0.85" strokeOpacity="0.80" strokeLinecap="round" />
      <line x1="8.5" y1="3.3" x2="8.5" y2="7.7" stroke="white" strokeWidth="0.85" strokeOpacity="0.80" strokeLinecap="round" />
    </svg>
  )
}

export function WindowsTerminal({
  name,
  tagline,
  bio,
  resumeUrl,
  profileFields,
  terminalSkills,
  startTyping = true,
}: WindowsTerminalProps) {
  const [displayedChars, setDisplayedChars] = useState(0)
  const [downloadState, setDownloadState]   = useState<DownloadState>('idle')
  const [istTime, setIstTime]               = useState('')
  const [isIdle, setIsIdle]                 = useState(false)

  const idleTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const typeDelayRef     = useRef(BASE_TYPE_DELAY)
  const lastPointerRef   = useRef<{ x: number; y: number; t: number } | null>(null)
  const velocityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const downloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { setDisplayedChars(0) }, [bio])

  useEffect(() => {
    if (!startTyping) return
    if (displayedChars >= bio.length) return
    const id = setTimeout(() => setDisplayedChars((n) => n + 1), typeDelayRef.current)
    return () => clearTimeout(id)
  }, [bio, displayedChars, startTyping])

  useEffect(() => {
    setIstTime(getISTTime())
    const intervalId = setInterval(() => setIstTime(getISTTime()), 1000)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    let lastFired = 0

    const reset = () => {
      const now = Date.now()
      if (now - lastFired < 200) return
      lastFired = now
      setIsIdle(false)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => setIsIdle(true), 4000)
    }

    idleTimerRef.current = setTimeout(() => setIsIdle(true), 4000)

    window.addEventListener('mousemove', reset, { passive: true })
    window.addEventListener('scroll',    reset, { passive: true })

    return () => {
      window.removeEventListener('mousemove', reset)
      window.removeEventListener('scroll',    reset)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (velocityTimerRef.current) clearTimeout(velocityTimerRef.current)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (downloadTimerRef.current) clearTimeout(downloadTimerRef.current)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = performance.now()

    if (lastPointerRef.current) {
      const dx = e.clientX - lastPointerRef.current.x
      const dy = e.clientY - lastPointerRef.current.y
      const dt = now - lastPointerRef.current.t

      if (dt > 0) {
        const speed           = Math.sqrt(dx * dx + dy * dy) / dt
        const normalizedSpeed = Math.min(speed / MAX_VELOCITY, 1)
        typeDelayRef.current  = Math.round(
          BASE_TYPE_DELAY - normalizedSpeed * (BASE_TYPE_DELAY - MIN_TYPE_DELAY),
        )
      }
    }

    lastPointerRef.current = { x: e.clientX, y: e.clientY, t: now }

    if (velocityTimerRef.current) clearTimeout(velocityTimerRef.current)
    velocityTimerRef.current = setTimeout(() => {
      typeDelayRef.current   = BASE_TYPE_DELAY
      lastPointerRef.current = null
    }, 280)
  }

  const handleDownload = async () => {
    if (!resumeUrl || downloadState !== 'idle') return
    setDownloadState('compiling')

    try {
      const results = await Promise.all([
        fetch(resumeUrl).then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`)
          return r.blob()
        }),
        new Promise<void>((resolve) => setTimeout(resolve, 800)),
      ])
      const blob      = results[0]
      const objectUrl = URL.createObjectURL(blob)

      setDownloadState('ready')

      const link    = document.createElement('a')
      link.href     = objectUrl
      link.download = 'Sidakpreet_Singh_Resume.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      downloadTimerRef.current = setTimeout(() => {
        URL.revokeObjectURL(objectUrl)
        setDownloadState('idle')
        downloadTimerRef.current = null
      }, 400)
    } catch (error) {
      console.error('[handleDownload] Resume fetch failed:', error)
      setDownloadState('idle')
    }
  }

  const displayedBio   = bio.slice(0, displayedChars)
  const displayedLines = displayedBio.split('\n')
  const bioLines       = bio.split('\n')
  const resolvedProfileFields = profileFields?.length ? profileFields : FALLBACK_PROFILE_FIELDS
  const leftColumnProps = resolvedProfileFields.filter((entry) => entry.column !== 'right')
  const rightColumnProps = resolvedProfileFields.filter((entry) => entry.column === 'right')
  const resolvedTerminalSkills = terminalSkills?.length ? terminalSkills : FALLBACK_TERMINAL_SKILLS

  return (
    <motion.div
      animate={isIdle ? { y: [0, -4, 0, 4, 0] } : { y: 0 }}
      transition={
        isIdle
          ? { duration: 4, repeat: Infinity, ease: 'easeInOut', type: 'tween' }
          : { duration: 0.5, ease: 'easeOut', type: 'tween' }
      }
      className="surface rounded-xl overflow-hidden shadow-panel w-full max-h-[80vh] flex flex-col max-md:border-l-0"
      onMouseMove={handleMouseMove}
    >
      <div className="flex items-stretch h-9 bg-[#080808] border-b border-white/[0.05] shrink-0">
        <div className="flex items-stretch flex-1 min-w-0">
          <div className="relative flex items-center gap-[7px] bg-[#0c0c0c] px-2.5 sm:px-3.5 border-r border-white/[0.08] select-none min-w-0 max-w-[52vw] sm:max-w-none">
            <PSIcon />
            <span className="font-mono tracking-tight truncate text-foreground/55">
              <span className="text-[10px] sm:hidden">PS</span>
              <span className="hidden sm:inline text-xs whitespace-nowrap">Windows PowerShell</span>
            </span>
            <span className="ml-0.5 sm:ml-1 font-mono text-sm leading-none cursor-default text-foreground/18 hover:text-foreground/45 transition-colors duration-100 shrink-0">
              ×
            </span>
          </div>
          <button
            aria-hidden="true"
            tabIndex={-1}
            className="flex items-center justify-center w-9 h-full cursor-default select-none text-foreground/18 hover:text-foreground/45 hover:bg-white/[0.04] transition-colors duration-100 text-lg leading-none shrink-0"
          >
            +
          </button>
        </div>
        <div className="flex items-stretch h-9 shrink-0">
          <button
            type="button"
            onClick={() => setDisplayedChars(0)}
            aria-label="Replay typewriter animation"
            title="Replay"
            className="flex items-center justify-center w-9 sm:w-10 h-full cursor-pointer select-none text-foreground/30 hover:text-accent hover:bg-white/[0.04] transition-colors duration-150 text-base leading-none"
          >
            ↺
          </button>
          <div className="w-px h-4 self-center bg-white/[0.08] mx-0.5" aria-hidden="true" />
          <div
            aria-hidden="true"
            className="flex items-center justify-center w-9 sm:w-11 h-full cursor-default select-none text-foreground/20 hover:text-foreground/45 hover:bg-white/[0.05] transition-colors duration-100"
          >
            <MinimizeIcon />
          </div>
          <div
            aria-hidden="true"
            className="flex items-center justify-center w-9 sm:w-11 h-full cursor-default select-none text-foreground/20 hover:text-foreground/45 hover:bg-white/[0.05] transition-colors duration-100"
          >
            <MaximizeIcon />
          </div>
          <div
            aria-hidden="true"
            className="flex items-center justify-center w-9 sm:w-11 h-full cursor-default select-none text-foreground/20 hover:text-white hover:bg-[#c42b1c] transition-colors duration-100"
          >
            <CloseXIcon />
          </div>
        </div>
      </div>

      <div className="surface-2 overflow-y-auto flex-1 max-md:border-l-0">
        <div className="px-4 sm:px-6 md:px-10 pt-6 sm:pt-8 pb-6 sm:pb-8 border-b border-white/[0.04]">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <p className="font-mono text-[10px] sm:text-xs text-foreground/22 tracking-tight select-none">
              {'/** @profile . latest */ - loading....'}
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, type: 'tween', ease: 'easeOut', duration: 0.8 }}
              className="hidden md:flex items-center gap-2 select-none shrink-0 ml-8"
            >
              <span className="font-mono text-[10px] text-foreground/38">
                {'// press '}
              </span>
              <motion.span
                className="font-mono text-[11px] border border-accent/35 bg-accent/[0.08] px-2 py-[3px] text-accent leading-none"
                animate={{
                  opacity: [1, 0.68, 1],
                  boxShadow: [
                    '0 0 6px rgba(0,200,255,0.12)',
                    '0 0 18px rgba(0,200,255,0.30)',
                    '0 0 6px rgba(0,200,255,0.12)',
                  ],
                }}
                transition={{
                  delay   : 2.8,
                  duration: 2.6,
                  repeat  : Infinity,
                  ease    : 'easeInOut',
                  type    : 'tween',
                }}
              >
                Ctrl+K
              </motion.span>
              <span className="font-mono text-[10px] text-foreground/38">
                to navigate
              </span>
            </motion.div>
          </div>
          <h1 className="font-semibold tracking-normal text-white text-3xl md:text-5xl">
            {name}
          </h1>
          <p className="mt-4 sm:mt-6 font-mono text-xs sm:text-sm text-accent/60 tracking-normal leading-snug">
            <span className="text-foreground/20 select-none mr-1.5">{'//'}</span>
            {tagline}
          </p>
          <div className="relative mt-4 sm:mt-6">
            <div aria-hidden="true" className="invisible pointer-events-none select-none">
              {bioLines.map((line, i) => (
                <p
                  key={i}
                  className="font-mono text-xs sm:text-sm text-foreground/70 break-words"
                  style={{ lineHeight: '1.75rem' }}
                >
                  <span className="text-green-400 mr-2 font-bold">{'>'}</span>
                  {line}
                  {i === bioLines.length - 1 && (
                    <span className="ml-px inline-block scale-x-[1.2] origin-left">▍</span>
                  )}
                </p>
              ))}
            </div>
            <div className="absolute inset-0">
              {displayedLines.map((line, i) => (
                <p
                  key={i}
                  className="font-mono text-xs sm:text-sm text-foreground/70 break-words"
                  style={{ lineHeight: '1.75rem' }}
                >
                  <span className="text-green-400 mr-2 select-none font-bold">{'>'}</span>
                  {line}
                  {i === displayedLines.length - 1 && (
                    <span className="animate-cursor-blink text-orange-400 ml-px inline-block scale-x-[1.2] origin-left">
                      ▍
                    </span>
                  )}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden sm:block px-4 sm:px-6 md:px-10 py-5 sm:py-6 border-b border-white/[0.04] max-md:border-l-0">
          <p className="font-mono text-[10px] sm:text-xs text-foreground mb-4 sm:mb-6 select-none uppercase tracking-[0.2em]">
            {'// properties'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-14 gap-y-3">
            <div className="space-y-3">
              {leftColumnProps.map((entry) => (
                <PropertyRow key={entry.key} propKey={entry.key} value={entry.value} href={entry.url} />
              ))}
            </div>
            <div className="space-y-3">
              {rightColumnProps.map((entry) => (
                <PropertyRow key={entry.key} propKey={entry.key} value={entry.value} href={entry.url} />
              ))}
            </div>
          </div>
        </div>

        <div className="max-md:border-l-0">
          <div className="flex items-center justify-between bg-[#080808] border-t border-white/[0.07] h-9">
            <div className="flex items-stretch h-full">
              <div className="flex items-center px-4 sm:px-5 bg-[#0c0c0c] border-r border-white/[0.08] font-mono text-[10px] sm:text-xs text-foreground/80 font-semibold tracking-wide select-none whitespace-nowrap">
                {'// SKILLS'}
              </div>
            </div>
            <div className="flex items-center h-full pr-0.5">
              <button aria-hidden="true" tabIndex={-1} className="flex items-center justify-center w-7 sm:w-8 h-full cursor-default select-none text-foreground/22 hover:text-foreground/52 hover:bg-white/[0.05] transition-colors duration-100 text-[15px] leading-none">
                +
              </button>
              <button aria-hidden="true" tabIndex={-1} className="flex items-center justify-center w-7 sm:w-8 h-full cursor-default select-none text-foreground/22 hover:text-foreground/52 hover:bg-white/[0.05] transition-colors duration-100">
                <TrashIcon />
              </button>
              <button aria-hidden="true" tabIndex={-1} className="flex items-center justify-center w-7 sm:w-8 h-full cursor-default select-none text-foreground/22 hover:text-foreground/52 hover:bg-white/[0.05] transition-colors duration-100">
                <CloseXIcon size={9} />
              </button>
            </div>
          </div>
          <div className="px-4 sm:px-6 md:px-10 pt-6 pb-8 sm:py-5 bg-[#080808]">
            <p className="font-mono text-xs sm:text-sm leading-relaxed whitespace-nowrap overflow-x-auto">
              <span className="text-accent select-none">PS </span>
              <span className="text-accent">
                <span className="sm:hidden">C:\Users</span>
                <span className="hidden sm:inline">C:\Users\SidakpreetSingh</span>
              </span>
              <span className="text-white/40 mx-0.5">{'>'}</span>
              <span className="text-[#ce9178]"> show-skills --active</span>
            </p>
            <div className="flex flex-wrap gap-2 mt-5 sm:mt-3">
              {resolvedTerminalSkills.map((skill) => (
                <SkillChip key={skill.label} {...skill} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex items-center min-h-[22px] py-[3px] sm:py-0 sm:h-[22px] bg-[#007acc] px-3 select-none shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-[5px]">
            <GitBranchIcon />
            <span className="font-mono text-xs text-white/85 leading-none">main</span>
          </div>
          <span className="hidden sm:inline font-mono text-xs text-white/70 leading-none">✓ 0 errors</span>
          {istTime && (
            <span className="sm:hidden font-mono text-xs text-white/85 leading-none tabular-nums">
              {istTime}
            </span>
          )}
        </div>

        {istTime && (
          <div
            className="hidden sm:flex absolute left-1/2 -translate-x-1/2 items-center pointer-events-none"
            aria-label={`Current IST: ${istTime}`}
          >
            <span className="font-mono text-xs text-white/90 leading-none tabular-nums">
              {istTime}
            </span>
          </div>
        )}

        <div className="hidden sm:flex items-center gap-3 sm:gap-4 ml-auto">
          {SHOW_WORKING_STATUS && <WorkingStatus />}
          <span className="font-mono text-xs text-white/70 leading-none">UTF-8</span>
          <span className="font-mono text-xs text-white/70 leading-none">TypeScript</span>
          {resumeUrl && (
            <>
              <span className="font-mono text-xs text-white/40 leading-none" aria-hidden="true">·</span>
              <motion.button
                onClick={handleDownload}
                disabled={downloadState !== 'idle'}
                aria-label="Download resume as PDF"
                initial={{ borderColor: 'rgba(255,255,255,0.14)' }}
                animate={
                  downloadState === 'idle'
                    ? { borderColor: ['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.42)', 'rgba(255,255,255,0.14)'] }
                    : { borderColor: 'rgba(255,255,255,0.14)' }
                }
                transition={
                  downloadState === 'idle'
                    ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                    : { duration: 0.2, ease: 'easeOut' }
                }
                className="relative font-mono text-xs leading-none px-2 py-0.5 border rounded-sm bg-[#050505]/80 hover:bg-[#050505] disabled:pointer-events-none"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={downloadState}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'tween', ease: 'easeOut', duration: 0.12 }}
                    className={DOWNLOAD_COLOR[downloadState]}
                  >
                    {DOWNLOAD_LABEL[downloadState]}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </>
          )}
        </div>
        <div className="sm:hidden ml-auto shrink-0">
          {SHOW_WORKING_STATUS && <WorkingStatus />}
        </div>
      </div>
    </motion.div>
  )
}
