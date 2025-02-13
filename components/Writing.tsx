"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ScrollReveal } from "@/components/ScrollReveal";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface WritingItem {
  id: number;
  title: string;
  publication: string;
  url: string;
  year: string;
  description?: string;
}

// ─── Data ───────────────────────────────────────────────────────────────────────
const writingItems: WritingItem[] = [
  {
    id: 1,
    title: "Navigating the AI Inflection Point",
    publication: "Harvard Business Review",
    url: "https://hbr.org",
    year: "2024",
    description:
      "How enterprise leaders can separate signal from noise and build AI strategy that outlasts the hype cycle.",
  },
  {
    id: 2,
    title: "Why Roadmaps Lie",
    publication: "Product Coalition",
    url: "https://productcoalition.com",
    year: "2024",
    description:
      "A practitioner's framework for prioritisation that survives first contact with the market — and the CEO.",
  },
  {
    id: 3,
    title: "The Strategy-Tech Gap and How to Close It",
    publication: "Fortune India",
    url: "https://www.fortuneindia.com",
    year: "2023",
    description:
      "Why the best strategy work now requires technical fluency, and a practical path to building it without becoming an engineer.",
  },
  {
    id: 4,
    title: "India's SaaS Moment: Patterns from the First Wave",
    publication: "Mint",
    url: "https://www.livemint.com",
    year: "2022",
    description:
      "Structural observations on go-to-market, pricing, and customer success drawn from conversations with forty B2B founders.",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────────
export function Writing() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 md:pl-28 lg:pl-32 xl:px-8 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-2">
          <SectionLabel
            devLabel="ls ./writing/"
            label="Writing"
          >
            <p className="text-xs font-mono text-muted-foreground hidden md:block whitespace-nowrap">
              {writingItems.length}&nbsp;articles
            </p>
          </SectionLabel>
        </div>

        {/* Cards */}
        <div className="mt-1">
          {writingItems.map((item, index) => (
            <ScrollReveal key={item.id} delay={index * 0.12}>
              {/*
                Cover-link pattern: invisible <a> fills the entire article.
                All motion elements beneath animate normally since
                IntersectionObserver is geometric, not z-index aware.
              */}
              <article className="relative border-t border-accent/10 py-10 md:py-14 group cursor-pointer">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10"
                  aria-label={`Read "${item.title}" on ${item.publication} (opens in new tab)`}
                />

                {/* Year ── absolute top-right */}
                <motion.div
                  initial={{ opacity: 0, x: 14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                    type: "tween",
                    delay: 0.05,
                  }}
                  className="absolute top-10 right-0 md:top-14"
                >
                  <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                    {item.year}
                  </span>
                </motion.div>

                {/* Publication eyebrow ── top-left */}
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
                  {item.publication}
                </motion.p>

                {/*
                  Title ── Film Title Card unmask, same mechanic as Education.
                  overflow-hidden clips the translate so text rises from below.
                  Arrow indicator fades in after the title settles.
                */}
                <div className="mt-5 pr-20 md:pr-32">
                  <div className="overflow-hidden py-1">
                    <motion.h3
                      initial={{ y: "108%", opacity: 0 }}
                      whileInView={{ y: "0%", opacity: 1 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                        type: "tween",
                        delay: 0.11,
                      }}
                      className="text-[clamp(1.55rem,3.6vw,2.9rem)] font-bold text-foreground leading-[1.1] tracking-tight group-hover:text-accent transition-colors duration-300"
                    >
                      {item.title}
                    </motion.h3>
                  </div>

                  {/* Arrow — drifts in diagonally after the title lands */}
                  <motion.div
                    initial={{ opacity: 0, x: -6, y: 6 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                      type: "tween",
                      delay: 0.48,
                    }}
                    className="inline-flex mt-1 text-accent/35 group-hover:text-accent transition-colors duration-200"
                    aria-hidden="true"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </motion.div>
                </div>

                {/* Description ── slides up after the title lands */}
                {item.description && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{
                      duration: 0.45,
                      ease: "easeOut",
                      type: "tween",
                      delay: 0.27,
                    }}
                    className="font-mono text-[12px] leading-[1.85] text-foreground/40 mt-4 max-w-xl"
                  >
                    {item.description}
                  </motion.p>
                )}

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