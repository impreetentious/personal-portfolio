# Version Control

* **Base Format Version:** 2.3.3
* **Portfolio Version: v2.3.3_2025-02-08_22:15:15 (IST)

# Personal Portfolio

This repository is the foundation for my personal portfolio: a highly interactive, dark-themed build designed for long-term stability and low maintenance. The structure is intentionally organized so future developers or AI agents can understand the codebase quickly, extend it safely, and keep content updates isolated to Sanity CMS.

## Core Goals

* One-time build with no expected technical maintenance after launch
* Clear file organization and naming conventions for handoff readiness
* Dark-themed, motion-rich interface built on durable mainstream tooling
* Content managed through Sanity so structured updates do not require code changes
* Responsive navigation that shifts from a left-side rail on desktop to a bottom bar on mobile

## Tech Stack

* `Next.js 14` with App Router for routing, layouts, metadata, and deployment readiness
* `Tailwind CSS` for utility-first styling and consistent design tokens
* `Framer Motion` for interactive transitions, accordion behavior, and section-level animation
* `Sanity.io` for structured content management
* `Inter` as the global font, with clean sans-serif fallbacks

## UI Requirements

* Desktop navigation: fixed vertical left-side navigation
* Mobile navigation: bottom navigation bar
* Experience section: interactive accordion card layout with expandable bullet points
* Footer: copyright on the left, base format version in the center, and `Mail`, `LinkedIn`, `WhatsApp`, and `GitHub` icons on the right

## Repository Conventions

* Keep components, utilities, app routes, and CMS schemas in separate folders
* Use singular, descriptive file names for schema documents
* Prefer small, reusable UI components over large section files
* Keep section-specific logic close to the owning section component
* Reserve shared logic for `lib/`
* Keep all Sanity document definitions centralized in `schemas/`
* Use TypeScript across app code and Sanity schema files

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

* `company`: string
* `role`: string
* `location`: string
* `dates`: string
* `bulletPoints`: array of strings
* `skillsUsed`: array of strings
* `isHidden`: boolean

### Skills

* `category`: string limited to `Tools` or `Skills`
* `items`: array of strings

### Education

* `institution`: string
* `degree`: string
* `years`: string

### Achievements

* `highlightText`: string
* `year`: string

## Sanity Schema Notes

* `isHidden` allows experience entries to be suppressed without deletion
* Skill categories are intentionally restricted to a narrow set for predictable UI grouping
* Arrays are modeled as plain strings to keep editing simple and resilient over time

## Future AI / Developer Notes

* If a new base format version is introduced, update both the README version block and any surfaced UI version label
* If no new base format version is provided, assume the last used base format version remains active
* Do not change schema field names casually once content exists in Sanity
* Preserve the modular folder structure when adding new sections or integrations

# AI Agent Instructions

Before making any new commits, update the Version Control string below with the current IST time of commit (`Asia/Kolkata`).

This IST timestamp rule is permanent for all future workflows, commits, and AI agents working in this repository.

Follow this format for version control:

* **Base Format Version:** [Provided by User] (stays the same unless a new one is provided)
* **Version:** `SPS_[Base_Format_Version]_YYYY-MM-DD_HH:MM:SS` (IST)
