'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

type MagneticProps = {
  children: ReactNode
  /** Fraction of the cursor's offset from center applied as translation. */
  strength?: number
  className?: string
}

/**
 * Wrapper that gently pulls its content toward the cursor while hovered and
 * springs back on leave. No-op for touch (no mousemove) and reduced motion.
 */
export function Magnetic({ children, strength = 0.22, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 320, damping: 22, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 320, damping: 22, mass: 0.5 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
