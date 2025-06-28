export type SocialLink = {
  platform: 'email' | 'linkedin' | 'whatsapp' | 'github' | 'twitter'
  url: string
  label?: string
}

export type HeroData = {
  name: string
  tagline: string
  bio: string
  socialLinks: SocialLink[]
}

export const heroQuery = `
  *[_type == "hero"][0] {
    name,
    tagline,
    bio,
    socialLinks[] {
      platform,
      url,
      label
    }
  }
`

export type ExperienceRoleItem = {
  order?: number
  role: string
  dates: string
  bulletPoints: string[]
  skillsUsed: string[]
}

export type ExperienceItem = {
  id: string
  company: string
  location?: string
  displayDates?: string
  role?: string
  dates?: string
  bulletPoints?: string[]
  skillsUsed?: string[]
  roles?: ExperienceRoleItem[]
}

export const experienceQuery = `
  *[_type == "experience" && isHidden != true] | order(order asc) {
    "id": _id,
    company,
    location,
    displayDates,
    role,
    dates,
    bulletPoints,
    skillsUsed,
    "roles": roles[] | order(order asc) {
      order,
      role,
      dates,
      bulletPoints,
      skillsUsed
    }
  }
`

export type ProjectItem = {
  title: string
  summary: string
  techStack: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
}

export const projectsQuery = `
  *[_type == "projects" && isHidden != true] | order(order asc) {
    title,
    summary,
    techStack,
    liveUrl,
    githubUrl,
    featured
  }
`

export const featuredProjectsQuery = `
  *[_type == "projects" && isHidden != true && featured == true] | order(order asc) {
    title,
    summary,
    techStack,
    liveUrl,
    githubUrl
  }
`

export type SkillItem = {
  name: string
  description?: string
}

export type SkillsEntry = {
  category: 'Tools' | 'Skills'
  items: SkillItem[]
}

export const skillsQuery = `
  *[_type == "skills"] {
    category,
    items[] {
      name,
      description
    }
  }
`

export type MetricItem = {
  value: number
  prefix?: string
  suffix?: string
  label: string
  sub?: string
}

export const metricsQuery = `
  *[_type == "metrics" && isHidden != true] | order(order asc) {
    value,
    prefix,
    suffix,
    label,
    sub
  }
`

export type AchievementItem = {
  id: string
  event: string
  organizer: string
  date: string
  notes: string
  description?: string
}

export const achievementsQuery = `
  *[_type == "achievements" && isHidden != true] | order(order asc) {
    "id": _id,
    event,
    organizer,
    date,
    notes,
    description
  }
`

export type EducationItem = {
  institution: string
  degree: string
  years: string
  gpa?: string
}

export const educationQuery = `
  *[_type == "education" && isHidden != true] | order(order asc) {
    institution,
    degree,
    years,
    gpa
  }
`

export type WritingItem = {
  id: string
  title: string
  url: string
  year: string
  description?: string
}

export const writingQuery = `
  *[_type == "writing" && isHidden != true] | order(order asc) {
    "id": _id,
    title,
    url,
    year,
    description
  }
`

export const resumeQuery = `*[_type == "resume"][0]{ "url": file.asset->url }`
