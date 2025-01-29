# Version Control
- Base Format Version: 0.1
- Portfolio Version: v0.1.0_2025-01-28_05:01:12 (IST)

# Personal Portfolio

This repository is my one-time build foundation for a highly interactive, dark-themed personal portfolio built for long-term stability and low maintenance. The architecture is designed so any future developers or AI agents can navigate the codebase quickly, extend it safely and keep content updates isolated to Sanity CMS.

## Core Goals

- One-time build with zero technical maintenance expected after launch
- Strong file organization and naming conventions for handoff-readiness
- Dark-themed, motion-rich interface built with durable mainstream tooling
- Content managed through Sanity so structured updates do not require code edits
- Responsive navigation that shifts from a left-side rail on desktop to a bottom bar on mobile

## Tech Stack

- `Next.js 14` with App Router for routing, layouts, metadata, and deployment readiness
- `Tailwind CSS` for utility-first styling and consistent design tokens
- `Framer Motion` for interactive transitions, accordion behavior, and section-level animation
- `Sanity.io` for structured content management
- `Inter` as the global font, with clean sans-serif fallbacks

## UI Requirements

- Desktop navigation: fixed vertical left-side navigation
- Mobile navigation: bottom navigation bar
- Experience section: interactive accordion card layout with expandable bullet points
- Footer: copyright on the left, base format version in the center, and `Mail`, `LinkedIn`, `WhatsApp`, and `GitHub` icons on the right

## Repository Conventions

- Keep components, utilities, app routes, and CMS schemas in separate folders
- Use singular, descriptive file names for schema documents
- Prefer small, reusable UI components over large section files
- Keep section-specific logic close to the owning section component
- Reserve shared logic for `lib/`
- Keep all Sanity document definitions centralized in `schemas/`
- Use TypeScript across app code and Sanity schema files

## Recommended Folder Structure

```text
.
├── README.md
├── app/
│   ├── (site)/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── loading.tsx
│   ├── api/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── layout/
│   │   ├── desktop-nav.tsx
│   │   ├── mobile-nav.tsx
│   │   └── footer.tsx
│   ├── sections/
│   │   ├── hero-section.tsx
│   │   ├── experience-section.tsx
│   │   ├── skills-section.tsx
│   │   ├── education-section.tsx
│   │   └── achievements-section.tsx
│   └── ui/
│       ├── accordion.tsx
│       ├── icon-link.tsx
│       └── section-shell.tsx
├── lib/
│   ├── sanity/
│   │   ├── client.ts
│   │   ├── queries.ts
│   │   └── types.ts
│   ├── constants.ts
│   └── utils.ts
├── public/
│   ├── icons/
│   └── images/
├── schemas/
│   ├── achievements.ts
│   ├── education.ts
│   ├── experience.ts
│   ├── index.ts
│   └── skills.ts
├── sanity.config.ts
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
└── package.json
```

## Sanity Content Model

### Experience

- `company`: string
- `role`: string
- `location`: string
- `dates`: string
- `bulletPoints`: array of strings
- `skillsUsed`: array of strings
- `isHidden`: boolean

### Skills

- `category`: string limited to `Tools` or `Skills`
- `items`: array of strings

### Education

- `institution`: string
- `degree`: string
- `years`: string

### Achievements

- `highlightText`: string
- `year`: string

## Sanity Schema Notes

- `isHidden` exists on experience entries so records can be suppressed without deletion
- Skills category values are intentionally locked to a narrow list for predictable UI grouping
- Arrays are modeled as plain strings to keep editorial input simple and resilient over time

## Future AI / Developer Notes

- If a new base format version is provided in the future, update both the README version block and any surfaced UI version label
- If no new base format version is provided, assume the last used base format version remains active
- Do not change schema field names casually once content is entered in Sanity
- Preserve the modular folder structure when adding new sections or integrations

---

# AI Agent Instructions
Before making any new commits, you must update the Version Control string below with the current IST time of commit (`Asia/Kolkata`).
This IST timestamp rule is permanent for all future workflows, commits, and AI agents working in this repository.
Follow this format for version control:
Base Format Version: [Provided by User] (Stays same as last if new is not provided)
Version: SPS_[Base_Format_Version]_YYYY-MM-DD_HH:MM:SS (time in IST)
---
