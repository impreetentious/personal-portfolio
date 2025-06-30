"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { EducationItem } from "@/lib/queries";

// ─── Configuration ────────────────────────────────────────────────────────────

const SHOW_GPA = true; // Toggle this to false to hide GPAs globally

const FALLBACK_EDUCATION_ITEMS: EducationItem[] = [
  {
    institution: 'Chandigarh University',
    degree: 'Bachelor of Engineering in Computer Science',
    years: '2019 - 2023',
    gpa: 'CGPA 8.7 / 10',
  },
  {
    institution: 'Indian School of Business',
    degree: 'Post Graduate Programme in Management',
    years: '2025 - 2026',
    gpa: 'GPA 3.9 / 4.0', // Example placeholder
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

type EducationProps = {
  data?: EducationItem[]
}

export function Education({data}: EducationProps) {
  const educationItems = data?.length ? data : FALLBACK_EDUCATION_ITEMS

  return (
    <section
      id="education"
      className="relative mx-auto w-full max-w-6xl px-6 md:pl-28 lg:pl-32 xl:px-8 py-12 sm:py-16"
    >
      <SectionLabel
        label="Education"
        devLabel="Promise.all([degrees])"
      />

      <div className="mt-6 border-t border-white/10">
        {educationItems.map((item, index) => (
          <ScrollReveal key={`${item.institution}-${item.years}`} delay={index * 0.15}>
            <article className="group border-b border-white/10 pt-6 pb-5">
              <div className="flex flex-col md:grid md:grid-cols-[1fr_auto] md:gap-y-4 md:gap-x-8 md:items-baseline">
                
                <motion.h3 
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, ease: "easeOut", type: "tween", delay: 0.1 }}
                  className="md:col-start-1 md:row-start-1 text-xl font-semibold text-white transition-colors duration-300 group-hover:text-success"
                >
                  {item.institution}
                </motion.h3>

                <motion.p 
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, ease: "easeOut", type: "tween", delay: 0.15 }}
                  className="mt-4 md:mt-0 md:col-start-2 md:row-start-1 md:text-right text-sm font-medium uppercase tracking-[0.18em] text-foreground/78"
                >
                  {item.years}
                </motion.p>

                <motion.p 
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.45, ease: "easeOut", type: "tween", delay: 0.2 }}
                  className="mt-4 md:mt-0 md:col-start-1 md:row-start-2 max-w-2xl font-mono text-[13px] leading-relaxed text-foreground/70"
                >
                  {item.degree}
                </motion.p>

                {SHOW_GPA && item.gpa && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.4, ease: "easeOut", type: "tween", delay: 0.3 }}
                    className="mt-1 md:mt-0 md:col-start-2 md:row-start-2 md:text-right font-mono text-[11px] tracking-wide text-foreground/40"
                  >
                    {item.gpa}
                  </motion.p>
                )}
                
              </div>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
