import { SectionLabel } from "@/components/ui/SectionLabel";

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
      className="relative mx-auto w-full max-w-6xl px-6 md:pl-28 lg:pl-32 xl:px-8 py-12 sm:py-16"
    >
      <SectionLabel
        label="Education"
        devLabel="Promise.all([degrees])"
      />

      <div className="mt-6 border-t border-white/10">
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