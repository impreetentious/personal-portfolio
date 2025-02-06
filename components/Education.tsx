type EducationItem = {
  institution: string
  degree: string
  years: string
}

const educationItems: EducationItem[] = [
  {
    institution: 'Chandigarh University',
    degree: 'Bachelor of Engineering in Computer Science',
    years: '2019 - 2023',
  },
  {
    institution: 'Self-Directed Learning',
    degree: 'Advanced frontend systems, animation, and CMS-driven site building',
    years: 'Ongoing',
  },
]

export function Education() {
  return (
    <section
      id="education"
      className="mx-auto max-w-6xl border-t border-accent/15 py-12"
    >
      <p className="text-sm uppercase tracking-[0.3em] text-accent">Education</p>
      <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
        Academic background and continued learning
      </h2>

      <div className="mt-8 border-t border-white/10">
        {educationItems.map((item) => (
          <article
            key={`${item.institution}-${item.years}`}
            className="border-b border-white/10 py-7"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <h3 className="text-xl font-semibold text-white">
                  {item.institution}
                </h3>
                <p className="mt-3 max-w-2xl text-base leading-7 text-foreground/80">
                  {item.degree}
                </p>
              </div>
              <p className="shrink-0 text-sm font-medium uppercase tracking-[0.18em] text-foreground/78 md:text-right">
                {item.years}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
