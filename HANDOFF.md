# benlaclair.com v2 — Handoff

Master orientation doc. Read this first, then dive into `docs/` as needed.

- [Design system](docs/DESIGN-SYSTEM.md) — tokens, fonts, chapter rhythm
- [Animations](docs/ANIMATIONS.md) — every GSAP timeline, ScrollTrigger, observer
- [Workflow](docs/WORKFLOW.md) — branches, commands, deploy, common tasks

---

## What this site is

Personal portfolio for Ben LaClair (UX/UI + Graphic Designer). Static Astro site with a GSAP-driven motion layer, deployed to Vercel.

- **Production**: `main` branch → https://benlaclair.com (auto-deploys via Vercel)
- **Active dev**: `claude/astro-gsap-portfolio-rebuild-3Jeel` → PR #1 (preview deploys per push). Phase 1 stabilization (`ae12e71`) and Phase 2 cleanup are local; nothing has been pushed since `a31ad02`.
- **Repo**: `benlaclair/Portfoliov2`

The current visual language is the result of three iterations:

1. **Phase 1** — Astro/GSAP/Tailwind scaffold, Plus Jakarta Sans, dark `#080B0F` bg
2. **Phase 2** — Warm parchment editorial system (Inter Tight + Instrument Serif italic), full motion layer (Lenis, custom cursor, magnetic links, page curtain, loader, horizontal pin, timeline pin)
3. **Phase 3** — Perplexity comp visual integration (current): Clash Display + Satoshi typography, light/dark chapter rhythm, SVG B-mark logo, word-reveal, live-dot pulse, coordinate readout, `[data-reveal]` cascade, clip-path mobile menu

Phase 3 is a **visual/animation layer over Phase 2's content layout**. The page structure (section order, copy, components) is intentionally unchanged from Phase 2 — only paint, type, and motion were swapped.

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
  pages/
    index.astro           Homepage — Loader → Hero → Tagline → Vbreak →
                          HorizontalWork → Marquee → Timeline → CTA
    work/
      index.astro         All projects grid (uses ProjectCard)
      [slug].astro        Case study template (vlier, veo-olympics, portfolio)
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
    vlierCaseStudyData.ts
    veoCaseStudyData.ts
    caseStudyData.ts      portfolio (this site) case study
  styles/
    global.css            @theme tokens, base, utilities, motion helpers,
                          cursor, curtain, vbreak, [data-reveal], pulse
public/
  graphics/               86 design webp images
  images/                 project covers + assets
  videos/                 VEO Olympics broadcast
  resume.pdf
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
- `main` is production. Vercel auto-deploys on push.
- All dev happens on `claude/astro-gsap-portfolio-rebuild-3Jeel`. PR #1 tracks it. Vercel posts a preview URL on each push.
- `prototype/experimental-portfolio-rebuild` — frozen reference; the Perplexity comp the Phase 3 design tokens were lifted from. Don't merge from it; cherry-pick details if needed.

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
2. If it has detailed sections (decisions/process/outcomes), add a `<slug>CaseStudyData.ts` file alongside the existing ones and import it in `src/pages/work/[slug].astro` via the same `if (project.slug === '<new>')` pattern.
3. Drop hero asset in `public/images/`, set `coverImage` in the project entry.

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

- **PR #1** has accumulated 3 phases of work plus Phase 1 stabilization and Phase 2 cleanup. Once it lands, squash-merge and start each future phase as a fresh PR off `main`.
- **No automated tests.** Visual changes get verified by Vercel preview deploys + manual scroll-through. If the project grows, consider Playwright for the loader-to-hero intro chain — it's the most fragile bit.
- **Lighthouse**: no recent audit. Fontshare CDN adds a ~150KB CSS request and two woff2s; Phase 2's local `@fontsource` was lighter. If LCP regresses, switch to self-hosting Clash + Satoshi via the woff2 files (Fontshare allows direct download).

---

## What's next

No explicit Phase 4 scope yet. Most likely future work:

- **Content polish** — write the portfolio case study to describe Phase 3 properly with screenshots; add the missing 4th project to the homepage hero count if `projects.ts` grows. (Phase 1 already swept the stale "Instrument Serif + Geist" copy in `projects.ts` and `caseStudyData.ts`.)
- **Real assets** — current `public/images` covers are from v1; some are placeholder. Re-shoot or re-render the three featured project covers in a consistent treatment.
- **Performance pass** — Lighthouse audit, font self-hosting if needed, image `sizes` attributes on the few responsive `<img>` tags.
- **Case study visual richness** — the case study template (`work/[slug].astro`) is editorial but text-heavy. Adding inline diagrams or before/after image pairs would make Vlier and VEO read better.
- **Graphic design lightbox** — currently vanilla JS in `graphic-design.astro`. Works but is the only non-GSAP motion on the site; could be migrated for consistency.

---

## Contact for context

Original session conversation lives in Claude Code session history. The plan that produced Phase 3 is preserved at `~/.claude/plans/async-petting-quilt.md` if you have access to that machine; otherwise the commit `d1f1e4e` body has the full change list.
