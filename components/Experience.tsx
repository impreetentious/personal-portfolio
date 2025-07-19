'use client'

import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { ChevronDown, MapPin } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { ScrollReveal } from '@/components/ScrollReveal'
import { showDevFallbacks } from '@/lib/config'
import type { ExperienceItem, ExperienceRoleItem } from '@/lib/queries'

const FALLBACK_EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: 'fallback-open-systems-lab',
    company: 'Open Systems Lab',
    role: 'Software Engineer',
    location: 'Remote',
    dates: '2024 - Present',
    bulletPoints: [
      'Built interactive frontend features for product dashboards and internal tooling.',
      'Collaborated across design and engineering to translate rough ideas into polished user experiences.',
      'Improved maintainability by organizing reusable components and shared UI patterns.',
    ],
    skillsUsed: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    id: 'fallback-northstar-digital',
    company: 'Northstar Digital',
    role: 'Frontend Developer',
    location: 'Chandigarh, India',
    dates: '2022 - 2024',
    bulletPoints: [
      'Developed responsive interfaces with a strong focus on smooth interactions and accessibility.',
      'Worked closely with stakeholders to convert business requirements into production-ready releases.',
      'Maintained design consistency across landing pages, product surfaces, and content modules.',
    ],
    skillsUsed: ['React', 'JavaScript', 'CSS', 'REST APIs'],
  },
  {
    id: 'fallback-freelance',
    company: 'Freelance',
    role: 'Web Developer',
    location: 'Remote',
    dates: '2020 - 2022',
    bulletPoints: [
      'Delivered portfolio sites and business websites with custom sections, animation, and CMS integrations.',
      'Managed end-to-end implementation from layout planning to deployment handoff.',
      'Created flexible content structures so clients could update text without technical support.',
    ],
    skillsUsed: ['Sanity.io', 'Node.js', 'Deployment', 'UI Architecture'],
  },
]

type ExperienceProps = {
  data?: ExperienceItem[]
}

function normalizeRoles(item: ExperienceItem): ExperienceRoleItem[] {
  if (item.roles?.length) return item.roles

  if (item.role && item.dates && item.bulletPoints?.length) {
    return [
      {
        role: item.role,
        dates: item.dates,
        bulletPoints: item.bulletPoints,
        skillsUsed: item.skillsUsed ?? [],
      },
    ]
  }

  return []
}

export function Experience({data}: ExperienceProps) {
  const [activeIds, setActiveIds] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)

  const timelineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 75%', 'end 35%'],
  })
  const timelineProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    mass: 0.35,
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const updateIsMobile = () => setIsMobile(mediaQuery.matches)

    updateIsMobile()
    mediaQuery.addEventListener('change', updateIsMobile)

    return () => mediaQuery.removeEventListener('change', updateIsMobile)
  }, [])

  const visibleItems = data?.length ? data : showDevFallbacks ? FALLBACK_EXPERIENCE_ITEMS : []

  // Production with no CMS data: hide the section rather than show placeholders.
  if (!visibleItems.length) return null

  return (
    <section
      id="experience"
      className="relative mx-auto w-full max-w-6xl px-6 md:pl-28 lg:pl-32 xl:px-8 py-12 sm:py-16"
    >
      <SectionLabel
        label="Experience"
        devLabel="console.trace('career')"
      />

      <div ref={timelineRef} className="relative mt-6 pl-8 sm:pl-12">
        <div className="absolute bottom-0 left-1 top-0 w-px bg-white/10 sm:left-2" />
        <motion.div
          style={{ scaleY: timelineProgress }}
          className="absolute bottom-0 left-1 top-0 w-px origin-top bg-gradient-to-b from-[#38BDF8] via-[#38BDF8] to-[#f97316] shadow-[0_0_10px_rgba(56,189,248,0.20)] sm:left-2"
        />

        {visibleItems.map((item, index) => {
          const isOpen = activeIds.includes(item.id)
          const roleEntries = normalizeRoles(item)
          const totalBulletCount = roleEntries.reduce((count, roleEntry) => count + roleEntry.bulletPoints.length, 0)
          const estimatedContentWeight = totalBulletCount + roleEntries.length * 1.35
          const primaryRole = roleEntries[0]?.role ?? item.role ?? ''
          const extraRoleCount = Math.max(roleEntries.length - 1, 0)
          const collapsedRoleLabel = extraRoleCount
            ? `${primaryRole} + ${extraRoleCount} more role${extraRoleCount > 1 ? 's' : ''}`
            : primaryRole
          const shouldHideCollapsedRoleWhenOpen = isOpen && roleEntries.length > 1
          const collapsedDates =
            item.displayDates ??
            item.dates ??
            (roleEntries.length === 1 ? roleEntries[0]?.dates : `${roleEntries.length} roles`)
          const openHeightDuration = isMobile
            ? Math.min(2.8, 0.95 + estimatedContentWeight * 0.16)
            : Math.min(
                1.45,
                (0.62 + estimatedContentWeight * 0.08) * (roleEntries.length > 1 ? 0.95 : 0.9)
              )
          const openOpacityDuration = isMobile
            ? Math.min(1.05, 0.34 + roleEntries.length * 0.16)
            : Math.min(
                0.62,
                (0.28 + roleEntries.length * 0.08) * (roleEntries.length > 1 ? 0.95 : 0.9)
              )
          const closeHeightDuration = isMobile
            ? Math.min(0.72, 0.4 + roleEntries.length * 0.08)
            : Math.min(0.5, 0.34 + roleEntries.length * 0.04)

          return (
            <ScrollReveal key={item.id} delay={index * 0.2}>
              <div className="relative overflow-visible border-t border-white/10 last:border-b group">

                {/* Top-edge glow — strong centre, tapers to nothing before reaching either edge */}
                <div
                  aria-hidden="true"
                  style={{
                    background: 'linear-gradient(90deg, transparent 1%, rgba(56,189,248,1) 50%, transparent 99%)',
                  }}
                  className="pointer-events-none absolute left-0 right-0 top-0 h-px opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                />
                <span
                  className="absolute -left-[2.12rem] top-8 sm:-left-[2.84rem] -translate-x-[2px] -translate-y-[2px] h-4 w-4"
                >
                  {/* Ping ring — visible + animating only while accordion is open */}
                  {isOpen && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full border border-accent/70 animate-ping"
                    />
                  )}

                  {/* Static filled dot — always visible, centred inside the 4×4 wrapper */}
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full border border-accent bg-[#050505] shadow-[0_0_8px_rgba(56,189,248,0.25)]" />
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setActiveIds((current) =>
                      current.includes(item.id)
                        ? current.filter((id) => id !== item.id)
                        : [...current, item.id]
                    )
                  }
                    className="flex w-full flex-col gap-4 px-3 py-6 text-left md:flex-row md:items-start md:justify-between"
                  aria-expanded={isOpen}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-white sm:text-2xl">
                        {item.company}
                      </h3>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="text-accent"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.span>
                    </div>
                    <p
                      className={`mt-2 pr-6 font-medium leading-relaxed text-success transition-opacity duration-200 sm:pr-0 ${
                        shouldHideCollapsedRoleWhenOpen
                          ? 'opacity-0 h-0 overflow-hidden mt-0'
                          : 'text-[0.95rem] sm:text-sm opacity-100'
                      }`}
                    >
                      {collapsedRoleLabel}
                    </p>
                  </div>

                  <p className="shrink-0 text-left text-sm font-medium leading-relaxed text-foreground/[0.78] md:min-w-40 md:text-right">
                    {collapsedDates}
                  </p>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: 'auto',
                        opacity: 1,
                        transition: {
                          height: { duration: openHeightDuration, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: openOpacityDuration, ease: 'easeOut' },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: closeHeightDuration, ease: [0.4, 0, 0.2, 1] },
                          opacity: { duration: 0.22, ease: 'easeOut' },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-accent/10 pb-8 pt-6">
                        {item.location && (
                          <div className="flex items-center gap-2 text-sm text-foreground/[0.72]">
                            <MapPin className="h-4 w-4 text-accent" />
                            <span>{item.location}</span>
                          </div>
                        )}

                        <div className="mt-5 space-y-8">
                          {roleEntries.map((roleEntry, roleIndex) => (
                            <div
                              key={`${item.id}-${roleEntry.role}-${roleEntry.dates}`}
                              className={roleIndex > 0 ? 'border-t border-white/10 pt-6' : ''}
                            >
                              {(() => {
                                const roleSkills = roleEntry.skillsUsed ?? []

                                return (
                                  <>
                              {roleEntries.length > 1 && (
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                                  <p className="pr-6 text-base font-semibold leading-relaxed text-success sm:pr-0 sm:text-[1.02rem]">
                                    {roleEntry.role}
                                  </p>
                                  {roleEntry.dates && (
                                    <p className="text-sm font-medium leading-relaxed text-foreground/[0.72]">
                                      {roleEntry.dates}
                                    </p>
                                  )}
                                </div>
                              )}

                              <ul className={roleEntries.length > 1 ? 'mt-5 space-y-3' : 'space-y-3'}>
                                {roleEntry.bulletPoints.map((point) => (
                                  <li
                                    key={`${roleEntry.role}-${point}`}
                                    className="flex items-start gap-3 text-sm leading-7 text-foreground/[0.86] sm:text-base"
                                  >
                                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                                    <span className="min-w-0 flex-1">{point}</span>
                                  </li>
                                ))}
                              </ul>

                              {roleSkills.length > 0 && (
                                <div className="mt-6">
                                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-success">
                                    Skills Used
                                  </p>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {roleSkills.map((skill) => (
                                      <span
                                        key={skill}
                                        className="hover-glow rounded-full border border-accent/30 px-3 py-1 text-xs font-medium text-accent hover:-translate-y-0.5 hover:border-accent hover:bg-accent/10 sm:text-sm"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                                  </>
                                )
                              })()}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          )
        })}
      </div>
    </section>
  )
}
