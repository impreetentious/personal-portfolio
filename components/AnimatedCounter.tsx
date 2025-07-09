'use client'

import {useEffect, useRef} from 'react'
import {animate, motion, useInView, useMotionValue, useReducedMotion, useTransform} from 'framer-motion'

type AnimatedCounterProps = {
  to: number
  prefix?: string
  suffix?: string
  duration?: number
}

export function AnimatedCounter({
  to,
  prefix = '',
  suffix = '',
  duration = 1.5,
  
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)

  const isInView = useInView(ref, {once: true, margin: '-10% 0px'})
  const prefersReduced = useReducedMotion()

  const motionValue = useMotionValue(0)

  const displayValue = useTransform(motionValue, (latest) =>
    latest % 1 === 0 ? Math.round(latest).toString() : latest.toFixed(1),
  )

  useEffect(() => {
    if (!isInView) return

    // Reduced-motion users get the final figure immediately instead of a count-up.
    if (prefersReduced) {
      motionValue.set(to)
      return
    }

    const controls = animate(motionValue, to, {
      duration,
      ease: 'easeOut',
    })
    return () => controls.stop()
  }, [isInView, to, duration, motionValue, prefersReduced])

  return (
    <span ref={ref} aria-label={`${prefix}${to}${suffix}`}>
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  )
}