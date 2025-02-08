'use client'

import { useEffect, useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type WindowsTerminalProps = {
  name: string
  tagline?: string
  bio: string
}

type PropertyEntry = {
  key: string
  value: string
  href?: string
}

// ─── Static data ──────────────────────────────────────────────────────────────

/**
 * Left column of the 2×2 properties grid.
 * Location has no href; Email gets a mailto: link.
 */
const leftColumnProps: PropertyEntry[] = [
  {
    key: 'Location',
    value: 'Delhi NCR, India',
  },
  {
    key: 'Email',
    value: 'hello@sidakpreet.dev',
    href: 'mailto:hello@sidakpreet.dev',
  },
]

/**
 * Right column of the 2×2 properties grid.
 * Both entries are interactive links.
 */
const rightColumnProps: PropertyEntry[] = [
  {
    key: 'Phone',
    value: '+91 98765 43210',
    href: 'tel:+919876543210',
  },
  {
    key: 'LinkedIn',
    value: 'in/sidakpreetsingh',
    href: 'https://linkedin.com/in/sidakpreetsingh',
  },
]

// ─── PropertyRow ──────────────────────────────────────────────────────────────

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
      className="
        inline-block
        transition-all duration-150 ease-out
        hover:-translate-y-0.5 hover:text-[#4FC1FF]
      "
    >
      {value}
    </a>
  ) : (
    <span>{value}</span>
  )

  return (
    <div className="flex items-baseline font-mono text-[12px]">
      {/* VS Code variable-blue key */}
      <span className="text-[#9cdcfe] shrink-0 w-[5.5rem]">{propKey}</span>
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

// ─── Window controls (shared SVG primitives) ──────────────────────────────────

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
      <line
        x1="0.5" y1="0.5" x2="9.5" y2="9.5"
        stroke="currentColor" strokeWidth="1.1" strokeLinecap="square"
      />
      <line
        x1="9.5" y1="0.5" x2="0.5" y2="9.5"
        stroke="currentColor" strokeWidth="1.1" strokeLinecap="square"
      />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="11" height="12" viewBox="0 0 11 12" fill="none" aria-hidden="true">
      <path
        d="M1 3.5h9M3.5 3.5V2a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v1.5M2.5 3.5l.6 7h5.8l.6-7"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── PowerShell tab icon ──────────────────────────────────────────────────────

function PSIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <polyline
        points="1.5,4 5.5,6.5 1.5,9"
        stroke="#61AFEF"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="7" y1="9" x2="11.5" y2="9"
        stroke="#61AFEF"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ─── Git branch icon (status bar) ────────────────────────────────────────────

function GitBranchIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
      <circle cx="2.5" cy="2"  r="1.3" stroke="white" strokeWidth="0.85" strokeOpacity="0.80" />
      <circle cx="8.5" cy="9"  r="1.3" stroke="white" strokeWidth="0.85" strokeOpacity="0.80" />
      <circle cx="8.5" cy="2"  r="1.3" stroke="white" strokeWidth="0.85" strokeOpacity="0.80" />
      <path
        d="M2.5 3.3V7a1.5 1.5 0 0 0 1.5 1.5h3"
        stroke="white" strokeWidth="0.85" strokeOpacity="0.80" strokeLinecap="round"
      />
      <line
        x1="8.5" y1="3.3" x2="8.5" y2="7.7"
        stroke="white" strokeWidth="0.85" strokeOpacity="0.80" strokeLinecap="round"
      />
    </svg>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function WindowsTerminal({ name, bio }: WindowsTerminalProps) {
  const [displayedChars, setDisplayedChars] = useState(0)

  // Reset when bio prop changes (e.g. in Storybook or HMR)
  useEffect(() => {
    setDisplayedChars(0)
  }, [bio])

  // Advance the typewriter one character at a time, 22 ms per step.
  // Functional setState keeps the closure stable across re-renders so
  // React 18 Strict Mode double-invocation doesn't skip characters.
  useEffect(() => {
    if (displayedChars >= bio.length) return
    const id = setTimeout(() => setDisplayedChars((n) => n + 1), 22)
    return () => clearTimeout(id)
  }, [bio, displayedChars])

  const displayedBio   = bio.slice(0, displayedChars)
  const displayedLines = displayedBio.split('\n')

  return (
    <div className="surface rounded-xl overflow-hidden shadow-panel w-full">

      {/* ── Single consolidated title / tab bar ───────────────────────────── */}
      {/*
          The old design had two separate rows:
            1. title bar  (PS icon + "Windows PowerShell" + window controls)
            2. tab strip  (active tab + add-tab button)
          These are now merged into one row that functions as both tab bar
          and title bar — matching native Windows Terminal behaviour.
      */}
      <div className="flex items-stretch h-9 bg-[#0c0d14] border-b border-white/[0.05]">

        {/* Left: active tab + add-tab button */}
        <div className="flex items-stretch flex-1 min-w-0">

          {/* Active tab — background elevation + right border mark it as active */}
          <div
            className="relative flex items-center gap-[7px] bg-[#13161c]
              px-3.5 border-r border-white/[0.08] select-none"
          >
            <PSIcon />
            <span className="font-mono text-[10.5px] text-foreground/55 whitespace-nowrap tracking-tight">
              Windows PowerShell
            </span>
            {/* Tab-level close — dimmer than the window-level close */}
            <span
              className="ml-1 font-mono text-xs leading-none cursor-default
                text-foreground/18 hover:text-foreground/45
                transition-colors duration-100"
            >
              ×
            </span>
          </div>

          {/* Add-tab button */}
          <button
            aria-hidden="true"
            tabIndex={-1}
            className="flex items-center justify-center w-9 h-full cursor-default select-none
              text-foreground/18 hover:text-foreground/45 hover:bg-white/[0.04]
              transition-colors duration-100 text-base leading-none"
          >
            +
          </button>
        </div>

        {/* Right: standard OS window controls ─ Min / Max / Close */}
        <div className="flex items-stretch h-9 shrink-0">

          <div
            aria-hidden="true"
            className="flex items-center justify-center w-11 cursor-default select-none
              text-foreground/20 hover:text-foreground/45 hover:bg-white/[0.05]
              transition-colors duration-100"
          >
            <MinimizeIcon />
          </div>

          <div
            aria-hidden="true"
            className="flex items-center justify-center w-11 cursor-default select-none
              text-foreground/20 hover:text-foreground/45 hover:bg-white/[0.05]
              transition-colors duration-100"
          >
            <MaximizeIcon />
          </div>

          {/* Close — red background on hover (Windows 11 behaviour) */}
          <div
            aria-hidden="true"
            className="flex items-center justify-center w-11 cursor-default select-none
              text-foreground/20 hover:text-white hover:bg-[#c42b1c]
              transition-colors duration-100"
          >
            <CloseXIcon />
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="surface-2">

        {/* ── Name + typewriter bio ── */}
        <div className="px-6 pt-6 pb-6 border-b border-white/[0.04]">

          {/* Dev comment header */}
          <p className="font-mono text-[10.5px] text-foreground/22 mb-4 tracking-tight select-none">
            {'/** @profile – Sidakpreet Singh · 2025 */'}
          </p>

          {/*
              Name — noticeable growth from the previous clamp(1.3rem, …, 1.8rem).
              text-4xl (2.25rem) on mobile, text-5xl (3rem) on md+ breakpoints.
          */}
          <h1
            className="font-sans font-bold text-white text-4xl md:text-5xl leading-tight"
            style={{ letterSpacing: '-0.025em' }}
          >
            {name}
          </h1>

          {/*
              Typewriter output area.
              • Line numbers are removed entirely — replaced by the bright > chevron.
              • The > chevron uses text-green-400 (classic terminal green) so it
                reads as "prominent and brightly coloured" against the dark bg.
              • The blinking cursor gets scale-x-[1.2] origin-left to make it
                slightly thicker without changing its Unicode code point.
          */}
          <div className="mt-5">
            {displayedLines.map((line, i) => (
              <p
                key={i}
                className="font-mono text-[12.5px] text-foreground/70 break-words"
                style={{ lineHeight: '1.65rem' }}
              >
                {/* Prominent, brightly colored > chevron — no line number */}
                <span className="text-green-400 mr-2 select-none font-bold">{'>'}</span>
                {line}
                {/* Cursor on the last visible line only */}
                {i === displayedLines.length - 1 && (
                  <span
                    className="
                      animate-cursor-blink
                      text-orange-400
                      ml-px
                      inline-block
                      scale-x-[1.2]
                      origin-left
                    "
                  >
                    ▍
                  </span>
                )}
              </p>
            ))}
          </div>
        </div>

        {/* ── Properties — 2-column invisible grid ── */}
        {/*
            Layout: grid-cols-2
            Left  column: Location, Email
            Right column: Phone,    LinkedIn
            No visible borders anywhere in this section.
        */}
        <div className="px-6 py-5 border-b border-white/[0.04]">
          <p className="font-mono text-[10px] text-foreground/18 mb-3 select-none uppercase tracking-[0.2em]">
            {'// properties'}
          </p>

          <div className="grid grid-cols-2 gap-x-6 gap-y-[7px]">

            {/* Left column */}
            <div className="space-y-[7px]">
              {leftColumnProps.map((entry) => (
                <PropertyRow
                  key={entry.key}
                  propKey={entry.key}
                  value={entry.value}
                  href={entry.href}
                />
              ))}
            </div>

            {/* Right column */}
            <div className="space-y-[7px]">
              {rightColumnProps.map((entry) => (
                <PropertyRow
                  key={entry.key}
                  propKey={entry.key}
                  value={entry.value}
                  href={entry.href}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Output panel: // SKILLS ── */}
        <div>

          {/*
              Panel tab row — mirrors VS Code's bottom-panel tab strip:
              • Left:  single active tab labelled "// SKILLS"
              • Right: + (new terminal), trash (clear), × (close panel)
          */}
          <div
            className="flex items-center justify-between
              bg-[#0c0d14] border-t border-white/[0.07] h-[30px]"
          >
            {/* Active panel tab */}
            <div className="flex items-stretch h-full">
              <div
                className="flex items-center px-4 bg-[#13161c]
                  border-r border-white/[0.08]
                  font-mono text-[10.5px] text-foreground/65
                  select-none whitespace-nowrap"
              >
                // SKILLS
              </div>
            </div>

            {/* Panel action icons — far right */}
            <div className="flex items-center h-full pr-0.5">

              {/* + new terminal */}
              <button
                aria-hidden="true"
                tabIndex={-1}
                className="flex items-center justify-center w-8 h-full cursor-default select-none
                  text-foreground/22 hover:text-foreground/52 hover:bg-white/[0.05]
                  transition-colors duration-100 text-[15px] leading-none"
              >
                +
              </button>

              {/* Trash / recycle bin — clear terminal */}
              <button
                aria-hidden="true"
                tabIndex={-1}
                className="flex items-center justify-center w-8 h-full cursor-default select-none
                  text-foreground/22 hover:text-foreground/52 hover:bg-white/[0.05]
                  transition-colors duration-100"
              >
                <TrashIcon />
              </button>

              {/* × close panel */}
              <button
                aria-hidden="true"
                tabIndex={-1}
                className="flex items-center justify-center w-8 h-full cursor-default select-none
                  text-foreground/22 hover:text-foreground/52 hover:bg-white/[0.05]
                  transition-colors duration-100"
              >
                <CloseXIcon size={9} />
              </button>
            </div>
          </div>

          {/* Panel body — static skills output line */}
          {/*
              Colour scheme follows Windows Terminal / PowerShell defaults:
                PS            → teal  #4EC9B0 (PS keyword colour)
                path segment  → blue  #9cdcfe (VS Code variable blue)
                >             → dim white
                skill list    → VS Code string orange #ce9178
          */}
          <div className="px-5 py-3.5 bg-[#0e1014]">
            <p className="font-mono text-[12px] leading-relaxed whitespace-nowrap overflow-x-auto">
              <span className="text-[#4EC9B0] select-none">PS </span>
              <span className="text-[#9cdcfe]">C:\Users\SidakpreetSingh</span>
              <span className="text-white/40 mx-0.5">{'>'}</span>
              <span className="text-[#ce9178]">
                {' React, Next.js, TypeScript, Tailwind, Python, Node.js'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ── VS Code status bar ─────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between h-[22px] bg-[#007acc] px-3 select-none"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-[5px]">
            <GitBranchIcon />
            <span className="font-mono text-[10px] text-white/85 leading-none">main</span>
          </div>
          <span className="font-mono text-[10px] text-white/70 leading-none">
            ✓ 0 errors
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-white/70 leading-none">UTF-8</span>
          <span className="font-mono text-[10px] text-white/70 leading-none">TypeScript</span>
          <span className="font-mono text-[10px] text-white/70 leading-none">Ln 1, Col 1</span>
        </div>
      </div>
    </div>
  )
}
