# Personal Portfolio

This repository is the foundation for my personal portfolio: a highly interactive, dark-themed, terminal-inspired build designed for long-term stability. The architecture focuses on precise typography, modular UI components and fluid layout physics.

## Core Goals

* **Zero-Maintenance UI:** One-time build with highly robust layout math (no expected technical maintenance after launch).
* **VS Code / Terminal Aesthetics:** Incorporates precise syntax token colouring, status bars and console output simulations (e.g., Contact section).
* **Motion-Rich Experience:** Smooth Framer Motion transitions, accordion behaviours and staggered list reveals.
* **Fluid Responsiveness:** Pixel-perfect adjustments bridging mobile viewport constraints and desktop expansion without hardcoded breakages.

## Tech Stack

* `Next.js 14` (App Router)
* `Tailwind CSS` (Utility-first styling, custom arbitrary values)
* `Framer Motion` (Gesture support, layout animations)
* `TypeScript` (Strict typing for all component props and data models)
* Fonts (all via `next/font/google`): `Inter` (UI sans-serif), `JetBrains Mono` 400/500/600/700 (terminal & mono output), `Space Grotesk` (display headings)

## Current Architecture & Folder Structure

The component structure has been flattened and refined for direct access, utilizing a dedicated `ui/` directory for shared layout primitives.

```text
personal-portfolio/
├── app/
│   ├── globals.css
│   ├── layout.tsx            # root layout → LayoutShell
│   ├── page.tsx              # single-page composition + JSON-LD
│   ├── error.tsx             # route-level error boundary (themed)
│   ├── global-error.tsx      # last-resort boundary (inline-styled)
│   ├── not-found.tsx         # server wrapper (exports 404 metadata)
│   ├── icon.tsx              # dynamic favicon (edge runtime)
│   ├── opengraph-image.tsx   # dynamic OG image (edge runtime)
│   ├── robots.ts
│   ├── sitemap.ts
│   └── studio/               # embedded Sanity Studio (/studio)
├── components/
│   ├── Achievements.tsx
│   ├── AnimatedCounter.tsx
│   ├── BootContext.tsx       # boot-complete context (gates hero typing)
│   ├── BootSequence.tsx      # first-visit boot overlay
│   ├── SessionRestoredFlash.tsx  # same-session repeat-load flash
│   ├── CommandPalette.tsx
│   ├── Contact.tsx
│   ├── Education.tsx
│   ├── Experience.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── LayoutShell.tsx       # nav + boot + palette orchestration, scroll lock
│   ├── Metrics.tsx
│   ├── Navigation.tsx
│   ├── NotFoundClient.tsx    # client half of the 404 page
│   ├── PaletteContext.tsx    # openPalette() context
│   ├── ScrollReveal.tsx
│   ├── Skills.tsx
│   ├── Writing.tsx
│   └── ui/
│       ├── DecryptText.tsx
│       ├── Magnetic.tsx
│       ├── SectionLabel.tsx
│       ├── TerminalPrompt.tsx
│       ├── WindowsTerminal.tsx
│       └── useResumeDownload.ts
├── lib/
│   ├── config.ts             # siteConfig, showDevFallbacks
│   ├── identity.ts           # single source of truth for real contact/identity fallbacks
│   ├── queries.ts            # GROQ queries + result types
│   ├── sanity.ts             # memoised client, guarded sanityFetch, getResumeUrl
│   └── time.ts               # shared IST clock formatter
├── sanity/schemas/
│   ├── index.ts
│   └── [hero, resume, experience, projects, metrics, education, skills, achievements, writing].ts
├── tailwind.config.ts
└── next.config.js

```

## Core Component Data Models

Data is structured around these primary interfaces:

* **Experience:** `company`, `role`, `location`, `dates`, `bulletPoints`, `skillsUsed`, `isHidden`
* **Skills:** Grouped by `category` ('Tools' | 'Skills') containing `name` and optional `description` (for tooltips)
* **Metrics:** `value`, optional `prefix`, optional `suffix`, `label`, optional `sub`
* **Achievements:** `event`, `organizer`, `date`, `notes`, optional `description`
* **Education:** `institution`, `degree`, `years`, optional `gpa`

## Sanity CMS Setup

The portfolio now supports Sanity-backed content for:

* `hero`
* `resume`
* `experience`
* `skills`
* `metrics`
* `achievements`
* `education`
* `writing`

Local setup:

1. Create a `.env.local` file from `.env.example`.
2. Add your Sanity project ID to `NEXT_PUBLIC_SANITY_PROJECT_ID`.
3. Keep `NEXT_PUBLIC_SANITY_DATASET=production` unless you want a different dataset.
4. Add `SANITY_API_READ_TOKEN` only if you need authenticated reads for unpublished or protected content.
5. Start the app and open `/studio` to manage portfolio content.

Important schema note:

* `achievements`, `education`, and `metrics` were expanded to match the live UI.
* If you already created documents with the old shapes, update those records in Studio before relying on live content for those sections.

CLI support:

* `sanity.cli.ts` is included so future Sanity CLI commands can resolve the same project and dataset as the embedded Studio.

# Version Control

* **Base Format Version:** 3.9.1
* **Portfolio Version: v3.9.1_2025-07-21_15:14:49 (IST)

## AI Agent Instructions

Before making any new commits, update the Version Control string in this file with the current IST time of commit (`Asia/Kolkata`).

This IST timestamp rule is permanent for all future workflows, commits, and AI agents working in this repository.

Follow this format for version control:

* **Base Format Version:** [current release version]
* **Version:** `v[Base_Format_Version]_YYYY-MM-DD_HH:MM:SS` (IST)

---
