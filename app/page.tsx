import {Achievements} from '@/components/Achievements'
import {Contact} from '@/components/Contact'
import {Education} from '@/components/Education'
import {Experience} from '@/components/Experience'
import {Footer} from '@/components/Footer'
import {Hero} from '@/components/Hero'
import {Metrics} from '@/components/Metrics'
import {ScrollReveal} from '@/components/ScrollReveal'
import {Skills} from '@/components/Skills'
import {sanityFetch} from '@/lib/sanity'
import {heroQuery, type HeroData} from '@/lib/queries'

export default async function HomePage() {
  const heroData = await sanityFetch<HeroData | null>(heroQuery)

  return (
    <div className="min-h-screen">
      <Hero data={heroData} />
      <div className="space-y-24 px-6 pt-8 pb-0 sm:px-8 md:px-12 md:pt-16">
        <ScrollReveal>
          <Experience />
        </ScrollReveal>
        <ScrollReveal>
          <Skills />
        </ScrollReveal>
        <ScrollReveal>
          {/* id wrapper: Metrics section carries no internal id — required by IntersectionObserver */}
          <div id="metrics">
            <Metrics />
          </div>
        </ScrollReveal>
        <ScrollReveal>
          {/* id wrapper: Achievements section carries no internal id — required by IntersectionObserver */}
          <div id="achievements">
            <Achievements />
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <Education />
        </ScrollReveal>
        <ScrollReveal>
          <div id="contact">
            <Contact />
          </div>
        </ScrollReveal>
      </div>
      <Footer />
    </div>
  )
}
