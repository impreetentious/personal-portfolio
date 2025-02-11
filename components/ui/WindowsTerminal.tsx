'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type WindowsTerminalProps = {
  name: string
  tagline: string
  bio: string
  resumeUrl?: string
}

type PropertyEntry = {
  key: string
  value: string
  href?: string
}

type Skill = {
  label: string
  dot: string
}

const leftColumnProps: PropertyEntry[] = [
  { key: 'Location', value: 'Delhi NCR, India' },
  { key: 'Email',    value: 'sidakpreetsinghk@gmail.com', href: 'mailto:sidakpreetsinghk@gmail.com' },
]

const rightColumnProps: PropertyEntry[] = [
  { key: 'Phone',    value: '+91 90344 31886',  href: 'tel:+919034431886'                       },
  { key: 'LinkedIn', value: 'sidakpreetsingh',  href: 'https://linkedin.com/in/sidakpreetsinghk' },
]

const skills: Skill[] = [
  { label: 'React',      dot: '#61AFEF' },
  { label: 'Next.js',    dot: '#4EC9B0' },
  { label: 'TypeScript', dot: '#4FC1FF' },
  { label: 'Tailwind',   dot: '#38BDF8' },
  { label: 'Python',     dot: '#DCDCAA' },
  { label: 'Node.js',    dot: '#A3E635' },
]

const SHOW_WORKING_STATUS = false

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
    <div className="flex items-baseline font-mono text-xs sm:text-sm">
      <span className="text-[#4bd0e7ff] shrink-0 w-[4.75rem] sm:w-[6rem]">{propKey}</span>
      <span className="text-foreground/24 shrink-0">:</span>
      <span className="ml-2 text-[#ce9178] min-w-0 break-all sm:break-normal">
        <span className="text-foreground/18">&quot;</span>
        {valueNode}
        <span className="text-foreground/18">&quot;</span>
      </span>
      <span className="ml-0.5 text-foreground/14 shrink-0">;</span>
    </div>
  )
}

function SkillChip({ label, dot }: Skill) {
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

// ─── Download state label map ──────────────────────────────────────────────────

type DownloadState = 'idle' | 'compiling' | 'ready'

const DOWNLOAD_LABEL: Record<DownloadState, string> = {
  idle:      '↓ resume.pdf',
  compiling: '[COMPILING...]',
  ready:     '[READY]',
}

const DOWNLOAD_COLOR: Record<DownloadState, string> = {
  idle:      'text-white/70',
  compiling: 'text-amber-300/90',
  ready:     'text-green-300/90',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function WindowsTerminal({ name, tagline, bio, resumeUrl }: WindowsTerminalProps) {
  const [displayedChars, setDisplayedChars] = useState(0)
  const [downloadState, setDownloadState]   = useState<DownloadState>('idle')

  useEffect(() => { setDisplayedChars(0) }, [bio])

  useEffect(() => {
    if (displayedChars >= bio.length) return
    const id = setTimeout(() => setDisplayedChars((n) => n + 1), 22)
    return () => clearTimeout(id)
  }, [bio, displayedChars])

  const displayedBio   = bio.slice(0, displayedChars)
  const displayedLines = displayedBio.split('\n')
  const bioLines       = bio.split('\n')

  // ── Resume download handler ──────────────────────────────────────────────────
  const handleDownload = async () => {
    if (!resumeUrl || downloadState !== 'idle') return
    setDownloadState('compiling')

    try {
      // Fetch blob and enforce minimum 800ms compiling duration in parallel
      const results = await Promise.all([
        fetch(resumeUrl).then((r) => r.blob()),
        new Promise<void>((resolve) => setTimeout(resolve, 800)),
      ])
      const blob      = results[0]
      const objectUrl = URL.createObjectURL(blob)

      setDownloadState('ready')

      const link      = document.createElement('a')
      link.href       = objectUrl
      link.download   = 'Sidakpreet_Singh_Resume.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setTimeout(() => {
        URL.revokeObjectURL(objectUrl)
        setDownloadState('idle')
      }, 400)
    } catch {
      setDownloadState('idle')
    }
  }

  return (
    <div className="surface rounded-xl overflow-hidden shadow-panel w-full max-h-[80vh] flex flex-col max-md:border-l-0">

      {/* ── Title bar ── */}
      <div className="flex items-stretch h-9 bg-[#0c0d14] border-b border-white/[0.05] shrink-0">
        <div className="flex items-stretch flex-1 min-w-0">
          <div className="relative flex items-center gap-[7px] bg-[#13161c] px-2.5 sm:px-3.5 border-r border-white/[0.08] select-none min-w-0 max-w-[52vw] sm:max-w-none">
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
          <div aria-hidden="true" className="flex items-center justify-center w-9 sm:w-11 cursor-default select-none text-foreground/20 hover:text-foreground/45 hover:bg-white/[0.05] transition-colors duration-100">
            <MinimizeIcon />
          </div>
          <div aria-hidden="true" className="flex items-center justify-center w-9 sm:w-11 cursor-default select-none text-foreground/20 hover:text-foreground/45 hover:bg-white/[0.05] transition-colors duration-100">
            <MaximizeIcon />
          </div>
          <div aria-hidden="true" className="flex items-center justify-center w-9 sm:w-11 cursor-default select-none text-foreground/20 hover:text-white hover:bg-[#c42b1c] transition-colors duration-100">
            <CloseXIcon />
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="surface-2 overflow-y-auto flex-1 max-md:border-l-0">

        {/* Profile section */}
        <div className="px-4 sm:px-6 md:px-10 pt-6 sm:pt-8 pb-6 sm:pb-8 border-b border-white/[0.04]">
          <p className="font-mono text-[10px] sm:text-xs text-foreground/22 mb-4 sm:mb-5 tracking-tight select-none">
            {'/** @profile . latest */ - loading....'}
          </p>
          <h1 className="font-semibold tracking-normal text-white text-3xl md:text-5xl">
            {name}
          </h1>
          <p className="mt-4 sm:mt-6 font-mono text-xs sm:text-sm text-accent/60 tracking-normal leading-snug">
            <span className="text-foreground/20 select-none mr-1.5">//</span>
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

        {/* Properties section */}
        <div className="hidden sm:block px-4 sm:px-6 md:px-10 py-5 sm:py-6 border-b border-white/[0.04] max-md:border-l-0">
          <p className="font-mono text-[10px] sm:text-xs text-foreground mb-4 sm:mb-6 select-none uppercase tracking-[0.2em]">
            {'// properties'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-14 gap-y-3">
            <div className="space-y-3">
              {leftColumnProps.map((entry) => (
                <PropertyRow key={entry.key} propKey={entry.key} value={entry.value} href={entry.href} />
              ))}
            </div>
            <div className="space-y-3">
              {rightColumnProps.map((entry) => (
                <PropertyRow key={entry.key} propKey={entry.key} value={entry.value} href={entry.href} />
              ))}
            </div>
          </div>
        </div>

        {/* Skills section */}
        <div className="max-md:border-l-0">
          <div className="flex items-center justify-between bg-[#0c0d14] border-t border-white/[0.07] h-9">
            <div className="flex items-stretch h-full">
              <div className="flex items-center px-4 sm:px-5 bg-[#13161c] border-r border-white/[0.08] font-mono text-[10px] sm:text-xs text-foreground/80 font-semibold tracking-wide select-none whitespace-nowrap">
                // SKILLS
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
          <div className="px-4 sm:px-6 md:px-10 pt-6 pb-8 sm:py-5 bg-[#0e1014]">
            <p className="font-mono text-xs sm:text-sm leading-relaxed whitespace-nowrap overflow-x-auto">
              <span className="text-[#4bd0e7ff] select-none">PS </span>
              <span className="text-[#4bd0e7ff]">
                <span className="sm:hidden">C:\Users</span>
                <span className="hidden sm:inline">C:\Users\SidakpreetSingh</span>
              </span>
              <span className="text-white/40 mx-0.5">{'>'}</span>
              <span className="text-[#ce9178]"> show-skills --active</span>
            </p>
            <div className="flex flex-wrap gap-2 mt-5 sm:mt-3">
              {skills.map((skill) => (
                <SkillChip key={skill.label} {...skill} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── VS Code-style status bar ── */}
      <div className="flex items-center justify-between min-h-[22px] py-[3px] sm:py-0 sm:h-[22px] bg-[#007acc] px-3 select-none flex-wrap sm:flex-nowrap gap-x-3 shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-[5px]">
            <GitBranchIcon />
            <span className="font-mono text-xs text-white/85 leading-none">main</span>
          </div>
          <span className="font-mono text-xs text-white/70 leading-none">✓ 0 errors</span>
        </div>

        <div className="hidden sm:flex items-center gap-3 sm:gap-4">
          {SHOW_WORKING_STATUS && <WorkingStatus />}
          <span className="font-mono text-xs text-white/70 leading-none">UTF-8</span>
          <span className="font-mono text-xs text-white/70 leading-none">TypeScript</span>
          <span className="font-mono text-xs text-white/70 leading-none">Ln 1, Col 1</span>

          {/* ── Resume download button — only rendered when resumeUrl is available ── */}
          {resumeUrl && (
            <>
              <span className="font-mono text-xs text-white/40 leading-none" aria-hidden="true">·</span>
              <button
                onClick={handleDownload}
                disabled={downloadState !== 'idle'}
                aria-label="Download resume as PDF"
                className="relative font-mono text-xs leading-none px-1 rounded-sm transition-colors duration-150 hover:bg-white/10 disabled:pointer-events-none"
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
              </button>
            </>
          )}
        </div>

        <div className="sm:hidden ml-auto shrink-0">
          {SHOW_WORKING_STATUS && <WorkingStatus />}
        </div>
      </div>
    </div>
  )
}