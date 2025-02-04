'use client'

import {motion} from 'framer-motion'
import type {ReactNode} from 'react'

type ScrollRevealProps = {
  children: ReactNode
  className?: string
}

export function ScrollReveal({children, className}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, amount: 0.22}}
      transition={{duration: 0.55, ease: 'easeOut'}}
      className={className}
    >
      {children}
    </motion.div>
  )
}
