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

export type ExperienceItem = {
  company: string
  role: string
  location: string
  dates: string
  bulletPoints: string[]
  skillsUsed: string[]
}

/**
 * isHidden != true also catches documents where the field is null/unset.
 */
export const experienceQuery = `
  *[_type == "experience" && isHidden != true] | order(order asc) {
    company,
    role,
    location,
    dates,
    bulletPoints,
    skillsUsed
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