'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface SessionRestoredFlashProps {
  onComplete: () => void
}

const VISIBLE_MS = 550
const FADE_MS    = 320

export function SessionRestoredFlash({ onComplete }: SessionRestoredFlashProps) {
  const [isFading, setIsFading] = useState(false)

  const completedRef = useRef(false)
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const completeOnce = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    onComplete()
  }, [onComplete])

  useEffect(() => {
    completedRef.current = false
    return () => {
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current)
        fadeTimerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) {
      completeOnce()
      return
    }

    // If the user toggles reduced-motion mid-flash (OS-level accessibility
    // toggle), honour it immediately by short-circuiting to done.
    const onMotionChange = () => {
      if (reducedMotion.matches) completeOnce()
    }
    reducedMotion.addEventListener('change', onMotionChange)

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault()
        completeOnce()
      }
    }
    window.addEventListener('keydown', handler)

    const startFade = setTimeout(() => {
      setIsFading(true)
      fadeTimerRef.current = setTimeout(() => completeOnce(), FADE_MS + 60)
    }, VISIBLE_MS)

    return () => {
      reducedMotion.removeEventListener('change', onMotionChange)
      window.removeEventListener('keydown', handler)
      clearTimeout(startFade)
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current)
        fadeTimerRef.current = null
      }
    }
  }, [completeOnce])

  return (
    <>
      <style>{`
        @keyframes session-flash-fade-out {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes session-flash-fade-in {
          0%   { opacity: 0; transform: translateY(-2px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        style={{
          position       : 'fixed',
          inset          : 0,
          zIndex         : 200,
          background     : '#050505',
          display        : 'flex',
          alignItems     : 'center',
          justifyContent : 'center',
          padding        : '0 24px',
          ...(isFading
            ? { animation: `session-flash-fade-out ${FADE_MS}ms ease-out forwards`, pointerEvents: 'none' }
            : {}),
        }}
        onAnimationEnd={() => {
          if (isFading) {
            if (fadeTimerRef.current) {
              clearTimeout(fadeTimerRef.current)
              fadeTimerRef.current = null
            }
            completeOnce()
          }
        }}
      >
        <div
          className="font-mono"
          style={{
            display       : 'flex',
            alignItems    : 'center',
            gap           : 10,
            animation     : 'session-flash-fade-in 240ms ease-out both',
            fontSize      : 12.5,
            letterSpacing : '0.04em',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display        : 'inline-block',
              width          : 6,
              height         : 6,
              borderRadius   : '50%',
              backgroundColor: '#38BDF8',
              boxShadow      : '0 0 10px rgba(56,189,248,0.55)',
            }}
          />
          <span style={{ color: 'rgba(255,255,255,0.55)' }}>session</span>
          <span style={{ color: '#38BDF8' }}>restored</span>
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>·</span>
          <span style={{ color: 'rgba(56,189,248,0.7)' }}>welcome back</span>
        </div>
      </div>
    </>
  )
}
