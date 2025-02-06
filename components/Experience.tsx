'use client'

import {AnimatePresence, motion, useScroll, useSpring} from 'framer-motion'
import {ChevronDown, MapPin} from 'lucide-react'
import {useRef, useState} from 'react'

type ExperienceItem = {
  company: string
  role: string
  location: string
  dates: string
  bulletPoints: string[]
  skillsUsed: string[]
  isHidden: boolean
}

const experienceItems: ExperienceItem[] = [
  {
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
    isHidden: false,
  },
  {
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
    isHidden: false,
  },
  {
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
    isHidden: false,
  },
]

export function Experience() {
  const [activeCompany, setActiveCompany] = useState<string | null>(
    experienceItems[0]?.company ?? null
  )
  const timelineRef = useRef<HTMLDivElement>(null)
  const {scrollYProgress} = useScroll({
    target: timelineRef,
    offset: ['start 75%', 'end 35%'],
  })
  const timelineProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    mass: 0.35,
  })

  const visibleItems = experienceItems.filter((item) => !item.isHidden)

  return (
    <section
      id="experience"
      className="mx-auto max-w-6xl border-t border-accent/15 py-12"
    >
      <p className="text-sm uppercase tracking-[0.3em] text-accent">Experience</p>
      <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
        Selected roles and the work behind them
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-foreground/78">
        Each card expands to reveal impact highlights and the tools used across
        the role.
      </p>

      <div ref={timelineRef} className="relative mt-8 pl-8 sm:pl-12">
        <div className="absolute bottom-0 left-1 top-0 w-px bg-white/10 sm:left-2" />
        <motion.div
          style={{scaleY: timelineProgress}}
          className="absolute bottom-0 left-1 top-0 w-px origin-top bg-gradient-to-b from-[#4ea8f8] via-[#4ea8f8] to-[#f97316] shadow-[0_0_18px_rgba(78,168,248,0.55)] sm:left-2"
        />
        {visibleItems.map((item) => {
          const isOpen = activeCompany === item.company

          return (
            <div
              key={`${item.company}-${item.role}`}
              className="relative overflow-visible border-t border-white/10 last:border-b"
            >
              <span className="absolute -left-[2.12rem] top-8 h-2.5 w-2.5 rounded-full border border-accent bg-[#07070f] shadow-[0_0_16px_rgba(78,168,248,0.65)] sm:-left-[2.84rem]" />
              <button
                type="button"
                onClick={() =>
                  setActiveCompany((current) =>
                    current === item.company ? null : item.company
                  )
                }
                className="hover-glow flex w-full flex-col gap-4 px-3 py-6 text-left hover:bg-accent/[0.035] md:flex-row md:items-start md:justify-between"
                aria-expanded={isOpen}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-white sm:text-2xl">
                      {item.company}
                    </h3>
                    <motion.span
                      animate={{rotate: isOpen ? 180 : 0}}
                      transition={{duration: 0.2, ease: 'easeOut'}}
                      className="text-accent"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.span>
                  </div>
                  <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-success">
                    {item.role}
                  </p>
                </div>

                <p className="shrink-0 text-left text-sm font-medium text-foreground/78 md:min-w-40 md:text-right">
                  {item.dates}
                </p>
              </button>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    key="content"
                    initial={{height: 0, opacity: 0}}
                    animate={{height: 'auto', opacity: 1}}
                    exit={{height: 0, opacity: 0}}
                    transition={{duration: 0.28, ease: 'easeInOut'}}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-accent/10 pb-8 pt-6">
                      <div className="flex items-center gap-2 text-sm text-foreground/72">
                        <MapPin className="h-4 w-4 text-accent" />
                        <span>{item.location}</span>
                      </div>

                      <ul className="mt-5 space-y-3">
                        {item.bulletPoints.map((point) => (
                          <li
                            key={point}
                            className="flex gap-3 text-sm leading-7 text-foreground/86 sm:text-base"
                          >
                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6">
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-success">
                          Skills Used
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.skillsUsed.map((skill) => (
                            <span
                              key={skill}
                              className="hover-glow rounded-full border border-accent/30 px-3 py-1 text-xs font-medium text-accent hover:-translate-y-0.5 hover:border-accent hover:bg-accent/10 sm:text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
