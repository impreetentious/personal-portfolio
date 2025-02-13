"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ScrollReveal } from "@/components/ScrollReveal";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface EducationItem {
  id: number;
  institution: string;
  degree: string;
  field: string;
  period: string;
  gpa?: string;
  highlights?: string[];
}

// ─── Data ───────────────────────────────────────────────────────────────────────
const educationItems: EducationItem[] = [
  {
    id: 1,
    institution: "Indian School of Business",
    degree: "Post Graduate Programme",
    field: "Management · Strategy & Finance",
    period: "2019 — 2021",
    gpa: "GPA 3.9 / 4.0",
    highlights: [
      "Consulting Club Case Lead",
      "Dean's Merit List",
      "ISB YLP Scholar",
    ],
  },
  {
    id: 2,
    institution: "Thapar Institute of Engineering & Technology",
    degree: "Bachelor of Technology",
    field: "Computer Science & Engineering",
    period: "2015 — 2019",
    gpa: "CGPA 8.7 / 10",
    highlights: [
      "Institute Silver Medallist",
      "ACM Student Chapter Lead",
      "Ranked 1st in Final Year",
    ],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────────
export function Education() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 md:pl-28 lg:pl-32 xl:px-8 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-2">
          <SectionLabel
            devLabel="cat ./education.json"
            label="Education"
          />
        </div>

        {/* Cards */}
        <div className="mt-1">
          {educationItems.map((item, index) => (
            // ScrollReveal provides the outer entrance cascade (Change 5)
            <ScrollReveal key={item.id} delay={index * 0.12}>
              <article className="relative border-t border-accent/10 py-12 md:py-16 group overflow-hidden">

                {/* Year ── absolute top-right, drifts in from the right */}
                <motion.div
                  initial={{ opacity: 0, x: 14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                    type: "tween",
                    delay: 0.06,
                  }}
                  className="absolute top-12 right-0 md:top-16"
                >
                  <span className="font-mono text-[11px] text-muted-foreground tabular-nums tracking-[0.06em]">
                    {item.period}
                  </span>
                </motion.div>

                {/* Institution label ── small tracked eyebrow at top-left */}
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.35,
                    ease: "easeOut",
                    type: "tween",
                    delay: 0.02,
                  }}
                  className="font-mono text-[10px] uppercase tracking-[0.26em] text-accent/55 flex items-center gap-2.5"
                >
                  <span
                    className="inline-block w-3 h-px bg-accent/35 shrink-0"
                    aria-hidden="true"
                  />
                  {item.institution}
                </motion.p>

                {/*
                  Degree title ── Film Title Card hero moment.
                  overflow-hidden clips the translate so the text unmasks
                  upward from below the container edge.
                */}
                <div className="overflow-hidden mt-7 pr-24 md:pr-36 py-1">
                  <motion.h3
                    initial={{ y: "108%", opacity: 0 }}
                    whileInView={{ y: "0%", opacity: 1 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{
                      duration: 0.72,
                      ease: [0.22, 1, 0.36, 1],
                      type: "tween",
                      delay: 0.13,
                    }}
                    className="text-[clamp(1.9rem,4.8vw,3.6rem)] font-bold text-foreground leading-[1.05] tracking-tight"
                  >
                    {item.degree}
                  </motion.h3>
                </div>

                {/* Field ── slides in slightly after the title lands */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.45,
                    ease: "easeOut",
                    type: "tween",
                    delay: 0.29,
                  }}
                  className="font-mono text-sm text-foreground/40 mt-2.5 tracking-[0.02em]"
                >
                  {item.field}
                </motion.p>

                {/*
                  Bottom row ── highlights pushed left, GPA anchored far-right.
                  Extreme spacing echoes the Film Title Card asymmetry.
                */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                    type: "tween",
                    delay: 0.42,
                  }}
                  className="mt-7 md:mt-9 flex items-end justify-between gap-6"
                >
                  {item.highlights && (
                    <ul className="flex flex-wrap gap-x-5 gap-y-1.5 max-w-lg">
                      {item.highlights.map((h) => (
                        <li
                          key={h}
                          className="font-mono text-[11px] text-muted-foreground flex items-center gap-1.5"
                        >
                          <span className="text-accent/30 select-none" aria-hidden="true">
                            —
                          </span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}

                  {item.gpa && (
                    <span className="font-mono text-[11px] text-foreground/40 whitespace-nowrap shrink-0 tabular-nums">
                      {item.gpa}
                    </span>
                  )}
                </motion.div>

              </article>
            </ScrollReveal>
          ))}

          {/* Closing rule */}
          <div className="border-t border-accent/10" aria-hidden="true" />
        </div>

      </div>
    </section>
  );
}