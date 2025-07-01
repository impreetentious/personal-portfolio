import type { Metadata } from "next";
import { Hero }         from "@/components/Hero";
import { Experience }   from "@/components/Experience";
import { Skills }       from "@/components/Skills";
import { Metrics }      from "@/components/Metrics";
import { Achievements } from "@/components/Achievements";
import { Education }    from "@/components/Education";
import { Writing }      from "@/components/Writing";
import { Contact }      from "@/components/Contact";
import { Footer }       from "@/components/Footer";

import { siteConfig }   from "@/lib/config";
import {
  achievementsQuery,
  educationQuery,
  experienceQuery,
  heroQuery,
  metricsQuery,
  skillsQuery,
  writingQuery,
  type AchievementItem,
  type EducationItem,
  type ExperienceItem,
  type HeroData,
  type MetricItem,
  type SkillsEntry,
  type WritingItem,
} from "@/lib/queries";
import { getResumeUrl, sanityFetch } from "@/lib/sanity";

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title      : 'Sidakpreet Singh | Portfolio',
  description: "Sidakpreet Singh's interactive portfolio",
};

export default async function Home() {
  const [
    resumeUrl,
    heroData,
    experienceItems,
    skillsEntries,
    metricItems,
    achievementItems,
    educationItems,
    writingItems,
  ] = await Promise.all([
    getResumeUrl(),
    sanityFetch<HeroData>(heroQuery),
    sanityFetch<ExperienceItem[]>(experienceQuery),
    sanityFetch<SkillsEntry[]>(skillsQuery),
    sanityFetch<MetricItem[]>(metricsQuery),
    sanityFetch<AchievementItem[]>(achievementsQuery),
    sanityFetch<EducationItem[]>(educationQuery),
    sanityFetch<WritingItem[]>(writingQuery),
  ])

  return (
    <div id="main-content" className="relative flex flex-col">
      <Hero data={heroData} resumeUrl={resumeUrl} />

      <Experience data={experienceItems ?? undefined} />
      <Skills data={skillsEntries ?? undefined} />
      <Metrics data={metricItems ?? undefined} />
      <Achievements data={achievementItems ?? undefined} />
      <Education data={educationItems ?? undefined} />
      
      {/* ── Feature Flag Toggle ── */}
      {siteConfig.features.showWriting && <Writing data={writingItems ?? undefined} />}
      
      <Contact socialLinks={heroData?.socialLinks} />
      <Footer />
    </div>
  );
}
