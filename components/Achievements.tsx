"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";

// ─── Types ─────────────────────────────────────────────────────────────────────
type Badge = "gold" | "silver" | "bronze";

interface Achievement {
  rank: number;
  event: string;
  organizer: string;
  date: string;
  notes: string;
  badge?: Badge;
  description?: string;
}

// ─── Fallback Data ─────────────────────────────────────────────────────────────
const achievements: Achievement[] = [
  {
    rank: 1,
    event: "National Hackathon Championship",
    organizer: "TechCrunch Disrupt",
    date: "Nov 2024",
    notes: "1st of 400+ teams",
    badge: "gold",
    description:
      "Built a real-time collaborative AI code editor in 36 hours. The submission featured live pair-programming with GPT-4 integration, conflict-free merge resolution, and a sandboxed preview environment. Judges highlighted the product polish and live demo stability across 400+ competing teams.",
  },
  {
    rank: 2,
    event: "Best Technical Implementation",
    organizer: "AWS Build On",
    date: "Aug 2024",
    notes: "Top of 200+ submissions",
    badge: "silver",
    description:
      "Architected a serverless event-driven pipeline on AWS Lambda, SQS, and DynamoDB that processed 1M+ telemetry events per day at sub-50ms p99 latency. Recognised for infrastructure-as-code discipline, cost efficiency, and zero-downtime blue-green deployment strategy.",
  },
  {
    rank: 3,
    event: "Open Source Excellence Award",
    organizer: "GitHub Universe",
    date: "Oct 2023",
    notes: "Recognised — 15K+ stars",
    badge: "bronze",
    description:
      "A developer utility library for composing type-safe API clients with auto-generated TypeScript bindings. Adopted by teams at multiple YC-backed startups. Recognised for documentation quality, semantic versioning discipline, and active community maintenance.",
  },
  {
    rank: 4,
    event: "Finalist — Product Design Sprint",
    organizer: "Google for Startups",
    date: "Jun 2023",
    notes: "Top 5 of 300 applicants",
    description:
      "Competed in a five-day design sprint focused on consumer fintech accessibility. Delivered a high-fidelity prototype with a novel onboarding flow that cut task completion time by 38% in usability testing. Selected as one of five finalists from over 300 global applicants.",
  },
  {
    rank: 5,
    event: "Innovation Challenge Winner",
    organizer: "Microsoft Imagine Cup",
    date: "Mar 2023",
    notes: "National qualifier round",
    description:
      "Presented an AI-powered accessibility tool that converts on-screen content into contextual audio descriptions for low-vision users. Won the national qualifier round and advanced to the regional semi-finals, built with Azure Cognitive Services and a React Native shell.",
  },
  {
    rank: 6,
    event: "Competitive Programming — Silver",
    organizer: "ICPC Regional",
    date: "Dec 2022",
    notes: "Top 10% regionally",
    description:
      "Placed in the top 10% of contestants at the ICPC Asia Regional contest, solving 5 of 12 problems under time constraints. Problems spanned graph theory, dynamic programming, and computational geometry. Competed as part of a three-person team representing Chandigarh University.",
  },
];

// ─── Style Maps ─────────────────────────────────────────────────────────────────
const badgeRingStyle: Record<Badge, string> = {
  gold:   "text-yellow-400  border-yellow-400/40  bg-yellow-400/10",
  silver: "text-slate-300   border-slate-300/40   bg-slate-300/10",
  bronze: "text-amber-600   border-amber-600/40   bg-amber-600/10",
};

const defaultRingStyle = "text-muted-foreground border-accent/20 bg-transparent";

const badgeGlyph: Record<Badge, string> = {
  gold:   "◈",
  silver: "◇",
  bronze: "○",
};

// ─── Animation Variants ──────────────────────────────────────────────────────────
const tbodyVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.075 },
  },
};

const rowVariants = {
  hidden: {
    opacity: 0,
    x: -20,
    filter: "blur(5px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "tween" as const,
    },
  },
};

// ─── Component ───────────────────────────────────────────────────────────────────
export function Achievements() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapperRef, { once: true, margin: "-60px" });
  const [activeRank, setActiveRank] = useState<number | null>(null);

  function toggle(rank: number) {
    setActiveRank((current) => (current === rank ? null : rank));
  }

  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 md:pl-28 lg:pl-32 xl:px-8 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
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

        {/* ── Table ── */}
        <div
          ref={wrapperRef}
          className="w-full overflow-x-auto rounded-sm border border-accent/10 pb-0.5"
        >
          <table className="w-full min-w-[600px] text-sm border-collapse">

            {/* Head */}
            <thead>
              <tr className="border-b border-accent/10 bg-accent/[0.03]">
                <th
                  scope="col"
                  className="py-3 px-5 text-left font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground w-20"
                >
                  Rank
                </th>
                <th
                  scope="col"
                  className="py-3 px-5 text-left font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
                >
                  Event
                </th>
                <th
                  scope="col"
                  className="py-3 px-5 text-left font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground hidden md:table-cell"
                >
                  Organizer
                </th>
                <th
                  scope="col"
                  className="py-3 px-5 text-right font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground w-36"
                >
                  Date&nbsp;/&nbsp;Notes
                </th>
              </tr>
            </thead>

            {/* Animated body — flatMap so stagger only touches motion.tr children */}
            <motion.tbody
              variants={tbodyVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              {achievements.flatMap((item, idx) => {
                const isOpen = activeRank === item.rank;
                const isLast = idx === achievements.length - 1;
                const isExpandable = !!item.description;
                const ringClass = item.badge
                  ? badgeRingStyle[item.badge]
                  : defaultRingStyle;

                // Last row: hide bottom border when collapsed so it doesn't
                // double-stack against the table wrapper's border.
                const rowBorderClass =
                  isLast && !isOpen ? "" : "border-b border-accent/[0.07]";

                return [
                  // ── Main clickable row ──────────────────────────────────────
                  <motion.tr
                    key={item.rank}
                    variants={rowVariants}
                    onClick={() => isExpandable && toggle(item.rank)}
                    onKeyDown={(e) => {
                      if (
                        isExpandable &&
                        (e.key === "Enter" || e.key === " ")
                      ) {
                        e.preventDefault();
                        toggle(item.rank);
                      }
                    }}
                    tabIndex={isExpandable ? 0 : undefined}
                    aria-expanded={isExpandable ? isOpen : undefined}
                    className={[
                      rowBorderClass,
                      "group transition-colors duration-200",
                      isExpandable
                        ? "cursor-pointer hover:bg-accent/[0.04] focus-visible:outline-none focus-visible:bg-accent/[0.06]"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {/* Rank */}
                    <td className="py-5 px-5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`font-mono text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-full border shrink-0 ${ringClass}`}
                        >
                          {item.rank}
                        </span>
                        {item.badge && (
                          <span
                            aria-hidden="true"
                            className={`text-sm leading-none hidden sm:inline ${
                              ringClass.split(" ")[0]
                            }`}
                          >
                            {badgeGlyph[item.badge]}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Event + chevron */}
                    <td className="py-5 px-5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground text-[13px] leading-snug group-hover:text-accent transition-colors duration-200">
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

                    {/* Organizer (desktop only) */}
                    <td className="py-5 px-5 hidden md:table-cell">
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {item.organizer}
                      </span>
                    </td>

                    {/* Date / Notes */}
                    <td className="py-5 px-5 text-right">
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="font-mono text-[11px] text-foreground/70 tabular-nums">
                          {item.date}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {item.notes}
                        </span>
                      </div>
                    </td>
                  </motion.tr>,

                  // ── Expanded content row ────────────────────────────────────
                  // Plain <tr> — intentionally not a motion element so it is
                  // invisible to the stagger counter above.
                  <tr key={`${item.rank}-exp`}>
                    <td colSpan={4} className="p-0">
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
                            className="overflow-hidden"
                          >
                            {/* Inner wrapper — border-t separates from header row;
                                border-b separates from next row when not last */}
                            <div
                              className={[
                                "px-5 py-5 bg-accent/[0.02] border-t border-accent/10",
                                !isLast ? "border-b border-accent/[0.07]" : "",
                              ]
                                .filter(Boolean)
                                .join(" ")}
                            >
                              {/* Organizer pill — visible on mobile where the
                                  table column is hidden */}
                              <p className="font-mono text-[10px] text-accent/60 mb-2.5 uppercase tracking-[0.18em] md:hidden">
                                {item.organizer}
                              </p>

                              <p className="font-mono text-[12px] leading-[1.85] text-foreground/60 max-w-3xl">
                                {item.description}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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