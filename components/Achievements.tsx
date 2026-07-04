'use client'

import { AnimatePresence, motion, useInView } from 'framer-motion'
import { ChevronDown, Award } from 'lucide-react'
import { useRef, useState } from 'react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { useDemoContent } from '@/lib/config'
import { resolveSectionData } from '@/lib/content'
import { demoContent } from '@/lib/demoContent'
import type { AchievementItem } from '@/lib/queries'

const tbodyVariants = {
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

const rowVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      type: 'tween' as const,
    },
  },
}

type AchievementsProps = {
  data?: AchievementItem[]
}

export function Achievements({ data }: AchievementsProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inView = useInView(wrapperRef, { once: true, margin: '-60px' })
  const [activeId, setActiveId] = useState<string | null>(null)
  const achievements = resolveSectionData(data, [...demoContent.achievements], useDemoContent)

  // Production with no CMS data and gate off: hide rather than show placeholders.
  if (!achievements.length) return null

  function toggle(id: string) {
    setActiveId((current) => (current === id ? null : id))
  }

  return (
    <section
      id="achievements"
      aria-label="Achievements"
      className="relative mx-auto w-full max-w-6xl px-6 md:pl-28 lg:pl-32 xl:px-8 py-12 sm:py-16"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <SectionLabel devLabel='git tag -l "award-*"' label="Achievements">
            <p className="text-xs font-mono text-muted-foreground hidden md:block whitespace-nowrap">
              {achievements.length}&nbsp;{achievements.length === 1 ? 'tag' : 'tags'} found
            </p>
          </SectionLabel>
        </div>

        <div
          ref={wrapperRef}
          className="w-full overflow-x-auto rounded-sm border border-accent/10 pb-0.5"
        >
          <table className="w-full min-w-[600px] text-sm border-collapse">
            <thead>
              <tr className="border-b border-accent/10 bg-accent/[0.03]">
                <th
                  scope="col"
                  className="py-3 px-5 text-left font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground w-20"
                >
                  Award
                </th>
                <th
                  scope="col"
                  className="py-3 px-5 text-left font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
                >
                  Event
                </th>
                <th
                  scope="col"
                  className="py-3 px-5 text-left font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground hidden md:table-cell"
                >
                  Organizer
                </th>
                <th
                  scope="col"
                  className="py-3 px-5 text-left font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground w-36"
                >
                  Date&nbsp;/&nbsp;Notes
                </th>
              </tr>
            </thead>

            <motion.tbody
              variants={tbodyVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              {achievements.flatMap((item, idx) => {
                const isOpen = activeId === item.id
                const isLast = idx === achievements.length - 1
                const isExpandable = !!item.description

                const rowBorderClass = isLast && !isOpen ? '' : 'border-b border-accent/[0.07]'

                return [
                  <motion.tr
                    key={item.id}
                    variants={rowVariants}
                    onClick={() => isExpandable && toggle(item.id)}
                    className={[
                      rowBorderClass,
                      'group transition-colors duration-200',
                      isExpandable
                        ? 'cursor-pointer hover:bg-accent/[0.04] has-[:focus-visible]:bg-accent/[0.06] has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-inset has-[:focus-visible]:ring-accent'
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <td className="py-5 px-5 relative">
                      {isExpandable && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggle(item.id)
                          }}
                          aria-expanded={isOpen}
                          aria-controls={`${item.id}-details`}
                          aria-label={`${isOpen ? 'Collapse' : 'Expand'} details for ${item.event}`}
                          className="sr-only"
                        />
                      )}

                      <div
                        className={`absolute left-0 top-0 bottom-0 w-[2px] bg-accent transition-transform duration-200 origin-center ${
                          isOpen ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'
                        }`}
                      />

                      <div className="flex items-center justify-center gap-2.5">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center border transition-all duration-300 ${
                            isOpen
                              ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.25)]'
                              : 'border-white/10 bg-background text-foreground/50 group-hover:border-yellow-500/40 group-hover:bg-yellow-500/10 group-hover:text-yellow-400 group-hover:shadow-[0_0_12px_rgba(234,179,8,0.2)]'
                          }`}
                        >
                          <Award className="h-4 w-4" strokeWidth={2} />
                        </span>
                      </div>
                    </td>

                    <td className="py-5 px-5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground text-[15px] leading-snug group-hover:text-accent transition-colors duration-200">
                          {item.event}
                        </span>
                        {isExpandable && (
                          <motion.span
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{
                              duration: 0.2,
                              ease: 'easeOut',
                              type: 'tween',
                            }}
                            className="text-accent/70 group-hover:text-accent transition-colors duration-200 shrink-0"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </motion.span>
                        )}
                      </div>
                    </td>

                    <td className="py-5 px-5 hidden md:table-cell">
                      <span className="font-mono text-[13px] text-muted-foreground">
                        {item.organizer}
                      </span>
                    </td>

                    <td className="py-5 px-5 text-right">
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="font-mono text-xs text-foreground/70 tabular-nums">
                          {item.date}
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {item.notes}
                        </span>
                      </div>
                    </td>
                  </motion.tr>,

                  <tr key={`${item.id}-exp`}>
                    <td colSpan={4} className="p-0">
                      {/* The intermediate block keeps motion.div from becoming a direct child of td, avoiding Safari/Firefox height collapse.
                          id here is the aria-controls target for the sr-only toggle above; keeping it on the always-mounted
                          wrapper means the reference is stable whether the content is expanded or collapsed. */}
                      <div id={`${item.id}-details`}>
                        <AnimatePresence initial={false}>
                          {isOpen && item.description && (
                            <motion.div
                              key="content"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: 0.28,
                                ease: 'easeInOut',
                                type: 'tween',
                              }}
                              className="overflow-hidden relative"
                            >
                              <motion.div
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                exit={{ scaleY: 0 }}
                                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
                                className="absolute left-0 top-0 bottom-0 w-[2px] origin-top bg-gradient-to-b from-accent via-accent/50 to-transparent z-10"
                              />

                              <div
                                className={[
                                  'px-5 py-5 bg-accent/[0.02] border-t border-accent/10',
                                  !isLast ? 'border-b border-accent/[0.07]' : '',
                                ]
                                  .filter(Boolean)
                                  .join(' ')}
                              >
                                <p className="font-mono text-[12px] text-accent/60 mb-2.5 uppercase tracking-[0.18em] md:hidden">
                                  {item.organizer}
                                </p>

                                <p className="font-mono text-[13px] leading-[1.85] text-foreground/60 max-w-3xl">
                                  {item.description}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </tr>,
                ]
              })}
            </motion.tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
