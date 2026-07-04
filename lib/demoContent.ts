import type {
  AchievementItem,
  EducationItem,
  ExperienceItem,
  MetricItem,
  SkillsEntry,
  WritingItem,
} from './queries'

/** Neutral fixtures for local development, smoke builds, and UI tests. */
export const demoContent = {
  experience: [
    {
      id: 'demo-experience',
      company: 'Example Company',
      role: 'Example Role',
      location: 'Remote',
      dates: '2024 – Present',
      bulletPoints: [
        'Demonstrates the expanded experience layout with realistic line lengths.',
        'Exercises lists, responsive spacing, and keyboard-accessible disclosure controls.',
      ],
      skillsUsed: ['Example skill', 'Sample tool'],
    },
  ] satisfies ExperienceItem[],

  skills: [
    {
      category: 'Tools',
      items: [
        {
          name: 'Example tool',
          description: 'Development fixture used to verify the keyboard-accessible tooltip.',
        },
      ],
    },
    {
      category: 'Skills',
      items: [
        {
          name: 'Example skill',
          description: 'Development fixture used to exercise the second skills column.',
        },
      ],
    },
  ] satisfies SkillsEntry[],

  metrics: [
    {
      value: 24,
      suffix: '%',
      label: 'Example metric',
      sub: 'Development fixture',
    },
  ] satisfies MetricItem[],

  achievements: [
    {
      id: 'demo-achievement',
      event: 'Example achievement',
      organizer: 'Example organization',
      date: '2026',
      notes: 'Development fixture',
      description: 'Exercises the expandable achievement row without asserting a real award.',
    },
  ] satisfies AchievementItem[],

  education: [
    {
      institution: 'Example University',
      degree: 'Example degree',
      years: '2022 – 2026',
      gpa: 'Example score',
    },
  ] satisfies EducationItem[],

  writing: [
    {
      id: 'demo-writing',
      title: 'Example article',
      url: 'https://example.com',
      year: '2026',
      description: 'Development fixture for the external-link presentation.',
    },
  ] satisfies WritingItem[],
} as const
