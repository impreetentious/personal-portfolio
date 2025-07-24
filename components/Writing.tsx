"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ScrollReveal } from "@/components/ScrollReveal";
import { showDevFallbacks } from "@/lib/config";
import type { WritingItem } from "@/lib/queries";

const FALLBACK_WRITING_ITEMS: WritingItem[] = [
  {
    id: "1",
    title: "Navigating the AI Inflection Point",
    url: "https://hbr.org",
    year: "2024",
    description:
      "How enterprise leaders can separate signal from noise and build AI strategy that outlasts the hype cycle.",
  },
  {
    id: "2",
    title: "Why Roadmaps Lie",
    url: "https://productcoalition.com",
    year: "2024",
    description:
      "A practitioner's framework for prioritisation that survives first contact with the market — and the CEO.",
  },
  {
    id: "3",
    title: "The Strategy-Tech Gap and How to Close It",
    url: "https://www.fortuneindia.com",
    year: "2023",
    description:
      "Why the best strategy work now requires technical fluency, and a practical path to building it without becoming an engineer.",
  },
  {
    id: "4",
    title: "India's SaaS Moment: Patterns from the First Wave",
    url: "https://www.livemint.com",
    year: "2022",
    description:
      "Structural observations on go-to-market, pricing, and customer success drawn from conversations with forty B2B founders.",
  },
];

type WritingProps = {
  data?: WritingItem[]
}

export function Writing({data}: WritingProps) {
  const writingItems = data?.length ? data : showDevFallbacks ? FALLBACK_WRITING_ITEMS : []

  // Production with no CMS data: hide the section rather than show placeholders.
  if (!writingItems.length) return null

  return (
    <section id="writing" aria-label="Writing" className="relative mx-auto w-full max-w-6xl px-6 md:pl-28 lg:pl-32 xl:px-8 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-2">
          <SectionLabel
            devLabel="JSON.stringify(thoughts, null, 2)"
            label="Writing"
          >
            <p className="text-xs font-mono text-muted-foreground hidden md:block whitespace-nowrap">
              {writingItems.length}&nbsp;{writingItems.length === 1 ? 'article' : 'articles'}
            </p>
          </SectionLabel>
        </div>

        <div className="mt-6 border-t border-white/10">
          {writingItems.map((item, index) => (
            <ScrollReveal key={item.id} delay={index * 0.15}>
              <article className="group border-b border-white/10 pt-6 pb-5">
                
                <div className="flex flex-col md:grid md:grid-cols-[1fr_auto] md:gap-y-4 md:gap-x-8 md:items-baseline">
                  
                  {/* ── 1. Title & Arrow Hyperlink (Row 1, Left) ── */}
                  <div className="md:col-start-1 md:row-start-1 min-w-0">
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="group/link flex w-fit items-start gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                      aria-label={`Read "${item.title}" (opens in new tab)`}
                    >
                      <motion.h3
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-30px" }}
                        transition={{ duration: 0.4, ease: "easeOut", type: "tween", delay: 0.1 }}
                        className="font-mono text-[13px] md:text-sm uppercase tracking-[0.12em] text-white transition-colors duration-300 group-hover/link:text-purple-400"
                      >
                        {item.title}
                      </motion.h3>

                      <motion.span
                        initial={{ opacity: 0, x: -4, y: 4 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true, margin: "-30px" }}
                        transition={{ duration: 0.3, ease: "easeOut", type: "tween", delay: 0.2 }}
                        className="mt-[1px] shrink-0 text-white/20 transition-all duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-purple-400"
                      >
                        <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                      </motion.span>
                    </a>
                  </div>

                  {/* ── 2. Year (Row 1, Right) ── */}
                  <motion.p
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.4, ease: "easeOut", type: "tween", delay: 0.1 }}
                    className="mt-4 md:mt-0 md:col-start-2 md:row-start-1 md:text-right text-sm font-medium uppercase tracking-[0.18em] text-foreground/[0.78]"
                  >
                    {item.year}
                  </motion.p>

                  {/* ── 3. Description (Row 2, Left) ── */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.45, ease: "easeOut", type: "tween", delay: 0.2 }}
                    className="mt-4 md:mt-0 md:col-start-1 md:row-start-2 max-w-4xl lg:max-w-[80%]"
                  >
                    {item.description && (
                      <p className="font-sans text-[13.5px] leading-relaxed text-foreground/70">
                        {item.description}
                      </p>
                    )}
                  </motion.div>

                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
