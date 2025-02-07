import {Education} from '@/components/Education'
import {Experience} from '@/components/Experience'
import {Footer} from '@/components/Footer'
import {Hero} from '@/components/Hero'
import {ScrollReveal} from '@/components/ScrollReveal'
import {Skills} from '@/components/Skills'
import {sanityFetch} from '@/lib/sanity'
import {heroQuery, type HeroData} from '@/lib/queries'

const placeholderSections = [
  {
    id: 'about',
    title: 'About',
    description: 'A future introduction section for your story, strengths, and approach.',
  },
  {
    id: 'leadership',
    title: 'Leadership',
    description: 'A dedicated space to spotlight leadership experience, team impact, and strategic ownership.',
  },
  {
    id: 'achievements',
    title: 'Achievements',
    description: 'A clean place to spotlight awards, milestones, and notable highlights.',
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'A curated showcase area for selected work, case studies, and experiments.',
  },
]

export default async function HomePage() {
  const heroData = await sanityFetch<HeroData | null>(heroQuery)

  return (
    <div className="min-h-screen">
      <Hero data={heroData} />
      <div className="space-y-24 px-6 py-8 sm:px-8 md:px-12 md:pt-16">
        <ScrollReveal>
          <Experience />
        </ScrollReveal>
        <ScrollReveal>
          <Skills />
        </ScrollReveal>
        <ScrollReveal>
          <Education />
        </ScrollReveal>
        {placeholderSections.map((section) => (
          <ScrollReveal key={section.id}>
            <section
              id={section.id}
              className="mx-auto max-w-6xl border-t border-accent/15 py-12"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-accent">
                {section.title}
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                {section.title} Section Placeholder
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-foreground/78">
                {section.description}
              </p>
            </section>
          </ScrollReveal>
        ))}
      </div>
      <Footer />
    </div>
  )
}