"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { SectionLabel } from "@/components/ui/SectionLabel";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Metric {
  to: number;
  prefix?: string;
  suffix?: string;
  duration: number;
  label: string;
  sub: string;
}

// ─── Data — exact mapping from spec ───────────────────────────────────────────
const metrics: Metric[] = [
  {
    to: 500,
    suffix: "K+",
    duration: 2.2,
    label: "Lines of Code Written",
    sub: "Across production systems",
  },
  {
    to: 1,
    suffix: "M+",
    duration: 0.7,
    label: "Users Impacted",
    sub: "Monthly active reach",
  },
  {
    to: 40,
    suffix: "+",
    duration: 1.8,
    label: "Deployments Shipped",
    sub: "Zero critical regressions",
  },
  {
    to: 98.9,
    suffix: "%",
    duration: 2.0,
    label: "Uptime Maintained",
    sub: "Across all services",
  },
  {
    to: 12,
    duration: 1.6,
    label: "Open Source Projects",
    sub: "Public & actively maintained",
  },
  {
    to: 5,
    suffix: "+",
    duration: 1.4,
    label: "Countries Reached",
    sub: "Global user footprint",
  },
];

// ─── Animation variants — unchanged from original ─────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.55,
      delay: i * 0.09,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

// ─── Component ─────────────────────────────────────────────────────────────────
export function Metrics() {
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, margin: "-80px" });

  return (
    <section
      id="metrics"
      className="relative mx-auto w-full max-w-6xl px-6 md:pl-28 lg:pl-32 xl:px-8 py-12 sm:py-16"
    >
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-6">
          <SectionLabel
            label="Metrics"
            devLabel="const indicators = outcomes.filter(significant)"
          >
            <p className="text-xs font-mono text-muted-foreground hidden md:block whitespace-nowrap">
              {metrics.length}&nbsp;records returned
            </p>
          </SectionLabel>
        </div>

        {/* ── Grid ── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-accent/10 border border-accent/10 rounded-sm overflow-hidden"
        >
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="relative bg-background p-8 md:p-10 group hover:bg-accent/[0.035] transition-colors duration-300 overflow-hidden"
            >
              {/* Decorative corner mark */}
              <span
                aria-hidden="true"
                className="absolute top-5 right-5 font-mono text-[10px] text-accent/20 select-none group-hover:text-accent/40 transition-colors duration-300"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* ── Animated metric value ── */}
              <p className="font-mono text-5xl md:text-[3.5rem] font-black tracking-tight text-foreground leading-none mb-4">
                <AnimatedCounter
                  to={metric.to}
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                  duration={metric.duration}
                />
              </p>

              {/* Label + sub */}
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/75">
                  {metric.label}
                </p>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {metric.sub}
                </p>
              </div>

              {/* Bottom rule — animates on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-accent/10 group-hover:bg-accent/30 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
