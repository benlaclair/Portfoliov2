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
- **Deploy**: `main` push → https://portfoliov2-jet-six.vercel.app (auto-deploys via Vercel). Separate Vercel project from the v1 site at benlaclair.com — anything done here does not touch the live portfolio.

The current visual language is the result of five phases:

1. **Phase 1** — Astro/GSAP/Tailwind scaffold, Plus Jakarta Sans, dark `#080B0F` bg
2. **Phase 2** — Warm parchment editorial system (Inter Tight + Instrument Serif italic), full motion layer (Lenis, custom cursor, magnetic links, page curtain, loader, horizontal pin, timeline pin)
3. **Phase 3** — Perplexity comp visual integration: Clash Display + Satoshi typography, light/dark chapter rhythm, SVG B-mark logo, word-reveal, live-dot pulse, coordinate readout, `[data-reveal]` cascade, clip-path mobile menu
4. **Phase 4** — Reduced-motion + motion-correctness hardening
5. **Phase 5** — Case-study architecture refactor: slug-keyed registry in `src/data/caseStudies/`, rendering pieces extracted to `src/components/case-study/*`, no more if/else ladder in `work/[slug].astro`

Phase 3 is a **visual/animation layer over Phase 2's content layout** — page structure (section order, copy, components) was intentionally unchanged; only paint, type, and motion were swapped. Phases 4–5 are correctness/architecture refinements that don't change visual output.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Astro 5 (static, file-based routing) |
| Styling | Tailwind v4 via `@tailwindcss/vite` + custom `@theme` tokens in `src/styles/global.css` |
| Motion | GSAP 3.13 + ScrollTrigger; Lenis 1.1 for smooth scroll |
| Type | Clash Display 500/600 + Satoshi 400/500/700 (Fontshare CDN) + JetBrains Mono 400/500 (Fontsource) |
| React | One island only — `ContactForm.tsx` (and `Navbar.tsx` for state) |
| Forms | Formspree proxy via `src/pages/api/contact.ts` |
| Deploy | Vercel (`@astrojs/vercel` adapter) |

No PostCSS config, no CSS preprocessor, no SSR. The site is pure static + client islands.

---

## File map

```
src/
  layouts/
    BaseLayout.astro      Page chrome: <head>, fonts, cursor, curtain,
                          Lenis init, ScrollTrigger setup, [data-reveal]
                          IntersectionObserver, body[data-mode] tracking
  components/
    Navbar.tsx            SVG B-mark + wordmark, links, EST clock,
                          coordinate readout, clip-path mobile menu (React)
    Footer.astro          Dark chapter, large SVG B-mark + wordmark, info grid
    HorizontalWork.astro  Pinned horizontal scroll, 3 case study panels,
                          shrink-on-focus, side-rail wayfinding
    Marquee.astro         Looping ticker, hover-slow
    ProjectCard.astro     Vertical project row used on /work
    ContactForm.tsx       React form → /api/contact → Formspree
    case-study/           Phase 5 — modular case-study renderers
      Section.astro         Dispatcher; selects child by `kind`
      SectionShell.astro    Shared section wrapper
      Stats.astro           Stats grid
      Cards.astro           Grid of cards
      Decisions.astro       Numbered decision list
      Process.astro         Process steps
      Challenges.astro      Challenge list
      Outcomes.astro        Outcomes / impact
      MetaOverview.astro    Meta block + overview text
      Video.astro           Embedded video w/ caption
  pages/
    index.astro           Homepage — Loader → Hero → Tagline → Vbreak →
                          HorizontalWork → Marquee → Timeline → CTA
    work/
      index.astro         All projects grid (uses ProjectCard)
      [slug].astro        Case study template; reads from caseStudies
                          registry, no per-slug branches
      graphic-design.astro Masonry gallery + vanilla JS lightbox
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
  styles/
    global.css            @theme tokens, base, utilities, motion helpers,
                          cursor, curtain, vbreak, [data-reveal], pulse
public/
  graphics/               86 design webp images   (untracked, copy from v1)
  images/                 project covers + assets (untracked, copy from v1)
  videos/                 VEO Olympics broadcast  (untracked, copy from v1)
  resume.pdf                                       (untracked, copy from v1)
  favicon.svg
```

---

## Mental model

**The homepage is a sequence of "chapters"** — each section is painted either dark or light to create rhythm. The dark chapters (Loader, Hero, Vbreak, CTA, Footer) are the chromatic anchors; light chapters (Tagline, HorizontalWork, Marquee, Timeline) are the editorial reading beats.

**Motion is layered, not orchestrated.** Each section owns its own GSAP code. The only cross-section coordination is the loader-to-hero intro timeline (in `src/pages/index.astro`) and `body[data-mode]` tracking (in `BaseLayout.astro`).

**Text reveals come in three flavors**, used deliberately:
- **Word-reveal** (`.word > span` yPercent 115→0): hero only, after loader exits
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

**Add a new project case study**
1. Add entry to `src/data/projects.ts` (the `Project` type tells you the shape).
2. If it has detailed sections, create `src/data/caseStudies/<slug>.ts` modeled on `vlier.ts` / `portfolio.ts`. Section types are defined in `caseStudies/types.ts` (discriminated union by `kind`).
3. Register the case study in `src/data/caseStudies/index.ts`. The `[slug].astro` template reads the registry — no per-slug branches needed anymore.
4. Drop hero asset in `public/images/`, set `coverImage` in the project entry.

**Add a homepage section**
1. Decide light vs dark — match the chapter rhythm in [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md).
2. Add the markup to `src/pages/index.astro` between the existing sections. If dark, add `class="is-dark has-halos"` (halos optional) and `data-section-mode="dark"`.
3. Add `data-reveal` attributes to the children you want cascaded. They'll be picked up automatically by the IntersectionObserver in `BaseLayout.astro`.
4. Don't forget mobile breakpoint (`@media (max-width: 900px)`).

**Tweak a typography token**
Edit `src/styles/global.css` `@theme` block. Avoid changing token names — the inline `var(--font-display)` references in pages will break silently if renamed.

**Add a new animation**
Read [docs/ANIMATIONS.md](docs/ANIMATIONS.md) first. Most additions should be either a `[data-reveal]` (free, no JS needed) or a section-local ScrollTrigger in the page's `<script>` block. Don't pile new globals into `BaseLayout.astro` unless they apply site-wide.

**Test reduced-motion**
DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`. The loader should skip, the hero should be visible immediately, the cursor should hide, Lenis should be off, and `[data-reveal]` elements should be visible without transition.

---

## Known issues / debt

- **No automated tests.** Visual changes get verified by manual scroll-through on the Vercel deploy. If the project grows, consider Playwright for the loader-to-hero intro chain — it's the most fragile bit.
- **Lighthouse**: no recent audit. Fontshare CDN adds a ~150KB CSS request and two woff2s; Phase 2's local `@fontsource` was lighter. If LCP regresses, switch to self-hosting Clash + Satoshi via the woff2 files (Fontshare allows direct download).
- **Untracked binary assets**: `public/graphics/`, `public/images/`, `public/videos/`, `public/resume.pdf` need to be copied from the v1 repo for the Vercel deploy to render correctly.

---

## What's next

Phase 6 (refinement) — open scope. Two big direction decisions on the table:

### Direction 1 — Section contrast: layered material, not just value alternation

The current rhythm is two-value (cream + ink) with most sections being single-canvas. The horizontal cards section is the only one doing it right — paper-toned card on cream canvas, image inside the card. Three layers. Tagline, Timeline, Marquee, Tools are flat: one bg, no card, no atmospheric treatment. The unlock is **layered material per section** — base tone + inset surface + atmospheric layer — so each section reads like a *room*, not a paint chip.

Reference points: Stripe, Linear, Vercel marketing pages, the Phase 3 source comp, Robin Mastromarino's portfolio. None get depth from value alternation alone — they layer.

Changes, ranked by impact:

1. **Activate the mid-tone.** `--color-bg-alt` / `--color-bg-2` (#ece6d6) is defined and barely used. Put Tagline (or Marquee) on it. Rhythm becomes three values instead of two — cheapest, biggest perceptual shift.
2. **Card-on-canvas as a section primitive.** Wrap Timeline year+blurb and Tools rows in paper-toned cards, same approach as the Work cards. Adds a depth layer per section without redesigning typography.
3. **Atmospheric effects per section.** Light sections get a soft radial warmth from one corner (mirror of the dark `has-halos` class). Dark sections get film grain via SVG-as-data-URL with `mix-blend-mode: overlay`. CSS-only, no asset cost.
4. **Replace 1px dividers with deliberate transitions.** Either generous whitespace and no divider, or a soft color bleed (linear-gradient one bg → next bg) at section boundaries. The 1px lines are a Phase 2 holdover that reads utilitarian against everything else.
5. **Let accent anchor one section, sparingly.** Vbreak or a new chapter marker that's almost entirely orange-on-near-black. Currently accent only does hover/word-tint duty — could carry one whole chapter once.

Discipline rules:

- Pick exactly 3 bg values + 1 accent. Refuse to add a fifth.
- Build 3–4 named atmospheric utilities (`atmo-warmth-tl`, `atmo-grain-dark`) and reuse — not per-section snowflakes.
- Card-on-canvas works for grouped content, not narrative paragraphs. Tagline stays card-less; it gets an atmospheric tint instead.

### Direction 2 — Stack: drop React

The two React islands (Navbar, ContactForm) need ~50 lines of vanilla JS to replicate: toggle a class for the mobile menu, set `innerText` for the EST clock, fetch + UI feedback for the contact form. Right now you're shipping React + react-dom (~100KB) for that. The hydration mismatch class of bug *only exists because* of islands (see [`fix: suppress Navbar coordinate-readout hydration warning`](https://github.com/benlaclair/Portfoliov2/commit/57897d8) for the most recent example).

Plan:

- `Navbar.tsx` → `Navbar.astro` (vanilla menu toggle, EST clock, focus trap, ~30 lines)
- `ContactForm.tsx` → `ContactForm.astro` (vanilla submit + UI feedback, ~25 lines)
- Drop `@astrojs/react`, `react`, `react-dom`, `@types/react*`, `@gsap/react` from `package.json`
- Remove `@astrojs/react` integration from `astro.config.mjs`
- Remove `client:load` directives wherever they exist

Defer if interactive features are coming (filtering, search, complex form wizards). As of 2026-05-06 there are no plans, so compaction is the right move. Afternoon-sized.

### Other open candidates (smaller)

- **Real assets** — copy `public/graphics/`, `public/images/`, `public/videos/`, `public/resume.pdf` from the v1 repo so the Vercel deploy renders correctly. Current covers in v1 are partly placeholder; re-shoot or re-render the three featured project covers in a consistent treatment.
- **Performance pass** — Lighthouse audit, font self-hosting if needed, image `sizes` attributes on the responsive `<img>` tags.
- **Content polish** — write the portfolio case study with screenshots; add a 4th project to the homepage hero count if `projects.ts` grows.
- **Case-study visual richness** — the case-study template is editorial but text-heavy. Inline diagrams or before/after image pairs would make Vlier and VEO read better.
- **Graphic-design lightbox** — currently vanilla JS in `graphic-design.astro`. Works but is the only non-GSAP motion on the site; could be migrated for consistency.

### Suggested sequencing

Do the React drop first (mechanical, low-risk, simplifies everything underneath), then the visual/contrast work on a clean platform. Or visual first if you'd rather have something to look at while the JS rewrite is happening. Either order works — they don't interfere.
