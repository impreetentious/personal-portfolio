'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

// ─── Window chrome icons ──────────────────────────────────────────────────────

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

function CloseXIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <line x1="0.5" y1="0.5" x2="9.5" y2="9.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="square" />
      <line x1="9.5" y1="0.5" x2="0.5" y2="9.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="square" />
    </svg>
  )
}

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

// ─── Syntax token colours (VS Code Dark+) ─────────────────────────────────────

const T = {
  kw  : '#569CD6',   // keyword: function, return, type
  imp : '#C586C0',   // import / from / export default
  typ : '#4EC9B0',   // type identifiers
  str : '#CE9178',   // string literals
  fn  : '#DCDCAA',   // function names
  cmt : '#6A9955',   // comments
  pun : '#ABB2BF',   // punctuation / default text
} as const

// ─── Code line ────────────────────────────────────────────────────────────────

function Ln({
  n,
  children,
  err = false,
}: {
  n: number
  children: React.ReactNode
  err?: boolean
}) {
  return (
    <div
      className={`flex items-baseline font-mono text-[12.5px] sm:text-[13px] leading-[28px] ${
        err ? 'bg-red-500/[0.055]' : ''
      }`}
    >
      {/* Line number gutter */}
      <span
        className="select-none w-10 sm:w-12 text-right pr-4 sm:pr-5 shrink-0"
        style={{ color: err ? 'rgba(244,71,71,0.58)' : 'rgba(255,255,255,0.18)' }}
      >
        {n}
      </span>
      {/* Code content */}
      <span className="flex-1 pr-5 sm:pr-7">{children}</span>
    </div>
  )
}

// ─── Red wavy squiggle (CSS text-decoration) ──────────────────────────────────

function Squiggle({ children }: { children: string }) {
  return (
    <span
      style={{
        textDecorationLine   : 'underline',
        textDecorationStyle  : 'wavy',
        textDecorationColor  : '#f44747',
        textDecorationSkipInk: 'none',
        textUnderlineOffset  : '2px',
      }}
    >
      {children}
    </span>
  )
}

// ─── Animation variants ───────────────────────────────────────────────────────

const stagger = {
  hidden : {},
  visible: { transition: { staggerChildren: 0.065, delayChildren: 0.24 } },
}

const lineIn = {
  hidden : { opacity: 0, x: -14 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'tween', ease: 'easeOut', duration: 0.35 },
  },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotFound() {
  const [tipVisible, setTipVisible] = useState(false)

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-16">

      {/* Ambient red fog — deliberately low opacity so it doesn't fight the dark bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 52% at 50% 46%, rgba(244,71,71,0.065), transparent)',
        }}
      />

      <div className="relative z-10 w-full max-w-2xl">

        {/* Pre-window error badge */}
        <motion.p
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'tween', ease: 'easeOut', duration: 0.38 }}
          className="mb-4 font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-red-500/45 select-none"
        >
          error ts2307 · 404 not found
        </motion.p>

        {/* ╔══ VS Code editor window ══════════════════════════════════════════╗ */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'tween', ease: 'easeOut', duration: 0.48, delay: 0.06 }}
          className="rounded-xl overflow-hidden border border-white/[0.08] shadow-panel"
        >

          {/* ── Title bar ── */}
          <div className="flex items-center h-9 bg-[#0c0d14] border-b border-white/[0.05]">
            {/* Active editor tab */}
            <div className="flex items-center gap-2 pl-3 pr-2.5 h-full bg-[#13161c] border-r border-white/[0.07] min-w-0 max-w-[60vw] sm:max-w-xs">
              {/* Red dot = error indicator on tab */}
              <span
                className="w-1.5 h-1.5 rounded-full bg-red-500/80 shrink-0"
                aria-hidden="true"
              />
              <span className="font-mono text-[10.5px] sm:text-xs text-white/50 truncate select-none flex-1">
                not-found.tsx
              </span>
              <span className="font-mono text-sm text-white/15 hover:text-white/40 transition-colors duration-100 shrink-0 cursor-default ml-1">
                ×
              </span>
            </div>
            <div className="flex-1" />
            {/* Window controls */}
            <div aria-hidden="true" className="flex items-center h-9 shrink-0">
              <div className="flex items-center justify-center w-9 sm:w-11 h-full cursor-default select-none text-white/18 hover:text-white/45 hover:bg-white/[0.05] transition-colors duration-100">
                <MinimizeIcon />
              </div>
              <div className="flex items-center justify-center w-9 sm:w-11 h-full cursor-default select-none text-white/18 hover:text-white/45 hover:bg-white/[0.05] transition-colors duration-100">
                <MaximizeIcon />
              </div>
              <div className="flex items-center justify-center w-9 sm:w-11 h-full cursor-default select-none text-white/18 hover:text-white hover:bg-[#c42b1c] transition-colors duration-100">
                <CloseXIcon />
              </div>
            </div>
          </div>

          {/* ── Breadcrumb (desktop only) ── */}
          <div className="hidden sm:flex items-center gap-1.5 h-8 px-4 bg-[#0f1017] border-b border-white/[0.04] font-mono text-[11px] select-none">
            <span className="text-white/22 cursor-default">app</span>
            <span className="text-white/12 mx-0.5">›</span>
            <span className="text-red-400/60">not-found.tsx</span>
          </div>

          {/* ── Code editor area ── */}
          <div className="bg-[#1e1e2e] pt-5 pb-5 overflow-x-auto">
            <motion.div variants={stagger} initial="hidden" animate="visible">

              {/* 1 │ import type { NextPage } from 'next' */}
              <motion.div variants={lineIn}>
                <Ln n={1}>
                  <span style={{ color: T.imp }}>import </span>
                  <span style={{ color: T.kw }}>type </span>
                  <span style={{ color: T.pun }}>{'{ '}</span>
                  <span style={{ color: T.typ }}>NextPage</span>
                  <span style={{ color: T.pun }}>{' } '}</span>
                  <span style={{ color: T.imp }}>from </span>
                  <span style={{ color: T.str }}>&apos;next&apos;</span>
                </Ln>
              </motion.div>

              {/* 2 │ import PageModule from './this-page'  ← ERROR LINE */}
              <motion.div variants={lineIn}>
                <Ln n={2} err>
                  <span style={{ color: T.imp }}>import </span>
                  <span style={{ color: T.typ }}>PageModule </span>
                  <span style={{ color: T.imp }}>from </span>
                  <span style={{ color: T.str }}>&apos;</span>

                  {/* ── Squiggle anchor + hover tooltip ── */}
                  <span
                    className="relative"
                    onMouseEnter={() => setTipVisible(true)}
                    onMouseLeave={() => setTipVisible(false)}
                  >
                    <Squiggle>./this-page</Squiggle>

                    <AnimatePresence>
                      {tipVisible && (
                        <motion.div
                          key="err-tip"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ type: 'tween', ease: 'easeOut', duration: 0.14 }}
                          className="absolute top-full left-0 mt-1.5 z-30 w-72 sm:w-80 pointer-events-none"
                        >
                          <div className="rounded-sm border border-red-500/25 bg-[#252526] shadow-2xl px-3 py-2.5">
                            <div className="flex gap-2">
                              <span className="text-red-400 text-[11px] shrink-0 mt-0.5 leading-none select-none">
                                ✕
                              </span>
                              <p className="font-mono text-[11px] leading-[1.65] text-red-300/85">
                                Cannot find module&nbsp;&apos;./this-page&apos; or its corresponding
                                type declarations.
                              </p>
                            </div>
                            <p className="mt-1.5 pl-4 font-mono text-[10px] text-white/22 select-none">
                              ts(2307)
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </span>

                  <span style={{ color: T.str }}>&apos;</span>
                </Ln>
              </motion.div>

              {/* 3 │ (blank) */}
              <motion.div variants={lineIn}>
                <Ln n={3}><span /></Ln>
              </motion.div>

              {/* 4 │ // router: resolving /this-page... */}
              <motion.div variants={lineIn}>
                <Ln n={4}>
                  <span style={{ color: T.cmt }}>{`// router: resolving /this-page...`}</span>
                </Ln>
              </motion.div>

              {/* 5 │ // status: 404 — module not in registry */}
              <motion.div variants={lineIn}>
                <Ln n={5}>
                  <span style={{ color: T.cmt }}>{`// status: 404 — module not in registry`}</span>
                </Ln>
              </motion.div>

              {/* 6 │ (blank) */}
              <motion.div variants={lineIn}>
                <Ln n={6}><span /></Ln>
              </motion.div>

              {/* 7 │ export default function Page(): NextPage { */}
              <motion.div variants={lineIn}>
                <Ln n={7}>
                  <span style={{ color: T.imp }}>export default </span>
                  <span style={{ color: T.kw }}>function </span>
                  <span style={{ color: T.fn }}>Page</span>
                  <span style={{ color: T.pun }}>(): </span>
                  <span style={{ color: T.typ }}>NextPage</span>
                  <span style={{ color: T.pun }}>{' {'}</span>
                </Ln>
              </motion.div>

              {/* 8 │   return <PageModule /> */}
              <motion.div variants={lineIn}>
                <Ln n={8}>
                  <span style={{ color: T.kw }}>&nbsp;&nbsp;return </span>
                  <span style={{ color: T.pun }}>{'<'}</span>
                  <span style={{ color: T.typ }}>PageModule</span>
                  <span style={{ color: T.pun }}>{' />'}</span>
                </Ln>
              </motion.div>

              {/* 9 │ } */}
              <motion.div variants={lineIn}>
                <Ln n={9}>
                  <span style={{ color: T.pun }}>{'}'}</span>
                </Ln>
              </motion.div>

            </motion.div>
          </div>

          {/* ── Problems panel ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.45, delay: 0.62 }}
            className="border-t border-white/[0.06]"
          >
            {/* Panel tab bar */}
            <div className="flex items-end h-[38px] bg-[#0f1017] border-b border-white/[0.05]">
              {/* Active: PROBLEMS */}
              <div className="flex items-center gap-2 px-4 h-full bg-[#181825] border-t border-x border-white/[0.07] font-mono text-[10.5px] tracking-widest text-white/60 select-none -mb-px">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"
                  aria-hidden="true"
                />
                PROBLEMS
              </div>
              {/* Inactive tabs */}
              {['OUTPUT', 'TERMINAL', 'DEBUG CONSOLE'].map((tab) => (
                <div
                  key={tab}
                  className="hidden sm:flex items-center px-4 h-full font-mono text-[10.5px] tracking-widest text-white/15 select-none border-t border-x border-transparent"
                >
                  {tab}
                </div>
              ))}
            </div>

            {/* Error entry */}
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.3, delay: 0.76 }}
              className="flex items-start gap-2.5 px-4 sm:px-5 py-3.5 bg-[#181825] hover:bg-white/[0.02] transition-colors duration-150"
            >
              <span className="text-red-400 text-[11px] shrink-0 mt-0.5 leading-none select-none">
                ✕
              </span>
              <div className="font-mono text-[11px] sm:text-[12px] leading-relaxed min-w-0">
                <span className="text-red-300/80">
                  Cannot find module &apos;./this-page&apos; or its corresponding type declarations.
                </span>
                <span className="text-white/22 text-[10px] ml-2">ts(2307)</span>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-white/30 text-[10px] sm:text-[11px]">
                    app/not-found.tsx
                  </span>
                  <span className="text-white/15 text-[10px]" aria-hidden="true">·</span>
                  <span className="text-white/22 text-[10px] tabular-nums">2:25</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Terminal prompt / navigation ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.4, delay: 0.86 }}
            className="bg-[#0e1014] border-t border-white/[0.04] px-4 sm:px-6 py-4 sm:py-5"
          >
            <p className="font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto whitespace-nowrap">
              <span className="text-[#4bd0e7ff] select-none">PS&nbsp;</span>
              <span className="text-[#4bd0e7ff]">C:\portfolio\app</span>
              <span className="text-white/35 mx-1">{'>'}</span>
              <Link
                href="/"
                className="group inline-flex items-center transition-all duration-200 ease-out"
                style={{ color: '#CE9178' }}
              >
                <span className="group-hover:text-accent transition-colors duration-200 ease-out">
                  → cd /home
                </span>
              </Link>
            </p>
          </motion.div>

          {/* ── Status bar — red for error state ── */}
          <div
            className="flex items-center justify-between h-[22px] px-3 select-none shrink-0"
            style={{ backgroundColor: '#c42b1c' }}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-[5px]">
                <GitBranchIcon />
                <span className="font-mono text-xs text-white/85 leading-none">main</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs text-white/90 leading-none">✕&nbsp;1 error</span>
              <span className="hidden sm:inline text-white/25 text-[10px]" aria-hidden="true">|</span>
              <span className="hidden sm:inline font-mono text-xs text-white/70 leading-none">
                TypeScript
              </span>
              <span className="hidden sm:inline text-white/25 text-[10px]" aria-hidden="true">|</span>
              <span className="hidden sm:inline font-mono text-xs text-white/70 leading-none">
                Ln 2, Col 25
              </span>
            </div>
          </div>

        </motion.div>
        {/* ╚═══════════════════════════════════════════════════════════════════╝ */}

        {/* Below-window caption */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'tween', ease: 'easeOut', duration: 0.5, delay: 1.02 }}
          className="mt-5 sm:mt-6 text-center font-mono text-[10.5px] sm:text-[11px] text-white/18 select-none"
        >
          The page you requested does not exist in this registry.
        </motion.p>

      </div>
    </div>
  )
}
