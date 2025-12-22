import type {
  AchievementItem,
  EducationItem,
  ExperienceItem,
  MetricItem,
  SkillsEntry,
  WritingItem,
} from './queries'

/**
 * Pure helpers for P8 career-fallback gating.
 *
 * Production stays blank on CMS miss until the owner vets real copy and flips
 * NEXT_PUBLIC_USE_CAREER_FALLBACKS=true. Development always shows the slots so
 * layout work does not require a live CMS.
 */
export function shouldUseCareerFallbacks(opts: {
  nodeEnv: string | undefined
  envFlag: string | undefined
}): boolean {
  return opts.nodeEnv !== 'production' || opts.envFlag === 'true'
}

/**
 * Prefer CMS data when present; otherwise serve fallbacks when the gate allows.
 * An empty successful CMS array is treated the same as a miss — that is the
 * runtime mitigation for ISR revalidation that succeeds with no documents.
 */
export function resolveSectionData<T>(
  cmsData: T[] | null | undefined,
  fallback: T[],
  useFallbacks: boolean,
): T[] {
  if (cmsData?.length) return cmsData
  if (useFallbacks) return fallback
  return []
}

/**
 * Empty array results at production runtime must not replace a previously good
 * ISR generation. Build-time empties are allowed (first deploy / smoke); the
 * refusal applies only after the site is serving.
 */
export function shouldRejectEmptyCmsResult(opts: {
  result: unknown
  nodeEnv: string | undefined
  nextPhase: string | undefined
}): boolean {
  return (
    Array.isArray(opts.result) &&
    opts.result.length === 0 &&
    opts.nodeEnv === 'production' &&
    opts.nextPhase !== 'phase-production-build'
  )
}

export class EmptyCmsResultError extends Error {
  constructor(message = '[sanityFetch] refusing empty CMS array at runtime') {
    super(message)
    this.name = 'EmptyCmsResultError'
  }
}

/**
 * P8 career fallback content — owner slots.
 *
 * Replace each section's items with vetted real career facts, then flip
 * NEXT_PUBLIC_USE_CAREER_FALLBACKS=true. Until then these remain development
 * layout placeholders (fictional scaffolding, not production credentials).
 *
 * Do not invent new career facts here; only the owner supplies real copy.
 */
export const careerFallbacks = {
  // OWNER_SLOT: Experience — replace with vetted roles/companies.
  experience: [
    {
      id: 'fallback-open-systems-lab',
      company: 'Open Systems Lab',
      role: 'Software Engineer',
      location: 'Remote',
      dates: '2024 - Present',
      bulletPoints: [
        'Built interactive frontend features for product dashboards and internal tooling.',
        'Collaborated across design and engineering to translate rough ideas into polished user experiences.',
        'Improved maintainability by organizing reusable components and shared UI patterns.',
      ],
      skillsUsed: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    },
    {
      id: 'fallback-northstar-digital',
      company: 'Northstar Digital',
      role: 'Frontend Developer',
      location: 'Chandigarh, India',
      dates: '2022 - 2024',
      bulletPoints: [
        'Developed responsive interfaces with a strong focus on smooth interactions and accessibility.',
        'Worked closely with stakeholders to convert business requirements into production-ready releases.',
        'Maintained design consistency across landing pages, product surfaces, and content modules.',
      ],
      skillsUsed: ['React', 'JavaScript', 'CSS', 'REST APIs'],
    },
    {
      id: 'fallback-freelance',
      company: 'Freelance',
      role: 'Web Developer',
      location: 'Remote',
      dates: '2020 - 2022',
      bulletPoints: [
        'Delivered portfolio sites and business websites with custom sections, animation, and CMS integrations.',
        'Managed end-to-end implementation from layout planning to deployment handoff.',
        'Created flexible content structures so clients could update text without technical support.',
      ],
      skillsUsed: ['Sanity.io', 'Node.js', 'Deployment', 'UI Architecture'],
    },
  ] satisfies ExperienceItem[],

  // OWNER_SLOT: Skills — replace with vetted tools/skills.
  skills: [
    {
      category: 'Tools',
      items: [
        {
          name: 'Next.js',
          description:
            'React framework for production — App Router, RSC, streaming SSR, and edge-ready deployments out of the box.',
        },
        {
          name: 'Sanity.io',
          description:
            'Structured content platform with GROQ querying, typed schemas, and real-time collaborative editing.',
        },
        {
          name: 'Tailwind CSS',
          description:
            'Utility-first CSS framework enabling rapid, consistent, and design-token-driven styling at scale.',
        },
        {
          name: 'Framer Motion',
          description:
            'Production-ready animation library for React with gesture support, layout animations, and shared layouts.',
        },
        {
          name: 'GitHub',
          description:
            'Version control and collaboration via pull requests, Actions CI/CD pipelines, and conventional branch workflows.',
        },
        {
          name: 'VS Code',
          description:
            'Primary editor configured with TypeScript strict mode, ESLint, Prettier, and workspace-scoped settings.',
        },
      ],
    },
    {
      category: 'Skills',
      items: [
        {
          name: 'Frontend Architecture',
          description:
            'Designing scalable component hierarchies, predictable data-flow patterns, and maintainable file structure conventions.',
        },
        {
          name: 'Responsive Design',
          description:
            'Building fluid layouts with mobile-first breakpoints, fluid typography via clamp(), and adaptive spacing scales.',
        },
        {
          name: 'Component Systems',
          description:
            'Authoring reusable, accessible, and composable design-system primitives with clearly typed, minimal-surface APIs.',
        },
        {
          name: 'Content Modeling',
          description:
            'Structuring Sanity schemas to mirror UI needs while keeping the editorial authoring experience intuitive and safe.',
        },
        {
          name: 'Performance Thinking',
          description:
            'Applying Core Web Vitals analysis, route-level code splitting, and image optimisation strategies to hit green scores.',
        },
        {
          name: 'UI Polish',
          description:
            'Crafting micro-interactions, precise transition timing curves, and visual details that lift perceived quality.',
        },
      ],
    },
  ] satisfies SkillsEntry[],

  // OWNER_SLOT: Metrics — replace with vetted numbers.
  metrics: [
    {
      value: 500,
      suffix: 'K+',
      label: 'Lines of Code Written',
      sub: 'Across production systems',
    },
    {
      value: 1,
      suffix: 'M+',
      label: 'Users Impacted',
      sub: 'Monthly active reach',
    },
    {
      value: 40,
      suffix: '+',
      label: 'Deployments Shipped',
      sub: 'Zero critical regressions',
    },
    {
      value: 98.9,
      suffix: '%',
      label: 'Uptime Maintained',
      sub: 'Across all services',
    },
    {
      value: 12,
      label: 'Open Source Projects',
      sub: 'Public & actively maintained',
    },
    {
      value: 5,
      suffix: '+',
      label: 'Countries Reached',
      sub: 'Global user footprint',
    },
  ] satisfies MetricItem[],

  // OWNER_SLOT: Achievements — replace with vetted awards/events.
  achievements: [
    {
      id: 'hackathon-2024',
      event: 'National Hackathon Championship',
      organizer: 'TechCrunch Disrupt',
      date: 'Nov 2024',
      notes: '1st of 400+ teams',
      description:
        'Built a real-time collaborative AI code editor in 36 hours. The submission featured live pair-programming with GPT-4 integration, conflict-free merge resolution, and a sandboxed preview environment. Judges highlighted the product polish and live demo stability across 400+ competing teams.',
    },
    {
      id: 'aws-build-2024',
      event: 'Best Technical Implementation',
      organizer: 'AWS Build On',
      date: 'Aug 2024',
      notes: 'Top of 200+ submissions',
      description:
        'Architected a serverless event-driven pipeline on AWS Lambda, SQS, and DynamoDB that processed 1M+ telemetry events per day at sub-50ms p99 latency. Recognised for infrastructure-as-code discipline, cost efficiency, and zero-downtime blue-green deployment strategy.',
    },
    {
      id: 'github-os-2023',
      event: 'Open Source Excellence Award',
      organizer: 'GitHub Universe',
      date: 'Oct 2023',
      notes: 'Recognised — 15K+ stars',
      description:
        'A developer utility library for composing type-safe API clients with auto-generated TypeScript bindings. Adopted by teams at multiple YC-backed startups. Recognised for documentation quality, semantic versioning discipline, and active community maintenance.',
    },
    {
      id: 'google-sprint-2023',
      event: 'Finalist — Product Design Sprint',
      organizer: 'Google for Startups',
      date: 'Jun 2023',
      notes: 'Top 5 of 300 applicants',
      description:
        'Competed in a five-day design sprint focused on consumer fintech accessibility. Delivered a high-fidelity prototype with a novel onboarding flow that cut task completion time by 38% in usability testing. Selected as one of five finalists from over 300 global applicants.',
    },
  ] satisfies AchievementItem[],

  // OWNER_SLOT: Education — replace with vetted degrees/institutions.
  education: [
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
      gpa: 'GPA 3.9 / 4.0',
    },
  ] satisfies EducationItem[],

  // OWNER_SLOT: Writing — replace with vetted publications/links.
  writing: [
    {
      id: '1',
      title: 'Navigating the AI Inflection Point',
      url: 'https://hbr.org',
      year: '2024',
      description:
        'How enterprise leaders can separate signal from noise and build AI strategy that outlasts the hype cycle.',
    },
    {
      id: '2',
      title: 'Why Roadmaps Lie',
      url: 'https://productcoalition.com',
      year: '2024',
      description:
        "A practitioner's framework for prioritisation that survives first contact with the market — and the CEO.",
    },
    {
      id: '3',
      title: 'The Strategy-Tech Gap and How to Close It',
      url: 'https://www.fortuneindia.com',
      year: '2023',
      description:
        'Why the best strategy work now requires technical fluency, and a practical path to building it without becoming an engineer.',
    },
    {
      id: '4',
      title: "India's SaaS Moment: Patterns from the First Wave",
      url: 'https://www.livemint.com',
      year: '2022',
      description:
        'Structural observations on go-to-market, pricing, and customer success drawn from conversations with forty B2B founders.',
    },
  ] satisfies WritingItem[],
} as const
