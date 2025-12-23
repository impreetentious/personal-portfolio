# Personal Portfolio

Interactive, terminal-inspired personal portfolio with Sanity-backed content, Framer Motion, and a dark UI system.

**Portfolio Version: v3.12.5_2025-12-23_21:35:57 (IST)

## Tech Stack

* Next.js 16 (App Router)
* Tailwind CSS
* Framer Motion
* TypeScript
* Sanity CMS (`next-sanity`)
* Fonts via `next/font/google`: Inter, JetBrains Mono, Space Grotesk

## Run locally

1. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SANITY_PROJECT_ID`.
2. Optionally set `SANITY_API_READ_TOKEN` for authenticated reads.
3. Enable the embedded Studio only when you need it locally:

```bash
# in .env.local
NEXT_PUBLIC_ENABLE_STUDIO=true
```

Requires Node **22.12+** (see `.nvmrc` and `package.json` `engines`).

```bash
npm ci
npm run dev
```

Dev/preview listens on **port 3004**.

```bash
npm run lint
npm run build
npm run test
npm run test:e2e
```

`npm run build` fails without `NEXT_PUBLIC_SANITY_PROJECT_ID` unless you set `ALLOW_BUILD_WITHOUT_SANITY=true` (used in CI smoke builds). Run `ALLOW_BUILD_WITHOUT_SANITY=true npm run build` before `npm run test:e2e` so Playwright can start the production server.

## Studio access

`/studio` is **disabled by default**. It returns 404 unless `NEXT_PUBLIC_ENABLE_STUDIO=true`. Do not enable that flag on a public production origin; use Sanity’s hosted Studio and project ACLs for editing instead.

Search indexing is controlled by `NEXT_PUBLIC_ALLOW_INDEXING` (default false in `.env.example`).

Career-section fallbacks stay development-only until `NEXT_PUBLIC_USE_CAREER_FALLBACKS=true` (see `.env.example` and `lib/careerFallbacks.ts`).

## Architecture

```text
personal-portfolio/
├── app/                  # routes, metadata, robots, sitemap, studio
├── components/           # UI sections + ui/ primitives
├── lib/                  # config, identity, Sanity client, queries
├── sanity/schemas/       # CMS schemas
├── tailwind.config.ts
└── next.config.js
```

## Content models

* **Experience:** `company`, optional `location`/`displayDates`, legacy single-role fields or nested `roles[]`; hide with `isHidden`
* **Skills:** Grouped by `category` ('Tools' | 'Skills') with `name` and optional `description`
* **Metrics:** `value`, optional `prefix`/`suffix`, `label`, optional `sub`
* **Achievements:** `event`, `organizer`, `date`, `notes`, optional `description`
* **Education:** `institution`, `degree`, `years`, optional `gpa`

## Sanity setup

Supported document types: `hero`, `resume`, `experience`, `skills`, `metrics`, `achievements`, `education`, `writing`.

If you already created documents with older shapes for achievements/education/metrics, update those records in Studio before relying on live content.

`sanity.cli.ts` is included so Sanity CLI commands resolve the same project and dataset as the embedded Studio.

## License

MIT © Sidakpreet Singh — see [LICENSE](LICENSE).
