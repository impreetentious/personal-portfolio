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
* `Inter` & System Mono (Variable sans-serif for UI, monospaced fonts for terminal outputs)

## Current Architecture & Folder Structure

The component structure has been flattened and refined for direct access, utilizing a dedicated `ui/` directory for shared layout primitives.

```text
personal-portfolio/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components/
│   ├── Achievements.tsx
│   ├── AnimatedCounter.tsx
│   ├── BootContext.tsx
│   ├── BootSequence.tsx
│   ├── CommandPalette.tsx
│   ├── Contact.tsx
│   ├── Education.tsx
│   ├── Experience.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Metrics.tsx
│   ├── Navigation.tsx
│   ├── ScrollReveal.tsx
│   ├── Skills.tsx
│   ├── Writing.tsx
│   └── ui/
│       ├── SectionLabel.tsx
│       └── WindowsTerminal.tsx
├── lib/
│   ├── queries.ts
│   ├── sanity.ts
│   ├── config.ts
├── sanity/schemas/
│   ├── index.ts
│   └── [hero, experience, skills, metrics, education, achievements, writing, resume].ts
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

* **Base Format Version:** 3.6.4
* **Portfolio Version: v3.6.4_2025-07-15_23:24:54 (IST)

## AI Agent Instructions

Before making any new commits, update the Version Control string in this file with the current IST time of commit (`Asia/Kolkata`).

This IST timestamp rule is permanent for all future workflows, commits, and AI agents working in this repository.

Follow this format for version control:

* **Base Format Version:** 3.6.4
* **Version:** `v[Base_Format_Version]_YYYY-MM-DD_HH:MM:SS` (IST)

---
