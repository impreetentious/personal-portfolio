# Action Plan — June 2025 Audit Fixes & Premium Polish

> **Purpose:** single source of truth for what is done / pending from the 2025-06-07 codebase
> audit, so any agent on any device can resume instantly. Update statuses **in place** as work
> lands. Full audit evidence (compile tests, live-browser verification) lives in the audit
> session; the conclusions are summarised here.
>
> **Repo convention reminder:** every commit must update the Version Control string in
> `Readme.md` with the current IST timestamp (permanent rule, see Readme "AI Agent Instructions").

**Status legend:** `[ ]` pending · `[~]` in progress · `[x]` done · `[d]` deferred / rejected by owner

---

## Phase 1 — Verified defects (fix first, in this order)

### 1. `[x]` Tailwind opacity modifiers that compile to nothing (33 sites, 13 classes)
Tailwind v3 only emits `color/NN` when `NN` is a multiple of 5 or bracketed (`/[0.18]`).
Verified against the project's own Tailwind 3.4.17: `/18`, `/22`, `/24`, `/14`, `/38`, `/52`,
`/72`, `/78`, `/86`, `/12` produce **no CSS** — elements silently inherit parent color at full
opacity (e.g. hero quote marks rendered orange `#ce9178` instead of faint white; Experience
dates/bullets at 100% brightness instead of 72–86%).

- **Fix applied:** mechanical replace of the 13 exact tokens with bracketed equivalents
  (`text-foreground/18` → `text-foreground/[0.18]`, etc.) across:
  `components/ui/WindowsTerminal.tsx`, `components/Experience.tsx`, `components/Education.tsx`,
  `components/Writing.tsx`, `components/Skills.tsx`, `components/Contact.tsx`,
  `app/not-found.tsx`, `app/error.tsx`.
- **Rule going forward:** bare alpha modifiers must be multiples of 5; anything else uses
  bracket syntax `/[0.NN]` (matches existing precedent in `Footer.tsx`).
- **Re-verify anytime:**
  `grep -rnoE "(text|bg|border|ring|from|via|to|outline|decoration|fill|stroke)-[a-zA-Z0-9-]+/([0-9]|[1-9][0-9])\b" app components | grep -vE "/(0|5|[1-9][05])\b"` → should return nothing.

### 2. `[x]` Fallback content fabricates credentials (prod) + silent CMS-less builds
`FALLBACK_*` data in Experience / Achievements / Writing / Education / Metrics / Skills is a
fictional persona (fake employers, fake awards, fake HBR/Fortune bylines, wrong school). Any
production render without Sanity data (missing env, outage, per-query 8s timeout) silently
showed it under the owner's real name. A production build with no `NEXT_PUBLIC_SANITY_PROJECT_ID`
succeeded with only console warnings.

- **Fix applied:**
  - `lib/config.ts` exports `showDevFallbacks` (`NODE_ENV !== 'production'`).
  - The 6 content sections use fallbacks **only in dev**; in production, no CMS data → the
    section renders `null` (absent section beats fabricated credentials).
  - **Kept always-on fallbacks (real identity data, deliberate):** Hero name/tagline/bio,
    WindowsTerminal profile fields & skill chips, Contact social links.
  - `next.config.js` fails `next build` (PHASE_PRODUCTION_BUILD) when the project id is missing,
    with escape hatch `ALLOW_BUILD_WITHOUT_SANITY=true` for intentional smoke builds
    (documented in `.env.example`).
- **Known degraded state (accepted):** if sections are hidden in prod, Navigation/palette
  anchors for them become no-ops. Revisit only if it ever matters in practice.
- **Optional later:** replace dev placeholder text with real career data so dev matches prod.

### 3. `[x]` Heading semantics — page has zero `<h2>`
Section titles were `<p>` (`components/ui/SectionLabel.tsx`, Contact panel title), so the outline
jumped h1 → h3. Also `DecryptText` exposed the label only via `aria-label` on a generic span
(unreliable in AT) with all visible text `aria-hidden`.
- **Done:** SectionLabel + Contact title render `<h2>` (styling unchanged); DecryptText carries
  an `sr-only` real-text node, animated layers stay `aria-hidden`, `aria-label` dropped.
- **Verified live:** dev render shows `h1:1 h2:7 h3:9`.

### 4. `[x]` Boot sequence housekeeping (behaviour stays, per owner)
**Owner decision:** boot plays on every visit — the existing **Skip intro** button (+ Esc/Space)
is the chosen mitigation; 2.6s is acceptable. Repeat-visit "session restored" micro-flash is
**Phase 2 item 1**, not this.
- **Done:** stale "first visit only" comment corrected in `components/LayoutShell.tsx`; a
  `<noscript>` style hides the opaque boot cover so no-JS visitors can read the page.

### 5. `[x]` Command palette is not announced as a dialog
No `role="dialog"`, `aria-modal`, or accessible name on the modal (verified 0 in DOM).
- **Done + verified live:** modal container in `components/CommandPalette.tsx` now carries
  `role="dialog" aria-modal="true" aria-label="Command palette"`.

### 6. `[x]` Skills tooltips unreachable by keyboard/touch
Descriptions only showed on hover of a non-focusable span (`components/Skills.tsx`).
- **Done:** pills with a description are focusable (`tabIndex=0`, focus-visible ring), tooltip
  shows via `group-focus-within` (covers keyboard Tab and touch tap-focus), and
  `aria-describedby` links pill → tooltip so AT announces the description.
- **Verification note:** compiled CSS rule, tab-reachability, and aria wiring machine-verified;
  the visual on-focus reveal could not be exercised in the headless test pane (it reports the
  page `hidden`, which suppresses focus pseudo-styling) — **10-second manual check: Tab to a
  skill pill, tooltip should appear.**

### 7. `[x]` Small verified fixes (batch)
- `[x]` `AnimatedCounter`: precision now derived from the target (`Number.isInteger(to)`) —
  integer metrics no longer flash decimals mid-count.
- `[x]` Palette `hire` output: `hello@` → `work@sidakpreetsingh.com`.
- `[d]` ~~Remove unused `styled-components`~~ — **false positive, kept**: it has zero direct
  imports but is a required **peer dependency** of `sanity` and `next-sanity` (embedded Studio).
  Do not remove.
- `[x]` Removed the dead manual `.env` parser in `lib/sanity.ts` (Next loads env files in every
  runtime path; the parser was unreachable).
- `[d]` ~~Remove `runtime = 'edge'` from icon/opengraph-image~~ — **attempted and reverted**:
  `next/og`'s Node runtime fails at prerender on Windows (`fileURLToPath` "Invalid URL" inside
  `@vercel/og`), so the edge runtime is load-bearing. Comments added in both files; the
  "disables static generation" build warning is expected and harmless.
- `[x]` 404 tab title added — `app/not-found.tsx` is now a thin server wrapper exporting
  metadata; the themed page moved verbatim to `components/NotFoundClient.tsx` (client components
  can't export metadata). Verified live: tab shows "404 — Page Not Found | Sidakpreet Singh".
- `[x]` `poweredByHeader: false` in `next.config.js` — verified live (header absent).
- `[x]` iOS-safe scroll lock: body lock now uses the `position: fixed` + saved-offset pattern
  (restored with `behavior: 'instant'` so CSS smooth-scroll can't animate the restore).
- `[x]` `npm audit fix` (safe only) applied — lockfile-only changes. Remaining 21 advisories
  need breaking changes (`--force` would downgrade sanity to v6 — do NOT run it); they sit in
  Studio/CLI dep chains or are Next advisories N/A for this config. Revisit at a Next 15 upgrade.

---

## Phase 2 — Premium polish (start only after Phase 1 is confirmed)

1. `[ ]` **Session-restored micro-flash** *(owner-approved shape)*: full boot (with Skip) on
   first visit per session; on same-session repeat loads show a brief "session restored" flash
   instead of the full sequence — **not** an instant blank skip. `sessionStorage` flag.
2. `[x]` Restore designed text hierarchy — done via Phase 1 fix #1.
3. `[ ]` **Cmd+K binding, Ctrl+K visuals** *(owner decision)*: additionally bind `⌘K`
   functionally for Mac visitors, but every visual hint keeps saying `Ctrl+K` — the Windows/
   terminal theme is deliberate and stays.
4. `[ ]` **Palette forgiveness for nav**: prefix/substring-match the navigation actions
   (`exp` → Experience). Easter-egg commands stay strict exact-match.
5. `[ ]` **Easter-egg roster** — currently 5 exist (`who`, `ping`, `status`, `stack`, `hire`);
   owner cap is 7 → room for 2. **Owner to pick 2 of these 3 suggestions** (all are static
   `TERMINAL_OUTPUTS` entries, Windows-native on purpose):
   - `winfetch` — neofetch-style profile card: `OS: sidakpreet-os v3.10 · Shell: PowerShell ·
     Host: IIM Indore '25 · Kernel: ex-Bain · GPU: gaming-grade · Uptime: <years> yrs`.
   - `winget` — fake `winget install sidakpreet` log: `Found Sidakpreet Singh [Portfolio] ·
     Installing... ██████ 100% · Successfully installed. Run 'hire' to activate license.`
   - `tasklist` — running processes gag: `strategy.exe · systems.exe · product.exe ·
     gaming.exe (high priority) · sleep.exe (not responding)`.
   - *(alt if one above is dropped: `sudo` — "User is not in the sudoers file. This incident
     will be reported (to your recruiter).")*
6. `[ ]` **Real mono weights**: JetBrains Mono loads only 400/700 but `font-medium`/
   `font-semibold` are used with `font-mono` in 7 places (browser fakes the weights). Load
   500 & 600 in `app/layout.tsx`, or normalise usage.
7. `[ ]` **Custom scrollbar** (`::-webkit-scrollbar` + `scrollbar-color`, thin/dark) — the
   default scrollbar is the one unthemed element.
8. `[ ]` **Press feedback + typography nits**: `active:` states on palette rows, nav rail
   items, social icons; remove `md:text-justify` on Experience bullets (rivers).
9. `[ ]` OG image tagline sync with hero tagline (or confirm the divergence is intentional).

### Rejected / not planned (owner decisions, 2025-06-07)
- `[d]` Mac `⌘K` **glyph/visuals** — never; theme is Windows/terminal (binding itself OK, see #3).
- `[d]` Experience accordion timing change — current slow-open is deliberate for multi-role
  orgs; revisit only if it bothers later. (ScrollReveal index-stagger cap parked with it.)
- `[d]` Email/social click-to-copy behaviour — stays exactly as is.
- `[d]` `apple-icon` — not needed.
- `[d]` LazyMotion bundle trim — skipped.
- `[d]` Custom cursor / WebGL / sound / PWA / page transitions — out of scope by design.

---

## Verification commands
```powershell
npm run build          # type-check + lint + build (fails without Sanity id unless ALLOW_BUILD_WITHOUT_SANITY=true)
npm run lint
npx tsc --noEmit
```
Post-change browser sanity: hero "properties" quote marks must be faint white
(`rgba(171,178,191,0.18)`), not orange; with no CMS + prod build, content sections are absent
while Hero/Contact render.
