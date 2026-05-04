# Personal Portfolio

Interactive, terminal-inspired personal portfolio with Sanity-backed content, Framer Motion, and a dark UI system.

A single scrolling page with a first-visit boot sequence, a hero terminal, section navigation, a command palette, résumé download entry points, themed error states, JSON-LD, sitemap, robots, dynamic Open Graph art, and a dynamic favicon. Career content is fetched from Sanity server-side with hourly revalidation and an eight-second per-query timeout.

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS
- Framer Motion
- TypeScript
- Sanity CMS (`next-sanity`)
- Fonts via `next/font/google`: Inter, JetBrains Mono, Space Grotesk

## Run locally

1. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SANITY_PROJECT_ID`.
2. Optionally set `SANITY_API_READ_TOKEN` for authenticated reads.
3. Enable the embedded Studio only when you need it locally:

```bash
# in .env.local
NEXT_PUBLIC_ENABLE_STUDIO=true
```

Requires Node **22.20+** (see `.nvmrc` and `package.json` `engines`).

```bash
npm ci
npm run dev
```

Dev/preview listens on **port 3004**.

## Verify

```bash
npm run lint
npm run format:check
npm run build
npm run test
npm run test:e2e
```

`npm run build` fails without `NEXT_PUBLIC_SANITY_PROJECT_ID` unless you set `ALLOW_BUILD_WITHOUT_SANITY=true` (used in CI smoke builds). A project ID that is set but unreachable also fails the build, by design. Run `ALLOW_BUILD_WITHOUT_SANITY=true npm run build` before `npm run test:e2e` so Playwright can start the production server.

## Content behavior

CMS-backed career sections are **hidden** in production when their fetch returns no data, rather than rendering an empty shell. Set `NEXT_PUBLIC_USE_CAREER_FALLBACKS=true` to render the committed fallback copy in `lib/careerFallbacks.ts` instead — review that copy before enabling it. Hero and contact identity fallbacks are always on.

At runtime, an empty-but-successful CMS response is refused, so a revalidation cannot replace a good page with blanks.

## Studio access

`/studio` is **disabled by default**. It returns 404 unless `NEXT_PUBLIC_ENABLE_STUDIO=true`. Do not enable that flag on a public production origin; use Sanity's hosted Studio and project ACLs for editing instead.

Search indexing is controlled by `NEXT_PUBLIC_ALLOW_INDEXING` (default false in `.env.example`).

## Architecture

```text
personal-portfolio/
├── app/                  # routes, metadata, robots, sitemap, studio
├── components/           # UI sections + ui/ primitives
├── e2e/                  # Playwright interaction + axe suite
├── lib/                  # config, identity, Sanity client, content fallbacks, queries
├── tests/                # Node unit tests
├── sanity/schemas/       # CMS schemas
├── tailwind.config.ts
└── next.config.js
```

## Content models

- **Experience:** `company`, optional `location`/`displayDates`, legacy single-role fields or nested `roles[]`; hide with `isHidden`
- **Skills:** Grouped by `category` ('Tools' | 'Skills') with `name` and optional `description`
- **Metrics:** `value`, optional `prefix`/`suffix`, `label`, optional `sub`
- **Achievements:** `event`, `organizer`, `date`, `notes`, optional `description`
- **Education:** `institution`, `degree`, `years`, optional `gpa`

## Sanity setup

Supported document types: `hero`, `resume`, `experience`, `skills`, `metrics`, `achievements`, `education`, `writing`.

If you already created documents with older shapes for achievements/education/metrics, update those records in Studio before relying on live content.

`sanity.cli.ts` is included so Sanity CLI commands resolve the same project and dataset as the embedded Studio.

## Deploy

The production path is GitHub `main` → Vercel. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` in the Vercel project environment; without it the production build fails. Leave `NEXT_PUBLIC_ENABLE_STUDIO` unset in production, and flip `NEXT_PUBLIC_ALLOW_INDEXING` on only when the deployment is meant to be indexed.

## License

MIT © Sidakpreet Singh — see [LICENSE](LICENSE).

---

**Version:** v3.16.0
