type SkillsEntry = {
  category: 'Tools' | 'Skills'
  items: string[]
}

const skillEntries: SkillsEntry[] = [
  {
    category: 'Tools',
    items: [
      'Next.js',
      'Sanity.io',
      'Tailwind CSS',
      'Framer Motion',
      'GitHub',
      'VS Code',
    ],
  },
  {
    category: 'Skills',
    items: [
      'Frontend Architecture',
      'Responsive Design',
      'Component Systems',
      'Content Modeling',
      'Performance Thinking',
      'UI Polish',
    ],
  },
]

export function Skills() {
  const tools = skillEntries.find((entry) => entry.category === 'Tools') ?? {
    category: 'Tools' as const,
    items: [],
  }
  const skills = skillEntries.find((entry) => entry.category === 'Skills') ?? {
    category: 'Skills' as const,
    items: [],
  }

  return (
    <section
      id="skills"
      className="mx-auto max-w-6xl border-t border-accent/15 py-12"
    >
      <p className="text-sm uppercase tracking-[0.3em] text-accent">Skills</p>
      <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
        Tools and strengths organized for fast scanning
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-foreground/78">
        The structure mirrors the Sanity schema so this section can be swapped
        to dynamic content cleanly later.
      </p>

      <div className="mt-8 grid gap-10 border-t border-white/10 pt-8 lg:grid-cols-2">
        {[tools, skills].map((entry) => (
          <div
            key={entry.category}
            className="border-l border-accent/20 pl-5"
          >
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-success">
              {entry.category}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {entry.items.map((item) => (
                <span
                  key={item}
                  className="hover-glow rounded-full border border-white/12 px-4 py-2 text-sm text-foreground hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/10 hover:text-accent"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
