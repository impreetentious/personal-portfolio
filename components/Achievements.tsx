"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { ChevronDown, Award } from "lucide-react";
import { useRef, useState } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface Achievement {
  id: string;
  event: string;
  organizer: string;
  date: string;
  notes: string;
  description?: string;
}

const achievements: Achievement[] = [
  {
    id: "hackathon-2024",
    event: "National Hackathon Championship",
    organizer: "TechCrunch Disrupt",
    date: "Nov 2024",
    notes: "1st of 400+ teams",
    description:
      "Built a real-time collaborative AI code editor in 36 hours. The submission featured live pair-programming with GPT-4 integration, conflict-free merge resolution, and a sandboxed preview environment. Judges highlighted the product polish and live demo stability across 400+ competing teams.",
  },
  {
    id: "aws-build-2024",
    event: "Best Technical Implementation",
    organizer: "AWS Build On",
    date: "Aug 2024",
    notes: "Top of 200+ submissions",
    description:
      "Architected a serverless event-driven pipeline on AWS Lambda, SQS, and DynamoDB that processed 1M+ telemetry events per day at sub-50ms p99 latency. Recognised for infrastructure-as-code discipline, cost efficiency, and zero-downtime blue-green deployment strategy.",
  },
  {
    id: "github-os-2023",
    event: "Open Source Excellence Award",
    organizer: "GitHub Universe",
    date: "Oct 2023",
    notes: "Recognised — 15K+ stars",
    description:
      "A developer utility library for composing type-safe API clients with auto-generated TypeScript bindings. Adopted by teams at multiple YC-backed startups. Recognised for documentation quality, semantic versioning discipline, and active community maintenance.",
  },
  {
    id: "google-sprint-2023",
    event: "Finalist — Product Design Sprint",
    organizer: "Google for Startups",
    date: "Jun 2023",
    notes: "Top 5 of 300 applicants",
    description:
      "Competed in a five-day design sprint focused on consumer fintech accessibility. Delivered a high-fidelity prototype with a novel onboarding flow that cut task completion time by 38% in usability testing. Selected as one of five finalists from over 300 global applicants.",
  },
];

const tbodyVariants = {
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

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
      ease: "easeOut",
      type: "tween" as const,
    },
  },
};

export function Achievements() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapperRef, { once: true, margin: "-60px" });
  const [activeId, setActiveId] = useState<string | null>(null);

  function toggle(id: string) {
    setActiveId((current) => (current === id ? null : id));
  }

  return (
    <section id="achievements" className="relative mx-auto w-full max-w-6xl px-6 md:pl-28 lg:pl-32 xl:px-8 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <SectionLabel
            devLabel='git tag -l "award-*"'
            label="Achievements"
          >
            <p className="text-xs font-mono text-muted-foreground hidden md:block whitespace-nowrap">
              {achievements.length}&nbsp;tags found
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
              animate={inView ? "visible" : "hidden"}
            >
              {achievements.flatMap((item, idx) => {
                const isOpen = activeId === item.id;
                const isLast = idx === achievements.length - 1;
                const isExpandable = !!item.description;

                const rowBorderClass =
                  isLast && !isOpen ? "" : "border-b border-accent/[0.07]";

                return [
                  <motion.tr
                    key={item.id}
                    variants={rowVariants}
                    onClick={() => isExpandable && toggle(item.id)}
                    className={[
                      rowBorderClass,
                      "group transition-colors duration-200",
                      isExpandable ? "cursor-pointer hover:bg-accent/[0.04] has-[:focus-visible]:bg-accent/[0.06] has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-inset has-[:focus-visible]:ring-accent" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <td className="py-5 px-5 relative">
                      {isExpandable && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggle(item.id);
                          }}
                          aria-expanded={isOpen}
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
                              ease: "easeOut",
                              type: "tween",
                            }}
                            className="text-accent/40 group-hover:text-accent transition-colors duration-200 shrink-0"
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
                      {/* FIX E: intermediate block wrapper so motion.div is not a direct child of td, fixing Safari/Firefox height collapse */}
                      <div>
                        <AnimatePresence initial={false}>
                          {isOpen && item.description && (
                            <motion.div
                              key="content"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: 0.28,
                                ease: "easeInOut",
                                type: "tween",
                              }}
                              className="overflow-hidden relative"
                            >
                              <motion.div
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                exit={{ scaleY: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                                className="absolute left-0 top-0 bottom-0 w-[2px] origin-top bg-gradient-to-b from-accent via-accent/50 to-transparent z-10"
                              />

                              <div
                                className={[
                                  "px-5 py-5 bg-accent/[0.02] border-t border-accent/10",
                                  !isLast ? "border-b border-accent/[0.07]" : "",
                                ]
                                  .filter(Boolean)
                                  .join(" ")}
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
                ];
              })}
            </motion.tbody>
          </table>
        </div>
      </div>
    </section>
  );
}