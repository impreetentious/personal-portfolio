'use client'

import {useEffect, useRef} from 'react'
import {animate, motion, useInView, useMotionValue, useTransform} from 'framer-motion'

type AnimatedCounterProps = {
  /** The target number to count up to. Supports fractional values like 2.5. */
  to: number
  /** Optional string prepended before the number (e.g. '$'). */
  prefix?: string
  /** Optional string appended after the number (e.g. '%', 'x', '+'). */
  suffix?: string
  /** Animation duration in seconds. Defaults to 1.5. */
  duration?: number
}

/**
 * AnimatedCounter — triggers exactly once when scrolled into view.
 *
 * Uses Framer Motion's imperative `animate` to drive a MotionValue from 0 → `to`,
 * with a strict easeOut tween curve (no spring physics).
 *
 * Decimal precision:
 *   - Whole-number states (e.g. 4.0) are rendered as integers ("4").
 *   - Fractional states (e.g. 2.5) are rendered with one decimal place ("2.5").
 */
export function AnimatedCounter({
  to,
  prefix = '',
  suffix = '',
  duration = 1.5,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)

  const isInView = useInView(ref, {once: true, margin: '-10% 0px'})

  const motionValue = useMotionValue(0)

  const displayValue = useTransform(motionValue, (latest) =>
    latest % 1 === 0 ? Math.round(latest).toString() : latest.toFixed(1),
  )

  useEffect(() => {
    if (!isInView) return

    animate(motionValue, to, {
      duration,
      ease: 'easeOut',
    })
  }, [isInView, to, duration, motionValue])

  return (
    <span ref={ref} aria-label={`${prefix}${to}${suffix}`}>
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  )
}
