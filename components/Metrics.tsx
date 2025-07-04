"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { MetricItem } from "@/lib/queries";

// ─── Data — exact mapping from spec ───────────────────────────────────────────
const FALLBACK_METRICS: MetricItem[] = [
  {
    value: 500,
    suffix: "K+",
    label: "Lines of Code Written",
    sub: "Across production systems",
  },
  {
    value: 1,
    suffix: "M+",
    label: "Users Impacted",
    sub: "Monthly active reach",
  },
  {
    value: 40,
    suffix: "+",
    label: "Deployments Shipped",
    sub: "Zero critical regressions",
  },
  {
    value: 98.9,
    suffix: "%",
    label: "Uptime Maintained",
    sub: "Across all services",
  },
  {
    value: 12,
    label: "Open Source Projects",
    sub: "Public & actively maintained",
  },
  {
    value: 5,
    suffix: "+",
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
function getMetricDuration(value: number) {
  if (value >= 500) return 2.2
  if (value >= 100) return 2
  if (value >= 40) return 1.8
  if (value >= 10) return 1.6
  return 1.2
}

type MetricsProps = {
  data?: MetricItem[]
}

export function Metrics({data}: MetricsProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, margin: "-80px" });
  const metrics = data?.length ? data : FALLBACK_METRICS

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
              {metrics.length}&nbsp;{metrics.length === 1 ? 'record' : 'records'} returned
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
              {/* Top accent gradient line — appears on hover */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none z-10"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, #00C8FF 30%, #00C8FF 70%, transparent 100%)',
                }}
              />
              {/* Scan beam — slides down on hover */}
              <div
                aria-hidden="true"
                className="absolute inset-0 overflow-hidden pointer-events-none z-0"
              >
                <div
                  className="scan-beam-inner absolute inset-x-0 -top-20 h-20"
                  style={{
                    background: 'linear-gradient(180deg, transparent 0%, rgba(0,200,255,0.05) 50%, transparent 100%)',
                  }}
                />
              </div>

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
                  to={metric.value}
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                  duration={getMetricDuration(metric.value)}
                />
              </p>

              {/* Label + sub */}
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/75">
                  {metric.label}
                </p>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {metric.sub ?? ""}
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
