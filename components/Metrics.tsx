"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { showDevFallbacks } from "@/lib/config";
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

const MAX_TILT_DEG = 5

function TiltCard({
  index,
  inView,
  className,
  children,
}: {
  index: number
  inView: boolean
  className: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springRotateX = useSpring(rotateX, { stiffness: 260, damping: 20 })
  const springRotateY = useSpring(rotateY, { stiffness: 260, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rotateY.set(px * MAX_TILT_DEG)
    rotateX.set(-py * MAX_TILT_DEG)
  }

  const resetTilt = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      style={{ rotateX: springRotateX, rotateY: springRotateY }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function Metrics({data}: MetricsProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, margin: "-80px" });
  const metrics = data?.length ? data : showDevFallbacks ? FALLBACK_METRICS : []

  // Production with no CMS data: hide the section rather than show placeholders.
  if (!metrics.length) return null

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
          style={{ perspective: 1200 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-accent/10 border border-accent/10 rounded-sm overflow-hidden"
        >
          {metrics.map((metric, i) => (
            <TiltCard
              key={metric.label}
              index={i}
              inView={inView}
              className="relative bg-background p-8 md:p-10 group hover:bg-accent/[0.035] transition-colors duration-300 overflow-hidden"
            >
              {/* Top accent gradient line — appears on hover */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none z-10"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, #38BDF8 30%, #38BDF8 70%, transparent 100%)',
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
                    background: 'linear-gradient(180deg, transparent 0%, rgba(56,189,248,0.05) 50%, transparent 100%)',
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
            </TiltCard>
          ))}
        </div>

      </div>
    </section>
  );
}
