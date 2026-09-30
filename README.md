# Personal Portfolio

Terminal-inspired portfolio built with Next.js and Sanity. The single-page interface includes a first-visit boot sequence, section navigation, a command palette, résumé downloads, accessible error states, structured data, dynamic Open Graph artwork, and an optional embedded Sanity Studio.

## Stack

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS and Framer Motion
- Sanity CMS with hourly revalidation
- Playwright and axe-core for interaction and accessibility tests

## Local development

The project requires Node 22.20 or newer; `.nvmrc` pins the exact CI version.

```bash
nvm use
npm ci
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local` to use a Sanity project. `SANITY_API_READ_TOKEN` is optional for authenticated reads. Development mode uses neutral demo records when CMS-backed sections have no data.

## Configuration

| Variable                        | Purpose                                                        | Default                                 |
| ------------------------------- | -------------------------------------------------------------- | --------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project used for portfolio content                      | Required for production builds          |
| `NEXT_PUBLIC_SANITY_DATASET`    | Sanity dataset                                                 | `production`                            |
| `SANITY_API_READ_TOKEN`         | Optional authenticated server-side reads                       | Unset                                   |
| `NEXT_PUBLIC_SITE_URL`          | Canonical site origin                                          | `https://portfolio.sidakpreetsingh.com` |
| `NEXT_PUBLIC_ALLOW_INDEXING`    | Enables indexing, sitemap entries, and permissive robots rules | `false`                                 |
| `NEXT_PUBLIC_ENABLE_STUDIO`     | Enables the embedded `/studio` route                           | `false`                                 |
| `NEXT_PUBLIC_USE_DEMO_CONTENT`  | Uses neutral fixtures in production-mode smoke builds          | `false`                                 |
| `ALLOW_BUILD_WITHOUT_SANITY`    | Allows an intentional CMS-less production build                | `false`                                 |

`/studio` returns 404 unless explicitly enabled. When enabled, Sanity authentication protects the editor and a route-specific Content Security Policy permits its required service origins.

## Content behavior

The hero and contact areas have committed identity fallbacks. Experience, skills, metrics, achievements, education, and writing prefer CMS records and are hidden in production when no records exist. Neutral fixtures in `lib/demoContent.ts` are reserved for development, smoke builds, and UI tests.

CMS requests time out after eight seconds. Failed requests abort configured production builds, while runtime revalidation failures propagate to Next.js so it can retain the previously generated page. Successful empty collections are treated as intentional and hide the corresponding section.

Supported Sanity document types are `hero`, `resume`, `experience`, `skills`, `metrics`, `achievements`, `education`, and `writing`. Hero and résumé are fixed-ID singleton documents in Studio.

## Verification

Run the static and unit-test suite:

```bash
npm run verify
```

Verify a production-mode build without CMS credentials, then run budgets and browser tests:

```bash
npm run build:smoke
npm run budget:bundle
npm run budget:performance
npm run test:e2e
```

`npm run build` intentionally fails without `NEXT_PUBLIC_SANITY_PROJECT_ID`. The smoke build is not a substitute for a deployment build against the configured production dataset.

## Project structure

```text
app/              Routes, metadata, robots, sitemap, and Studio
components/       Portfolio sections and UI primitives
docs/             Dependency override rationale
e2e/              Playwright interaction and accessibility tests
lib/              Configuration, content policy, queries, and Sanity client
patches/          patch-package fixes applied after install
sanity/schemas/   CMS document schemas
scripts/          Version, bundle, and performance gates
tests/            Node unit tests
```

## Deployment

Deploy with Node 22 and set the Sanity project, dataset, and canonical site URL in the hosting environment. Leave indexing disabled for preview deployments; enable it only on the canonical public deployment. The repository includes a GitHub Actions workflow that runs dependency, static-analysis, build, budget, unit, browser, and accessibility gates.

## Contributing

Issues and pull requests are welcome on [GitHub](https://github.com/impreetentious/personal-portfolio). Open an issue before anything substantial, keep changes focused and leave the checks under [Verification](#verification) green.

## License

Apache-2.0 © 2025-2026 Sidakpreet Singh — see [LICENSE](LICENSE).

---

**Version:** v3.18.1
