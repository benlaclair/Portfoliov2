# benlaclair.com v2 — Handoff

Master orientation doc. Read this first, then dive into `docs/` as needed.

- [Design system](docs/DESIGN-SYSTEM.md) — tokens, fonts, chapter rhythm
- [Animations](docs/ANIMATIONS.md) — every GSAP timeline, ScrollTrigger, observer
- [Workflow](docs/WORKFLOW.md) — branches, commands, deploy, common tasks

---

## What this site is

Personal portfolio for Ben LaClair (UX/UI + Graphic Designer). Static Astro site with a GSAP-driven motion layer, deployed to Vercel.

- **Repo**: `benlaclair/Portfoliov2` ([github.com/benlaclair/Portfoliov2](https://github.com/benlaclair/Portfoliov2))
- **Branch model**: single-branch — `main` is where work happens.
- **Deploy**: `main` push → <https://portfoliov2-jet-six.vercel.app> (auto-deploys via Vercel). Separate Vercel project from the v1 site at benlaclair.com — anything done here does not touch the live portfolio.

The current visual language is the result of seven phases:

1. **Phase 1** — Astro/GSAP/Tailwind scaffold, Plus Jakarta Sans, dark `#080B0F` bg
2. **Phase 2** — Warm parchment editorial system (Inter Tight + Instrument Serif italic), full motion layer (Lenis, custom cursor, magnetic links, page curtain, loader, horizontal pin, timeline pin)
3. **Phase 3** — Perplexity comp visual integration: Clash Display + Satoshi typography, light/dark chapter rhythm, SVG B-mark logo, word-reveal, live-dot pulse, `[data-reveal]` cascade, clip-path mobile menu
4. **Phase 4** — Reduced-motion + motion-correctness hardening
5. **Phase 5** — Case-study architecture refactor: slug-keyed registry in `src/data/caseStudies/`, rendering pieces extracted to `src/components/case-study/*`, no more if/else ladder in `work/[slug].astro`
6. **Phase 6** — Section-contrast pass: 3-value rhythm (cream / mid-tone / dark), card-on-canvas pattern (Timeline, Tools, horizontal Work panels), navbar mode-aware substrate + animated underline + 60px height, three-room horizontal panels with accent-stroked dark middle card
7. **Phase 7** — Architectural migration: `src/lib/motion.ts` singleton, `@theme` shadow + typography utility tokens, `<Image />` for project covers, `[data-reveal]` replacing hand-rolled scroll reveals, `<RowList />` + `<Grid />` primitives consolidating case-study renderers, inline-style sweep

Phase 3 is a **visual/animation layer over Phase 2's content layout** — page structure (section order, copy, components) was intentionally unchanged; only paint, type, and motion were swapped. Phases 4–5 are correctness/architecture refinements. Phase 6 is visual rhythm. Phase 7 is pure architecture — zero visual change.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Astro 5 (static, file-based routing) |
| Styling | Tailwind v4 via `@tailwindcss/vite` + custom `@theme` tokens in `src/styles/global.css` |
| Motion | GSAP 3.13 + ScrollTrigger; Lenis 1.1 for smooth scroll |
| Type | Clash Display 500/600 + Satoshi 400/500/700 (Fontshare CDN) + JetBrains Mono 400/500 (Fontsource) |
| JS | Vanilla TypeScript only. No React. Page- and component-local `<script>` blocks. |
| Forms | Formspree proxy via `src/pages/api/contact.ts` |
| Deploy | Vercel (`@astrojs/vercel` adapter) |

No PostCSS config, no CSS preprocessor, no SSR. The site is pure static + client islands.

---

## File map

```text
src/
  layouts/
    BaseLayout.astro      Page chrome: <head>, fonts, cursor, curtain,
                          Lenis init, ScrollTrigger setup, [data-reveal]
                          IntersectionObserver, body[data-mode] tracking
  components/
    Navbar.astro          SVG B-mark + wordmark, links with animated
                          accent underline, EST clock, mode-aware
                          frosted substrate, clip-path mobile menu
    Footer.astro          Dark chapter, large SVG B-mark + wordmark, info grid
    HorizontalWork.astro  Phase 8 — vertical sticky-pin cards (file name
                          preserved for import stability), three-room
                          rhythm with dark middle card
    HeroGallery.astro     Phase 8 — 4-column infinite-loop gallery used by
                          the homepage hero AND /work/graphic-design
    ProjectCard.astro     Vertical project row used on /work
    ContactForm.astro     Form → /api/contact → Formspree
    case-study/           Phase 5 — modular case-study renderers
      Section.astro         Dispatcher; selects child by `kind`
      SectionShell.astro    Shared section wrapper (label + max-width frame)
      RowList.astro         Phase 7 — label/content rows primitive
                            (Decisions / Process / Challenges consume)
      Grid.astro            Phase 7 — bordered cell grid primitive
                            (Stats / Cards / Outcomes consume)
      Stats.astro           Stats cells via <Grid columns={4}>
      Cards.astro           Cards cells via <Grid columns={2|3}>
      Decisions.astro       Decision rows via <RowList cols="200px 1fr">
      Process.astro         Process steps via <RowList cols="80px 1fr">
      Challenges.astro      Challenge rows via <RowList cols="80px 1fr">
      Outcomes.astro        Outcomes via <Grid columns={3}>
      MetaOverview.astro    Meta block + overview text
      Video.astro           Embedded video w/ caption
  pages/
    index.astro           Homepage — Loader → Hero (phrase → gallery + CTA)
                          → Tagline → Vbreak → VerticalWork → Timeline → CTA
    work/
      index.astro         All projects grid (uses ProjectCard)
      [slug].astro        Case study template; reads from caseStudies
                          registry, no per-slug branches
      graphic-design.astro Phase 8 — full-page <HeroGallery fullPage />
                          (was masonry + lightbox)
    about.astro           Hero + stats + bio + experience timeline
    contact.astro         Hero + ContactForm + email/social links
    tools.astro           Editorial rows for AI tools
    api/contact.ts        Formspree proxy (server endpoint)
    robots.txt.ts         Generated robots.txt
  data/
    projects.ts           Featured + all projects (4 entries)
    graphicDesign.ts      86 images grouped by client
    tools.ts              AI tools cards
    caseStudies/          Phase 5 — slug-keyed case-study registry
      types.ts              Discriminated CaseStudySection union
      index.ts              Registry of slug → CaseStudy
      vlier.ts, veo.ts, portfolio.ts
  lib/
    motion.ts             Phase 7 — gsap + ScrollTrigger singleton,
                          ease tokens, reactive reduceMotion, revealLines()
                          helper. All scripts import from here.
  styles/
    global.css            @theme tokens (colors, shadows, fonts, scale),
                          @utility classes (text-display-{xl,lg,md,sm},
                          text-eyebrow{,-accent}, text-meta, text-body*),
                          base, motion helpers, cursor, curtain, vbreak,
                          [data-reveal], pulse, atmo-* utilities
public/
  graphics/               86 design webp images   (untracked, copy from v1)
  images/                 project covers + assets (untracked, copy from v1)
  videos/                 VEO Olympics broadcast  (untracked, copy from v1)
  resume.pdf                                       (untracked, copy from v1)
  favicon.svg
```

---

## Mental model

**The homepage is a sequence of "chapters"** — each section is painted either dark or light to create rhythm. The dark chapters (Loader, Hero, Vbreak, CTA, Footer) are the chromatic anchors; light chapters (Tagline, VerticalWork, Timeline) are the editorial reading beats.

**Motion is layered, not orchestrated.** Each section owns its own GSAP code. The only cross-section coordination is the loader-to-hero intro timeline (in `src/pages/index.astro`) and `body[data-mode]` tracking (in `BaseLayout.astro`).

**Text reveals come in three flavors**, used deliberately:

- **Word-reveal** (`.word > span` yPercent 115→0): hero phrase, after loader exits
- **Line-reveal** (`.line > span` yPercent 110→0): CTA, contact, work hero, etc.
- **`[data-reveal]` cascade** (opacity 0→1 + translateY 18→0 with sibling stagger): everything else — fills the gaps, keeps the page feeling consistently animated without one-off ScrollTrigger plumbing per element

See [docs/ANIMATIONS.md](docs/ANIMATIONS.md) for the full motion inventory.

---

## Quick start

```bash
git clone <this repo>
cd Portfoliov2
npm install
npm run dev          # http://localhost:4321
npm run build        # static output to dist/
npm run check        # astro type-check
```

Env: copy `.env.example` to `.env.local` and set `FORMSPREE_ID` (only needed for the contact form locally; Vercel has it set as a project env var).

Asset migration if you're cloning fresh: `public/graphics/`, `public/images/`, `public/videos/`, and `public/resume.pdf` are binary, large, and **not tracked in this repo** — `npm run build` will succeed without them, but most pages will render with broken `<img>` and `<video>` sources, and Vercel preview/production builds expect them present. Pull them from the v1 repo (`benlaclair/portfolio` main); see `README.md` for the copy commands. `public/favicon.svg` is the only public asset committed here.

---

## Working on this project

### Branches

- `main` is the only branch. Push triggers a Vercel deploy. No PR flow, no preview branches.
- For experimental work, branch off main locally if you want to compare a state before pushing. Don't push exploratory branches to origin — keep the remote tidy.

### Commit style

Subject line uses conventional-commit-ish prefixes:

- `feat:` new feature or section
- `fix:` bug fix
- `refactor:` non-behavioral change
- `redesign:` visual overhaul (used on Phase 2)
- `feat(deploy):`, `feat(pages):` scope where useful

Body bullets describe the why, not the diff. See `git log --oneline main` for examples.

### Common tasks

#### Add a new project case study

1. Add entry to `src/data/projects.ts` (the `Project` type tells you the shape).
2. If it has detailed sections, create `src/data/caseStudies/<slug>.ts` modeled on `vlier.ts` / `portfolio.ts`. Section types are defined in `caseStudies/types.ts` (discriminated union by `kind`).
3. Register the case study in `src/data/caseStudies/index.ts`. The `[slug].astro` template reads the registry — no per-slug branches needed anymore.
4. Drop hero asset in `public/images/`, set `coverImage` in the project entry.

#### Add a homepage section

1. Decide light vs dark — match the chapter rhythm in [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md).
2. Add the markup to `src/pages/index.astro` between the existing sections. If dark, add `class="is-dark has-halos"` (halos optional) and `data-section-mode="dark"`.
3. Add `data-reveal` attributes to the children you want cascaded. They'll be picked up automatically by the IntersectionObserver in `BaseLayout.astro`.
4. Don't forget mobile breakpoint (`@media (max-width: 900px)`).

#### Tweak a typography token

Edit `src/styles/global.css` `@theme` block. Avoid changing token names — the inline `var(--font-display)` references in pages will break silently if renamed.

#### Add a new animation

Read [docs/ANIMATIONS.md](docs/ANIMATIONS.md) first. Most additions should be either a `[data-reveal]` (free, no JS needed) or a section-local ScrollTrigger in the page's `<script>` block. Don't pile new globals into `BaseLayout.astro` unless they apply site-wide.

#### Test reduced-motion

DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`. The loader should skip, the hero should be visible immediately, the cursor should hide, Lenis should be off, and `[data-reveal]` elements should be visible without transition.

---

## Known issues / debt

- **No automated tests.** Visual changes get verified by manual scroll-through on the Vercel deploy. If the project grows, consider Playwright for the loader-to-hero intro chain — it's the most fragile bit.
- **Lighthouse**: no recent audit. Fontshare CDN adds a ~150KB CSS request and two woff2s; Phase 2's local `@fontsource` was lighter. If LCP regresses, switch to self-hosting Clash + Satoshi via the woff2 files (Fontshare allows direct download).
- **Untracked binary assets**: `public/graphics/`, `public/images/`, `public/videos/`, `public/resume.pdf` need to be copied from the v1 repo for the Vercel deploy to render correctly.

---

## What's next

Phase 8 (the 2026-05 homepage rebuild) shipped: minimal hero phrase that auto-transitions to a 4-column infinite-loop gallery + CTA, scroll-past curtain wipe at the hero→tagline boundary, vertical sticky-pin Work cards (was horizontal), graphic-design page rebuilt with the same gallery, accent swapped from orange `#ff5c1a` to muted indigo `#5b6cab`, decorative copy and the Marquee section removed. Full tracker preserved in [docs/REBUILD-2026-05.md](docs/REBUILD-2026-05.md) for reference.

Phase 6 (section contrast) and Phase 7 (architectural migration) both shipped to `main`. The site has a 3-value rhythm (cream / mid-tone / dark), card-on-canvas pattern across Timeline / Tools / horizontal Work, a mode-aware navbar at 60px height with animated accent underline, and the horizontal Work panels render as three-room cards with the dark middle card outlined in 2px accent stroke. Phase 7 extracted `src/lib/motion.ts`, added `@theme` shadow + typography utility tokens, migrated covers to `<Image />`, replaced 4 pages' worth of hand-rolled scroll reveals with `[data-reveal]`, and consolidated 6 case-study renderers behind `<RowList />` + `<Grid />` primitives.

### Open items (smaller, surgical)

- **Real assets** — copy `public/graphics/`, `public/images/`, `public/videos/`, `public/resume.pdf` from the v1 repo. The four project covers in `src/data/projects.ts` reference `/images/projects/*.jpg` (1440×900) that need to actually exist. Re-shoot or re-render the featured project covers in a consistent treatment. **Phase 8 also expects 86 webp files in `public/graphics/`** — without them the HeroGallery on home + `/work/graphic-design` renders empty columns.
- **HeroGallery `<Image />` migration** — Phase 8 ships with raw `<img loading="lazy">` and natural aspect ratios (per the "flex to art" guidance). If LCP regresses or responsive serving becomes worth it, add `width`/`height` per entry in `src/data/graphicDesign.ts` and swap to `<Image widths={[300, 600, 900]} sizes="…">`.
- **HeroGallery perf gate** — 86 lazy images in the homepage hero. Most decode below the fold so lazy works, but if Lighthouse flags LCP, gate column initialization (and `src=` swap from `data-src`) on the phrase-exit moment instead of immediate decode.
- **`<ClientRouter />` (View Transitions API)** — parked from Phase 7 plan as a separate initiative. Would replace the hand-rolled `.page-curtain` in `BaseLayout.astro` (lines ~202-243) with Astro 5's `<ClientRouter />`. Real upside: SPA-like navigation, persistent Lenis + cursor state, shared-element flights between `/work` grid and case-study heros. Real risk: requires re-binding ScrollTrigger and `[data-section-mode]` observers on `astro:after-swap`. Also needs to coordinate with the new `.hero-curtain` from Phase D.
- **Tier 3 audit remnants** — Duplicate count-up animation pattern (`about.astro` stat counters + `index.astro` loader pct) could become a single `<Counter />` component. ContactForm error surface shows a single generic message for all non-200s — should distinguish 422 / 429 / 500. No linter/prettier in `package.json` — CRLF/LF warnings on every commit, would be solved by a `.gitattributes` + prettier config. (Graphic-design `onmouseover` resolved in Phase F.)
- **Performance pass** — Lighthouse audit, font self-hosting from Fontshare woff2s if LCP regresses, real-asset image weight check once binaries land.
- **Content polish** — write the portfolio case study with screenshots; add a 4th project to the homepage hero count if `projects.ts` grows.
- **Case-study visual richness** — the template is editorial but text-heavy. Inline diagrams or before/after image pairs would make Vlier and VEO read better.
