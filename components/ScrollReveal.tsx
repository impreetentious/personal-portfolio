"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReduced = useReducedMotion();

  // MotionConfig strips the y-transform for reduced-motion users, but not the
  // blur filter — so collapse to a plain opacity fade here to keep it consistent.
  const initial = prefersReduced
    ? { opacity: 0 }
    : { opacity: 0, y: 24, filter: "blur(6px)" };
  const shown = prefersReduced
    ? { opacity: 1 }
    : { opacity: 1, y: 0, filter: "blur(0px)" };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? shown : {}}
      transition={{
        duration: prefersReduced ? 0.3 : 0.55,
        ease: "easeOut",
        type: "tween",
        delay: prefersReduced ? 0 : delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}