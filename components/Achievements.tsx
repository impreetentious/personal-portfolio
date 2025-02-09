"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
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
  },
  {
    rank: 2,
    event: "Best Technical Implementation",
    organizer: "AWS Build On",
    date: "Aug 2024",
    notes: "Top of 200+ submissions",
    badge: "silver",
  },
  {
    rank: 3,
    event: "Open Source Excellence Award",
    organizer: "GitHub Universe",
    date: "Oct 2023",
    notes: "Recognised — 15K+ stars",
    badge: "bronze",
  },
  {
    rank: 4,
    event: "Finalist — Product Design Sprint",
    organizer: "Google for Startups",
    date: "Jun 2023",
    notes: "Top 5 of 300 applicants",
  },
  {
    rank: 5,
    event: "Innovation Challenge Winner",
    organizer: "Microsoft Imagine Cup",
    date: "Mar 2023",
    notes: "National qualifier round",
  },
  {
    rank: 6,
    event: "Competitive Programming — Silver",
    organizer: "ICPC Regional",
    date: "Dec 2022",
    notes: "Top 10% regionally",
  },
];

// ─── Style Maps ────────────────────────────────────────────────────────────────
const badgeRingStyle: Record<Badge, string> = {
  gold:   "text-yellow-400   border-yellow-400/40   bg-yellow-400/10",
  silver: "text-slate-300    border-slate-300/40    bg-slate-300/10",
  bronze: "text-amber-600    border-amber-600/40    bg-amber-600/10",
};

const defaultRingStyle =
  "text-muted-foreground border-accent/20 bg-transparent";

const badgeGlyph: Record<Badge, string> = {
  gold:   "◈",
  silver: "◇",
  bronze: "○",
};

// ─── Animation Variants ────────────────────────────────────────────────────────
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
    },
  },
};

// ─── Component ─────────────────────────────────────────────────────────────────
export function Achievements() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapperRef, { once: true, margin: "-60px" });

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

        {/* ── Table — single element is both scroll container and border frame ── */}
        <div
          ref={wrapperRef}
          className="w-full overflow-x-auto rounded-sm border border-accent/10 pb-0.5"
        >
          <table className="w-full min-w-[600px] text-sm border-collapse">

            {/* Table head */}
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

            {/* Animated table body */}
            <motion.tbody
              variants={tbodyVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              {achievements.map((item) => {
                const ringClass = item.badge
                  ? badgeRingStyle[item.badge]
                  : defaultRingStyle;

                return (
                  <motion.tr
                    key={item.rank}
                    variants={rowVariants}
                    className="border-b border-accent/[0.07] last:border-0 group hover:bg-accent/[0.04] transition-colors duration-200"
                  >
                    {/* ── Rank cell ── */}
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
                            className={`text-sm leading-none hidden sm:inline ${ringClass.split(" ")[0]}`}
                          >
                            {badgeGlyph[item.badge]}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* ── Event cell ── */}
                    <td className="py-5 px-5">
                      <span className="font-medium text-foreground text-[13px] leading-snug group-hover:text-accent transition-colors duration-200">
                        {item.event}
                      </span>
                    </td>

                    {/* ── Organizer cell (desktop only) ── */}
                    <td className="py-5 px-5 hidden md:table-cell">
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {item.organizer}
                      </span>
                    </td>

                    {/* ── Date / Notes cell ── */}
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
                  </motion.tr>
                );
              })}
            </motion.tbody>
          </table>
        </div>

      </div>
    </section>
  );
}