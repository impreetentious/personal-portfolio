# Version Control

* **Base Format Version:** 2.5.1
* **Portfolio Version: v2.5.1_2025-02-11_00:11:41 (IST)

# Personal Portfolio

This repository is the foundation for my personal portfolio: a highly interactive, dark-themed, terminal-inspired build designed for long-term stability. The architecture focuses on precise typography, modular UI components, and fluid layout physics.

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

personal-portfolio
│
├── app
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components
│   ├── Achievements.tsx
│   ├── Contact.tsx
│   ├── Education.tsx
│   ├── Experience.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Metrics.tsx
│   ├── Navigation.tsx
│   ├── ScrollReveal.tsx
│   ├── Skills.tsx
│   │
│   └── ui
│       ├── SectionLabel.tsx
│       └── WindowsTerminal.tsx
│
├── lib
│   ├── queries.ts
│   ├── sanity.ts
│   └── version.ts
│
├── next.config.js
├── package.json
└── tsconfig.json

```

## Core Component Data Models

Data is structured around these primary interfaces:

* **Experience:** `company`, `role`, `location`, `dates`, `bulletPoints`, `skillsUsed`, `isHidden`
* **Skills:** Grouped by `category` ('Tools' | 'Skills') containing `name` and optional `description` (for tooltips)
* **Metrics:** `value`, `label`, `sub`
* **Achievements:** `rank`, `event`, `organizer`, `date`, `notes`, optional `badge` 
* **Education:** `institution`, `degree`, `years`

## AI Agent Instructions

Before making any new commits, update the Version Control string below with the current IST time of commit (`Asia/Kolkata`).

This IST timestamp rule is permanent for all future workflows, commits, and AI agents working in this repository.

Follow this format for version control:

* **Base Format Version:** [Provided by User] (stays the same unless a new one is provided)
* **Version:** `SPS_[Base_Format_Version]_YYYY-MM-DD_HH:MM:SS` (IST)

---