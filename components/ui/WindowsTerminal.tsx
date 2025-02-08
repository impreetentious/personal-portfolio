'use client'

import { useEffect, useState } from 'react'

type WindowsTerminalProps = {
  name: string
  tagline: string
  bio: string
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
  { key: 'Email',    value: 'hello@sidakpreet.dev', href: 'mailto:hello@sidakpreet.dev' },
]

const rightColumnProps: PropertyEntry[] = [
  { key: 'Phone',    value: '+91 98765 43210',      href: 'tel:+919876543210' },
  { key: 'LinkedIn', value: 'in/sidakpreetsingh',   href: 'https://linkedin.com/in/sidakpreetsingh' },
]

const skills: Skill[] = [
  { label: 'React',       dot: '#61AFEF' },
  { label: 'Next.js',     dot: '#4EC9B0' },
  { label: 'TypeScript',  dot: '#4FC1FF' },
  { label: 'Tailwind',    dot: '#38BDF8' },
  { label: 'Python',      dot: '#DCDCAA' },
  { label: 'Node.js',     dot: '#A3E635' },
]

type PropertyRowProps = {
  propKey: string
  value: string
  href?: string
}

function PropertyRow({ propKey, value, href }: PropertyRowProps) {
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
    <div className="flex items-baseline font-mono text-base">
      <span className="text-[#4bd0e7ff] shrink-0 w-[7.5rem]">{propKey}</span>
      <span className="text-foreground/24 shrink-0">:</span>
      <span className="ml-2 text-[#ce9178]">
        <span className="text-foreground/18">"</span>
        {valueNode}
        <span className="text-foreground/18">"</span>
      </span>
      <span className="ml-0.5 text-foreground/14">;</span>
    </div>
  )
}

function SkillChip({ label, dot }: Skill) {
  return (
    <span className="font-mono text-xs sm:text-sm bg-white/[0.03] border border-white/10 px-3 py-1.5 rounded-md text-foreground/90 flex items-center gap-2 whitespace-nowrap select-none">
      <span
        aria-hidden="true"
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{
          backgroundColor: dot,
          boxShadow: `0 0 6px ${dot}99`,
        }}
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

export function WindowsTerminal({ name, tagline, bio }: WindowsTerminalProps) {
  const [displayedChars, setDisplayedChars] = useState(0)

  useEffect(() => { setDisplayedChars(0) }, [bio])

  useEffect(() => {
    if (displayedChars >= bio.length) return
    const id = setTimeout(() => setDisplayedChars((n) => n + 1), 22)
    return () => clearTimeout(id)
  }, [bio, displayedChars])

  const displayedBio   = bio.slice(0, displayedChars)
  const displayedLines = displayedBio.split('\n')

  return (
    <div className="surface rounded-xl overflow-hidden shadow-panel w-full">
      <div className="flex items-stretch h-9 bg-[#0c0d14] border-b border-white/[0.05]">
        <div className="flex items-stretch flex-1 min-w-0">
          <div className="relative flex items-center gap-[7px] bg-[#13161c] px-3.5 border-r border-white/[0.08] select-none">
            <PSIcon />
            <span className="font-mono text-xs text-foreground/55 whitespace-nowrap tracking-tight">
              Windows PowerShell
            </span>
            <span className="ml-1 font-mono text-sm leading-none cursor-default text-foreground/18 hover:text-foreground/45 transition-colors duration-100">
              ×
            </span>
          </div>
          <button
            aria-hidden="true"
            tabIndex={-1}
            className="flex items-center justify-center w-9 h-full cursor-default select-none text-foreground/18 hover:text-foreground/45 hover:bg-white/[0.04] transition-colors duration-100 text-lg leading-none"
          >
            +
          </button>
        </div>

        <div className="flex items-stretch h-9 shrink-0">
          <div aria-hidden="true" className="flex items-center justify-center w-11 cursor-default select-none text-foreground/20 hover:text-foreground/45 hover:bg-white/[0.05] transition-colors duration-100">
            <MinimizeIcon />
          </div>
          <div aria-hidden="true" className="flex items-center justify-center w-11 cursor-default select-none text-foreground/20 hover:text-foreground/45 hover:bg-white/[0.05] transition-colors duration-100">
            <MaximizeIcon />
          </div>
          <div aria-hidden="true" className="flex items-center justify-center w-11 cursor-default select-none text-foreground/20 hover:text-white hover:bg-[#c42b1c] transition-colors duration-100">
            <CloseXIcon />
          </div>
        </div>
      </div>

      <div className="surface-2">
        <div className="px-12 pt-14 pb-14 border-b border-white/[0.04]">
          <p className="font-mono text-sm text-foreground/22 mb-7 tracking-tight select-none">
            {'/** @profile – Sidakpreet Singh · 2025 */'}
          </p>
          <h1
            className="font-sans font-bold text-white text-5xl md:text-6xl leading-tight"
            style={{ letterSpacing: '-0.025em' }}
          >
            {name}
          </h1>
          <p className="mt-10 font-mono text-base text-accent/60 tracking-normal leading-snug">
            <span className="text-foreground/20 select-none mr-1.5">//</span>
            {tagline}
          </p>
          <div className="mt-10">
            {displayedLines.map((line, i) => (
              <p
                key={i}
                className="font-mono text-base text-foreground/70 break-words"
                style={{ lineHeight: '2rem' }}
              >
                <span className="text-green-400 mr-2.5 select-none font-bold">{'>'}</span>
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

        <div className="px-12 py-11 border-b border-white/[0.04]">
          <p className="font-mono text-sm text-foreground mb-10 select-none uppercase tracking-[0.2em]">
            {'// properties'}
          </p>
          <div className="grid grid-cols-2 gap-x-16 gap-y-4">
            <div className="space-y-4">
              {leftColumnProps.map((entry) => (
                <PropertyRow key={entry.key} propKey={entry.key} value={entry.value} href={entry.href} />
              ))}
            </div>
            <div className="space-y-4">
              {rightColumnProps.map((entry) => (
                <PropertyRow key={entry.key} propKey={entry.key} value={entry.value} href={entry.href} />
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between bg-[#0c0d14] border-t border-white/[0.07] h-9">
            <div className="flex items-stretch h-full">
              <div className="flex items-center px-6 bg-[#13161c] border-r border-white/[0.08] font-mono text-sm text-foreground/80 font-semibold tracking-wide select-none whitespace-nowrap">
                // SKILLS
              </div>
            </div>
            <div className="flex items-center h-full pr-0.5">
              <button aria-hidden="true" tabIndex={-1} className="flex items-center justify-center w-8 h-full cursor-default select-none text-foreground/22 hover:text-foreground/52 hover:bg-white/[0.05] transition-colors duration-100 text-[15px] leading-none">+</button>
              <button aria-hidden="true" tabIndex={-1} className="flex items-center justify-center w-8 h-full cursor-default select-none text-foreground/22 hover:text-foreground/52 hover:bg-white/[0.05] transition-colors duration-100"><TrashIcon /></button>
              <button aria-hidden="true" tabIndex={-1} className="flex items-center justify-center w-8 h-full cursor-default select-none text-foreground/22 hover:text-foreground/52 hover:bg-white/[0.05] transition-colors duration-100"><CloseXIcon size={9} /></button>
            </div>
          </div>

          <div className="px-12 py-9 bg-[#0e1014]">
            <p className="font-mono text-base leading-relaxed whitespace-nowrap overflow-x-auto">
              <span className="text-[#4bd0e7ff] select-none">PS </span>
              <span className="text-[#4bd0e7ff]">C:\Users\SidakpreetSingh</span>
              <span className="text-white/40 mx-0.5">{'>'}</span>
              <span className="text-[#ce9178]"> show-skills --active</span>
            </p>
            <div className="flex flex-wrap gap-2.5 mt-3">
              {skills.map((skill) => (
                <SkillChip key={skill.label} {...skill} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between h-[22px] bg-[#007acc] px-3 select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-[5px]">
            <GitBranchIcon />
            <span className="font-mono text-xs text-white/85 leading-none">main</span>
          </div>
          <span className="font-mono text-xs text-white/70 leading-none">✓ 0 errors</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-white/70 leading-none">UTF-8</span>
          <span className="font-mono text-xs text-white/70 leading-none">TypeScript</span>
          <span className="font-mono text-xs text-white/70 leading-none">Ln 1, Col 1</span>
        </div>
      </div>
    </div>
  )
}