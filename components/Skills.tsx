"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { showDevFallbacks } from "@/lib/config";
import type { SkillItem, SkillsEntry } from "@/lib/queries";

// ─── Fallback data ────────────────────────────────────────────────────────────

const FALLBACK_SKILL_ENTRIES: SkillsEntry[] = [
  {
    category: 'Tools',
    items: [
      {
        name: 'Next.js',
        description:
          'React framework for production — App Router, RSC, streaming SSR, and edge-ready deployments out of the box.',
      },
      {
        name: 'Sanity.io',
        description:
          'Structured content platform with GROQ querying, typed schemas, and real-time collaborative editing.',
      },
      {
        name: 'Tailwind CSS',
        description:
          'Utility-first CSS framework enabling rapid, consistent, and design-token-driven styling at scale.',
      },
      {
        name: 'Framer Motion',
        description:
          'Production-ready animation library for React with gesture support, layout animations, and shared layouts.',
      },
      {
        name: 'GitHub',
        description:
          'Version control and collaboration via pull requests, Actions CI/CD pipelines, and conventional branch workflows.',
      },
      {
        name: 'VS Code',
        description:
          'Primary editor configured with TypeScript strict mode, ESLint, Prettier, and workspace-scoped settings.',
      },
    ],
  },
  {
    category: 'Skills',
    items: [
      {
        name: 'Frontend Architecture',
        description:
          'Designing scalable component hierarchies, predictable data-flow patterns, and maintainable file structure conventions.',
      },
      {
        name: 'Responsive Design',
        description:
          'Building fluid layouts with mobile-first breakpoints, fluid typography via clamp(), and adaptive spacing scales.',
      },
      {
        name: 'Component Systems',
        description:
          'Authoring reusable, accessible, and composable design-system primitives with clearly typed, minimal-surface APIs.',
      },
      {
        name: 'Content Modeling',
        description:
          'Structuring Sanity schemas to mirror UI needs while keeping the editorial authoring experience intuitive and safe.',
      },
      {
        name: 'Performance Thinking',
        description:
          'Applying Core Web Vitals analysis, route-level code splitting, and image optimisation strategies to hit green scores.',
      },
      {
        name: 'UI Polish',
        description:
          'Crafting micro-interactions, precise transition timing curves, and visual details that lift perceived quality.',
      },
    ],
  },
]

// ─── Animation Variants ───────────────────────────────────────────────────────

const columnVariants = {
  hidden: (direction: "left" | "right") => ({
    opacity: 0,
    x: direction === "left" ? -40 : 40,
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1, // Time between each pill appearing
      delayChildren: 0.2,   // Wait slightly for the column to start moving before staggering pills
    },
  },
}

const pillVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

type SkillsProps = {
  data?: SkillsEntry[]
}

export function Skills({data}: SkillsProps) {
  const skillEntries = data?.length ? data : showDevFallbacks ? FALLBACK_SKILL_ENTRIES : []

  const tools = skillEntries.find((entry) => entry.category === 'Tools') ?? {
    category: 'Tools' as const,
    items: [] as SkillItem[],
  }
  const skills = skillEntries.find((entry) => entry.category === 'Skills') ?? {
    category: 'Skills' as const,
    items: [] as SkillItem[],
  }

  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024)

    let debounceTimer: ReturnType<typeof setTimeout>

    const handleResize = () => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        setIsDesktop(window.innerWidth >= 1024)
      }, 150)
    }

    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(debounceTimer)
    }
  }, [])

  // Production with no CMS data: hide the section rather than show placeholders.
  // Placed after hooks so hook order stays stable across renders.
  if (!skillEntries.length) return null

  return (
    <section
      id="skills"
      className="relative mx-auto w-full max-w-6xl px-6 md:pl-28 lg:pl-32 xl:px-8 py-12 sm:py-16"
    >
      {/* ── Section header ── */}
      <SectionLabel
        label="Skills"
        devLabel="import { skills } from './stack'"
      />

      {/* ── Grid ── */}
      <div className="mt-6 grid gap-10 border-t border-white/10 pt-8 lg:grid-cols-2">
        {[tools, skills].map((entry, index) => {
          // If desktop, the second column comes from the right. If mobile, everything comes from the left.
          const direction = index === 0 ? "left" : isDesktop ? "right" : "left";

          return (
            // Individual column trigger ensures correct scroll-timing on mobile
            <motion.div
              key={entry.category}
              custom={direction}
              variants={columnVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="min-w-0 border-l border-accent/20 pl-5"
            >
              {/* Animated Category Title */}
              <motion.p
                variants={pillVariants}
                className="font-mono text-sm font-medium uppercase tracking-[0.22em] text-success"
              >
                {entry.category}
              </motion.p>

              <div className="mt-5 flex flex-wrap gap-3">
                {entry.items.map((item) => {
                  // Deterministic tooltip id so aria-describedby wires the pill
                  // to it (spaces/punctuation stripped for a valid HTML id).
                  const tooltipId = item.description
                    ? `skill-tip-${entry.category}-${item.name}`.replace(/[^\w-]/g, '-')
                    : undefined
                  return (
                    // ── Tooltip wrapper & Animated Pill ──
                    <motion.div
                      key={item.name}
                      variants={pillVariants}
                      className="group relative"
                    >

                      {/* Tooltip card — only renders when description is present.
                          Reveals on hover (mouse) or when focus lands inside the
                          group (keyboard Tab or touch tap-focus). */}
                      {item.description && (
                        <div
                          id={tooltipId}
                          className={[
                            // Positioning
                            'absolute bottom-full left-1/2 -translate-x-1/2 mb-2',
                            // Visibility
                            'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
                            // Interaction & stacking
                            'pointer-events-none z-20',
                            // Sizing
                            'w-56',
                            // Transition
                            'transition-opacity duration-200 ease-out',
                          ].join(' ')}
                          role="tooltip"
                        >
                          {/* Card body */}
                          <div className="rounded-lg border border-white/10 bg-zinc-900/95 px-3 py-2.5 text-xs leading-relaxed text-foreground/75 shadow-2xl backdrop-blur-sm">
                            {item.description}
                          </div>

                          {/* Arrow — a transparent border trick pointing downward */}
                          <div className="absolute left-1/2 top-full -translate-x-1/2 border-[5px] border-transparent border-t-white/10" />
                        </div>
                      )}

                      {/* Skill tag — focusable only when it carries a description,
                          so tooltip-less pills don't clutter the tab order. */}
                      <span
                        tabIndex={item.description ? 0 : undefined}
                        aria-describedby={tooltipId}
                        className={[
                          'hover-glow',
                          'inline-block cursor-default select-none',
                          'rounded-full border border-white/[0.12] px-4 py-2 font-sans text-sm',
                          'text-foreground transition-all duration-150',
                          'hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/10 hover:text-accent',
                          'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                        ].join(' ')}
                      >
                        {item.name}
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
