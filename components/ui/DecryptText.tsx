'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#'
const FRAME_MS = 28
const TOTAL_FRAMES = 22

type DecryptTextProps = {
  text: string
  className?: string
}

/**
 * Renders text that "decrypts" (scramble → resolve, left to right) the first
 * time it scrolls into view. Falls back to static text when the user prefers
 * reduced motion. An invisible sizer keeps layout stable while scrambling.
 */
export function DecryptText({ text, className }: DecryptTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const prefersReduced = useReducedMotion()
  const [display, setDisplay] = useState(text)

  useEffect(() => {
    if (!inView || prefersReduced) return

    let frame = 0
    const id = setInterval(() => {
      frame++
      const resolved = Math.floor((frame / TOTAL_FRAMES) * text.length)
      let out = text.slice(0, resolved)
      for (let i = resolved; i < text.length; i++) {
        out +=
          text[i] === ' ' ? ' ' : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      }
      setDisplay(out)
      if (frame >= TOTAL_FRAMES) {
        setDisplay(text)
        clearInterval(id)
      }
    }, FRAME_MS)

    return () => clearInterval(id)
  }, [inView, prefersReduced, text])

  return (
    // Real text lives in an sr-only node: aria-label on a generic <span> is
    // unreliably exposed by assistive tech, and both visual layers are
    // aria-hidden (the sizer keeps layout; the overlay animates).
    <span ref={ref} className={`relative inline-block ${className ?? ''}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0 whitespace-nowrap">
        {display}
      </span>
    </span>
  )
}
