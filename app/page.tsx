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

// ISR: statically render and revalidate hourly instead of rendering per request.
export const revalidate = 3600

export const metadata: Metadata = {
  title      : 'Sidakpreet Singh | Portfolio',
  description: "Sidakpreet Singh's interactive portfolio",
  alternates : {
    canonical: '/',
  },
  openGraph  : {
    title      : 'Sidakpreet Singh | Portfolio',
    description: 'Product strategy, tech & systems — an interactive terminal-themed portfolio.',
    type       : 'website',
    url        : siteConfig.url,
    siteName   : 'Sidakpreet Singh',
  },
  twitter    : {
    card       : 'summary_large_image',
    title      : 'Sidakpreet Singh | Portfolio',
    description: 'Product strategy, tech & systems — an interactive terminal-themed portfolio.',
  },
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

  // Structured data (schema.org @graph) mirroring the landing-page convention —
  // sameAs profile links are sourced from the same Sanity social data the UI uses.
  const siteUrl = siteConfig.url
  const profileUrls = (heroData?.socialLinks ?? [])
    .filter((link) => ['linkedin', 'github', 'twitter'].includes(link.platform) && link.url)
    .map((link) => link.url)

  // Keep the structured-data email in sync with the CMS contact link.
  const emailLink = (heroData?.socialLinks ?? []).find((link) => link.platform === 'email')
  const email = emailLink?.copyValue || emailLink?.url?.replace(/^mailto:/, '') || siteConfig.email

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph'  : [
      {
        '@type'    : 'WebSite',
        '@id'      : `${siteUrl}/#website`,
        url        : `${siteUrl}/`,
        name       : siteConfig.title,
        description: siteConfig.description,
        publisher  : { '@id': `${siteUrl}/#person` },
      },
      {
        '@type'    : 'ProfilePage',
        '@id'      : `${siteUrl}/#webpage`,
        url        : `${siteUrl}/`,
        name       : siteConfig.title,
        description: siteConfig.description,
        isPartOf   : { '@id': `${siteUrl}/#website` },
        mainEntity : { '@id': `${siteUrl}/#person` },
      },
      {
        '@type'    : 'Person',
        '@id'      : `${siteUrl}/#person`,
        name       : siteConfig.name,
        url        : `${siteUrl}/`,
        image      : `${siteUrl}/opengraph-image`,
        email      : email,
        description: heroData?.bio || siteConfig.description,
        knowsAbout : ['Product Strategy', 'Technology', 'Systems'],
        ...(profileUrls.length ? { sameAs: profileUrls } : {}),
      },
    ],
  }

  return (
    <div id="main-content" tabIndex={-1} className="relative flex flex-col outline-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
