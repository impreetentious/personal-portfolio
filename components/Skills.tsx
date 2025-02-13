"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ScrollReveal } from "@/components/ScrollReveal";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface SkillCategory {
  label: string;
  skills: string[];
}

// ─── Data ───────────────────────────────────────────────────────────────────────
const leftColumn: SkillCategory[] = [
  {
    label: "Strategy & Growth",
    skills: [
      "Corporate Strategy",
      "Market Entry",
      "M&A Advisory",
      "Go-to-Market",
      "Business Cases",
      "Competitive Analysis",
    ],
  },
  {
    label: "Product Management",
    skills: [
      "Product Vision",
      "Roadmapping",
      "OKRs & Metrics",
      "User Research",
      "Stakeholder Alignment",
      "PRDs & Specs",
    ],
  },
  {
    label: "Finance",
    skills: [
      "Financial Modelling",
      "DCF Valuation",
      "P&L Management",
      "Scenario Planning",
      "Unit Economics",
    ],
  },
];

const rightColumn: SkillCategory[] = [
  {
    label: "Engineering",
    skills: [
      "TypeScript",
      "React / Next.js",
      "Node.js",
      "REST APIs",
      "SQL",
      "Git",
    ],
  },
  {
    label: "Design & UX",
    skills: [
      "Figma",
      "Design Systems",
      "Wireframing",
      "Prototyping",
      "Framer",
    ],
  },
  {
    label: "Data & Analytics",
    skills: [
      "Python",
      "Power BI",
      "A/B Testing",
      "Cohort Analysis",
      "Mixpanel",
    ],
  },
];

// ─── Chip animation variants ────────────────────────────────────────────────────
// Uses `custom` (catIdx) to offset delayChildren per category row
const chipContainerVariants = {
  hidden: {},
  visible: (catIdx: number) => ({
    transition: {
      staggerChildren: 0.045,
      delayChildren: catIdx * 0.07,
    },
  }),
};

const chipVariants = {
  hidden: { opacity: 0, scale: 0.85, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.3, ease: "easeOut", type: "tween" as const },
  },
};

// ─── Internal column component ──────────────────────────────────────────────────
function SkillColumn({ categories }: { categories: SkillCategory[] }) {
  return (
    <div className="flex flex-col gap-9">
      {categories.map((cat, catIdx) => (
        <div key={cat.label}>
          {/* Category label */}
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent/60 mb-4 flex items-center gap-2.5">
            <span
              className="inline-block w-4 h-px bg-accent/35 shrink-0"
              aria-hidden="true"
            />
            {cat.label}
          </p>

          {/* Chip grid — staggered via whileInView + variants */}
          <motion.div
            className="flex flex-wrap gap-2"
            variants={chipContainerVariants}
            custom={catIdx}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
          >
            {cat.skills.map((skill) => (
              <motion.span
                key={skill}
                variants={chipVariants}
                className="font-mono text-[11px] px-3 py-1.5 rounded-sm border border-accent/15 bg-accent/[0.05] text-foreground/65 hover:border-accent/40 hover:text-accent hover:bg-accent/10 transition-colors duration-200 cursor-default select-none"
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────────
export function Skills() {
  const columns = [leftColumn, rightColumn];

  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 md:pl-28 lg:pl-32 xl:px-8 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <SectionLabel
            devLabel="const skills = {...}"
            label="Skills"
          />
        </div>

        {/* Two-column grid — each column gets a ScrollReveal with index * 0.15 delay */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {columns.map((col, colIdx) => (
            <ScrollReveal key={colIdx} delay={colIdx * 0.15}>
              <SkillColumn categories={col} />
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}