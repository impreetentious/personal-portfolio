'use client'

import { motion } from 'framer-motion'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { useDemoContent } from '@/lib/config'
import { resolveSectionData } from '@/lib/content'
import { demoContent } from '@/lib/demoContent'
import type { SkillItem, SkillsEntry } from '@/lib/queries'

// ─── Animation Variants ───────────────────────────────────────────────────────

const columnVariants = {
  hidden: (direction: 'left' | 'right') => ({
    opacity: 0,
    x: direction === 'left' ? -40 : 40,
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      staggerChildren: 0.1, // Time between each pill appearing
      delayChildren: 0.2, // Wait slightly for the column to start moving before staggering pills
    },
  },
}

const pillVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

type SkillsProps = {
  data?: SkillsEntry[]
}

export function Skills({ data }: SkillsProps) {
  const skillEntries = resolveSectionData(data, [...demoContent.skills], useDemoContent)

  const tools = skillEntries.find((entry) => entry.category === 'Tools') ?? {
    category: 'Tools' as const,
    items: [] as SkillItem[],
  }
  const skills = skillEntries.find((entry) => entry.category === 'Skills') ?? {
    category: 'Skills' as const,
    items: [] as SkillItem[],
  }

  // Only render columns that actually have pills — a category present in the CMS
  // with an empty items list (or entirely absent) would otherwise leave a bare
  // "TOOLS"/"SKILLS" heading with nothing under it.
  const columns = [tools, skills].filter((entry) => entry.items.length > 0)

  // Production with no CMS data (or only empty categories): hide the section
  // rather than show placeholders. Placed after hooks so hook order stays stable.
  if (!columns.length) return null

  return (
    <section
      id="skills"
      aria-label="Skills"
      className="relative mx-auto w-full max-w-6xl px-6 md:pl-28 lg:pl-32 xl:px-8 py-12 sm:py-16"
    >
      {/* ── Section header ── */}
      <SectionLabel label="Skills" devLabel="import { skills } from './stack'" />

      {/* ── Grid ── */}
      <div className="mt-6 grid gap-10 border-t border-white/10 pt-8 lg:grid-cols-2">
        {columns.map((entry, index) => {
          const direction = index === 0 ? 'left' : 'right'

          return (
            // Individual column trigger ensures correct scroll-timing on mobile
            <motion.div
              key={entry.category}
              custom={direction}
              variants={columnVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="min-w-0 border-l border-accent/20 pl-5"
            >
              {/* Animated Category Title — real <h3> so category labels appear
                  in the document outline (h1 → h2 "Skills" → h3 "Tools"/"Skills"),
                  matching Experience/Education/Writing's per-item heading level. */}
              <motion.h3
                variants={pillVariants}
                className="font-mono text-sm font-medium uppercase tracking-[0.22em] text-success"
              >
                {entry.category}
              </motion.h3>

              <div className="mt-5 flex flex-wrap gap-3">
                {entry.items.map((item, itemIndex) => {
                  // Deterministic tooltip id so aria-describedby wires the pill
                  // to it (spaces/punctuation stripped for a valid HTML id).
                  const tooltipId = item.description
                    ? `skill-tip-${entry.category}-${item.name}-${itemIndex}`.replace(
                        /[^\w-]/g,
                        '-',
                      )
                    : undefined
                  return (
                    // ── Tooltip wrapper & Animated Pill ──
                    <motion.div
                      key={`${item.name}-${itemIndex}`}
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
                          so tooltip-less pills don't clutter the tab order.
                          Escape blurs the pill, which drops `group-focus-within`
                          and hides the tooltip (WAI-ARIA 1.2 tooltip pattern). */}
                      <span
                        tabIndex={item.description ? 0 : undefined}
                        aria-describedby={tooltipId}
                        onKeyDown={
                          item.description
                            ? (e) => {
                                if (e.key === 'Escape') {
                                  e.stopPropagation()
                                  e.currentTarget.blur()
                                }
                              }
                            : undefined
                        }
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
