import type { HeroData, HeroProfileField, HeroTerminalSkill, SocialLink } from './queries'

// Single source of truth for identity and contact details.
//
// These are the only fallbacks that stay always-on in production (see the
// fallback policy in lib/config.ts): an absent identity is worse than a
// slightly stale one. The same phone/email/LinkedIn values used to be
// hard-coded independently in Hero, WindowsTerminal, Contact, and config and
// drifted apart — edit them here once and every surface updates.

const email = 'work@sidakpreetsingh.com'
const phoneDisplay = '+91 90344 31886'
const phoneTel = 'tel:+919034431886'
const whatsappUrl = 'https://wa.me/919034431886'
const linkedinName = 'Sidakpreet Singh'
const linkedinUrl = 'https://linkedin.com/in/sidakpreetsinghk'
const githubUrl = 'https://github.com/ItsMonarch04'
const location = 'Delhi NCR, India'

export const identity = {
  name: 'Sidakpreet Singh',
  tagline: 'Strategy · Tech · Systems · Gaming',
  bio: 'Welcome to my portfolio! Hope you find something interesting to read, or maybe we can build something together!',
  location,
  email,
} as const

// Hero terminal "properties" rows (Location / Email / Phone / LinkedIn).
export const FALLBACK_PROFILE_FIELDS: HeroProfileField[] = [
  { key: 'Location', value: location, url: undefined, column: 'left' },
  { key: 'Email', value: email, url: `mailto:${email}`, column: 'left' },
  { key: 'Phone', value: phoneDisplay, url: phoneTel, column: 'right' },
  { key: 'LinkedIn', value: linkedinName, url: linkedinUrl, column: 'right' },
]

// Hero terminal skill chips.
export const FALLBACK_TERMINAL_SKILLS: HeroTerminalSkill[] = [
  { label: 'React', dot: '#61AFEF' },
  { label: 'Next.js', dot: '#4EC9B0' },
  { label: 'TypeScript', dot: '#4FC1FF' },
  { label: 'Tailwind', dot: '#38BDF8' },
  { label: 'Python', dot: '#DCDCAA' },
  { label: 'Node.js', dot: '#A3E635' },
]

// Contact section channels.
export const FALLBACK_SOCIAL_LINKS: SocialLink[] = [
  { platform: 'phone', url: phoneTel, order: 0, label: 'Phone', copyValue: phoneDisplay },
  { platform: 'email', url: `mailto:${email}`, order: 1, label: 'Email', copyValue: email },
  { platform: 'linkedin', url: linkedinUrl, order: 2, label: 'LinkedIn' },
  { platform: 'whatsapp', url: whatsappUrl, order: 3, label: 'WhatsApp' },
  { platform: 'github', url: githubUrl, order: 4, label: 'GitHub' },
]

// Hero data fallback. socialLinks stays empty here by design — the page feeds
// Contact from the fetched hero data (or Contact's own fallback), never from
// this object, so populating it would be dead data.
export const FALLBACK_HERO: HeroData = {
  name: identity.name,
  tagline: identity.tagline,
  bio: identity.bio,
  socialLinks: [],
  profileFields: FALLBACK_PROFILE_FIELDS,
  terminalSkills: FALLBACK_TERMINAL_SKILLS,
}
