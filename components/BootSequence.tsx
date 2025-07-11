'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface BootSequenceProps {
  onComplete: () => void
}

const BOOT_LINES = [
  { ts: '[100ms]',  msg: 'BIOS v1.4.7 — POST check',                variant: 'ok'    },
  { ts: '[200ms]',  msg: 'Mounting filesystem',                      variant: 'ok'    },
  { ts: '[300ms]',  msg: 'Loading modules: next@14 · framer-motion', variant: 'ok'    },
  { ts: '[400ms]',  msg: 'DNS resolved → sidakpreetsingh.com',       variant: 'ok'    },
  { ts: '[500ms]',  msg: 'Sanity CMS · resume endpoint',             variant: 'ok'    },
  { ts: '[600ms]',  msg: 'Compiling portfolio.exe',                  variant: 'comp'  },
  { ts: '[700ms]', msg:  'All systems go',                           variant: 'ready' },
] as const

// ── Timing constants (do not deviate) ─────────────────────────────────────────
const firstDelay   = 100    // ms before first line appears
const lineInterval = 200   // ms between each line
const taglinePad   = 400    // ms after last line before tagline appears
const fadePad      = 800   // ms after last line before fade-out starts

type Variant = 'ok' | 'comp' | 'ready'

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ variant }: { variant: Variant }) {
  const base: React.CSSProperties = {
    padding       : '2px 7px',
    borderRadius  : 2,
    fontSize      : 10.5,
    letterSpacing : '0.1em',
    whiteSpace    : 'nowrap',
    fontFamily    : 'inherit',
  }

  if (variant === 'comp') {
    return (
      <span
        style={{
          ...base,
          color      : '#10df0dff',
          border     : '1px solid rgba(19, 189, 13, 0.2)',
          background : 'rgba(19, 197, 25, 0.05)',
          fontWeight : 400,
        }}
      >
        [COMPILING]
      </span>
    )
  }

  // 'ok' and 'ready' share the same cyan palette; 'ready' is bold
  return (
    <span
      style={{
        ...base,
        color      : '#38BDF8',
        border     : '1px solid rgba(56,189,248,0.20)',
        background : 'rgba(56,189,248,0.05)',
        fontWeight : variant === 'ready' ? 700 : 400,
      }}
    >
      {variant === 'ready' ? '[ READY ]' : '[ OK ]'}
    </span>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────
export function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleCount,   setVisibleCount]   = useState(0)
  const [taglineVisible, setTaglineVisible] = useState(false)
  const [isFading,       setIsFading]       = useState(false)

  // Guard: fire onComplete exactly once regardless of which path triggers it.
  // Reset on each mount so Strict Mode's remount cycle works cleanly.
  const completedRef = useRef<boolean>(false)
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const completeOnce = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    onComplete()
  }, [onComplete])

  // Reset the guard on remount (handles React Strict Mode double-invocation)
  useEffect(() => {
    completedRef.current = false
    return () => {
      // On unmount (or Strict Mode cleanup), cancel the fallback timer
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current)
        fadeTimerRef.current = null
      }
    }
  }, [])

  // ── Effect 1 — reduced-motion check + keyboard skip ──────────────────────
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      completeOnce()
      return
    }

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault()
        completeOnce()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [completeOnce])

  // ── Effect 2 — boot sequence timing ──────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timers: ReturnType<typeof setTimeout>[] = []
    const totalLines = BOOT_LINES.length
    const lastLineAt = firstDelay + (totalLines - 1) * lineInterval

    // Reveal lines one by one
    for (let i = 0; i < totalLines; i++) {
      timers.push(
        setTimeout(() => setVisibleCount(i + 1), firstDelay + i * lineInterval)
      )
    }

    // Tagline fade-in
    timers.push(
      setTimeout(() => setTaglineVisible(true), lastLineAt + taglinePad)
    )

    // Start fade-out + belt-and-suspenders fallback
    timers.push(
      setTimeout(() => {
        setIsFading(true)
        fadeTimerRef.current = setTimeout(() => completeOnce(), 650)
      }, lastLineAt + fadePad)
    )

    return () => {
      timers.forEach(clearTimeout)
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current)
        fadeTimerRef.current = null
      }
    }
  }, [completeOnce])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/*
        Self-contained keyframe — does NOT depend on globals.css Phase 2 being applied.
        Once Phase 2 is in place, this duplicate definition is harmless (last-write-wins).
      */}
      <style>{`
        @keyframes boot-fade-out {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      <div
        style={{
          position       : 'fixed',
          inset          : 0,
          zIndex         : 200,
          background     : '#050505',
          display        : 'flex',
          flexDirection  : 'column',
          justifyContent : 'center',
          padding        : '0 24px',
          ...(isFading
            ? { animation: 'boot-fade-out 0.5s ease-out forwards', pointerEvents: 'none' }
            : {}),
        }}
        onAnimationEnd={() => {
          // Primary completion path — clear the fallback timer first
          if (fadeTimerRef.current) {
            clearTimeout(fadeTimerRef.current)
            fadeTimerRef.current = null
          }
          completeOnce()
        }}
      >
        <div style={{ maxWidth: 680, margin: '0 auto', width: '100%' }}>

          {/* ── Header ── */}
          <p
            className="font-mono uppercase"
            style={{
              fontSize     : 11,
              letterSpacing: '0.14em',
              color        : 'rgba(255,255,255,0.30)',
              marginBottom : 24,
            }}
          >
            sidakpreet-os — initializing
          </p>

          {/* ── Boot log ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {BOOT_LINES.map((line, i) => (
              <div
                key={i}
                className="font-mono"
                style={{
                  display    : 'flex',
                  alignItems : 'center',
                  gap        : 12,
                  fontSize   : 12.5,
                  opacity    : i < visibleCount ? 1 : 0,
                  transform  : i < visibleCount ? 'translateX(0)' : 'translateX(-4px)',
                  transition : 'opacity 150ms ease, transform 150ms ease',
                }}
              >
                {/* Timestamp */}
                <span
                  style={{
                    color     : '#2c2c2c',
                    fontSize  : 11,
                    minWidth  : 60,
                    flexShrink: 0,
                  }}
                >
                  {line.ts}
                </span>

                {/* Message */}
                <span style={{ color: '#888888', flex: 1 }}>{line.msg}</span>

                {/* Status badge */}
                <StatusBadge variant={line.variant as Variant} />
              </div>
            ))}
          </div>

          {/* ── Tagline ── */}
          <div
            className="font-mono"
            style={{
              fontSize     : 12,
              color        : '#38BDF8',
              letterSpacing: '0.04em',
              marginTop    : 28,
              opacity      : taglineVisible ? 1 : 0,
              transition   : 'opacity 300ms ease',
            }}
          >
            entering environment...
          </div>

          <button
            type="button"
            onClick={completeOnce}
            className="mt-8 rounded border border-white/15 bg-white/[0.02] px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/65 transition-colors hover:border-accent/45 hover:bg-accent/10 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Skip intro
          </button>

        </div>
      </div>
    </>
  )
}
