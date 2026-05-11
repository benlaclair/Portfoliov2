# Portfoliov2 — 2026-05 rebuild

In-progress build. Hero rebuild, indigo accent, vertical work cards, infinite-loop gallery, copy audit.

> **Last touched:** 2026-05-11
> **Next up:** Phase D — scroll-past curtain wipe
> **Resume how:** `git pull origin main && git log --oneline | grep "Phase"` then pick up at the first unchecked phase below.

This doc is the resumption beacon for working across multiple chat sessions / machines. A fresh chat reads this first, then [HANDOFF.md](../HANDOFF.md) for general orientation.

---

## Decisions captured

| Decision | Value |
| --- | --- |
| Indigo accent | `#5b6cab` (hover `#7080c0`, soft `rgba(91, 108, 171, 0.14)`) |
| Hero composition | **Replace** — phrase first, then gallery beat (not overlay) |
| Loader | Stays as-is (no copy changes) |
| Image dimensions | Fixed column width + natural-height images (no data file w/h migration) |
| Hero phrase | `Type that reads. Motion that means something.` |
| CTA destination | `/work/graphic-design`, label "View design work →" |
| Side-rail (vertical work) | **Dropped** — vertical scroll is its own wayfinding |
| Lightbox (graphic-design) | **Removed** — gallery is view-only after rebuild |
| Marquee section | **Removed** — chapter rhythm tightens to D · L · L · L · D · D |
| Vbreak quote | New copy `Details that hold up under scrutiny.` (hero now owns the old quote) |

---

## Phase tracker

- [x] **Phase A — Color system swap (orange → indigo)** (commit `5068aa3`)
  - Tokens in [src/styles/global.css](../src/styles/global.css): `--color-accent`, `--color-accent-hover`, `--color-accent-soft` → indigo
  - Re-tune `.has-halos::after` cool-blue → warm cream-amber so it doesn't twin with the new indigo
  - Replace 4 rgba(255,92,26,…) literals: `--shadow-card-dark-active`, `.atmo-warmth-tl::before`, `.atmo-warmth-br::before`, `.vbreak-bg`
  - 38 component-level `var(--color-accent)` references update automatically
  - **What landed:** All tokens + 4 literals swapped. **Deviation:** the atmo-warmth utilities were shifted to actual warm cream-amber `rgba(220,170,110,…)` instead of following the (now-cool) accent — the "warmth" name is semantic and shouldn't follow accent into a cool palette. Vbreak-bg tint follows the new indigo accent. Check + build clean.

- [x] **Phase B — Copy audit edits** (commit `ef39e66`)
  - [src/pages/index.astro](../src/pages/index.astro): drop "— 01 / Statement", "— 04 / On the record", "— 05 / Reach out"; vbreak quote → "Details that hold up under scrutiny."
  - [src/components/HorizontalWork.astro](../src/components/HorizontalWork.astro): drop "— 02 / Selected work" + intro sentence (file gets full rewrite in Phase E)
  - **Delete [src/components/Marquee.astro](../src/components/Marquee.astro)** and its import/usage in index.astro
  - [src/components/Footer.astro](../src/components/Footer.astro): drop "Built with / Astro · GSAP" cell, "Designed & built from scratch", "v2.0"
  - Loader copy preserved; timeline data preserved
  - **What landed:** All audit cuts shipped. Marquee deleted (file count 40 → 39). Orphaned CSS rules removed (`.tagline-num`, `.cta-num`, `.hwork-num`, `.hwork-header-right`); `.timeline-top` re-anchored to `justify-content: flex-end` since the eyebrow span is gone. Chapter rhythm in DESIGN-SYSTEM.md updated to D · D · L · D · L · L · D · D. Check + build clean.

- [x] **Phase C — Hero rebuild (minimal phrase → HeroGallery + CTA)** (commit `9980172`)
  - Rewrite hero markup in [src/pages/index.astro](../src/pages/index.astro)
  - New component [src/components/HeroGallery.astro](../src/components/HeroGallery.astro): 4 columns, round-robin distribute 86 images, doubled-list seamless loop, per-column varied speed (60/45/75/50s), odd cols up + even cols down for layered counter-motion
  - Sequencing: existing loader → phrase word-reveal (~1.1s) → 3.5s dwell → phrase exit + gallery fade-in + CTA fade-in
  - Reduced-motion: static grid
  - **What landed:** Hero rebuilt as overlapping stack (gallery behind a dim scrim z:1-2, phrase centered z:3, CTA pill bottom-center z:4). All three children opacity-keyed so the sequencing is purely tween-driven. Bottom-center CTA chosen over middle to keep gallery focal. **Perf note for Phase G QA:** 86 `<img loading="lazy">` will partially lazy-load since most are below the viewport, but the first row decodes immediately. If LCP regresses, gate decoding behind the phrase-exit moment (intersection observer or explicit data-src swap). **Follow-up:** divider between hero and tagline removed (the dark/light handoff is now the natural background contrast; Phase D will add the curtain wipe to dramatize it).

- [ ] **Phase D — Scroll-past curtain wipe**
  - New `<div class="hero-curtain">` inside `.hero` (NOT BaseLayout's `.page-curtain`)
  - ScrollTrigger on `.hero` with `start: 'bottom bottom'`, `end: 'bottom top'`, scrub 0.6
  - Animates `yPercent: 100 → 0 → -100` — rises from below, covers, exits up revealing tagline

- [ ] **Phase E — HorizontalWork → VerticalWork**
  - Rewrite [src/components/HorizontalWork.astro](../src/components/HorizontalWork.astro) in place (preserve import in index.astro)
  - 3 stacked cards, gap 80px. Per-card ScrollTrigger: scale 0.92→1, yPercent 12→0, opacity 0.6→1, image clip-path inset(0 100% 0 0)→inset(0)
  - Inner image parallax preserved (yPercent -8→8)
  - Active state via IntersectionObserver multiple thresholds; dark middle card flips `body[data-mode]`
  - Side-rail wayfinding **dropped**

- [ ] **Phase F — graphic-design.astro rebuild**
  - [src/pages/work/graphic-design.astro](../src/pages/work/graphic-design.astro) renders `<HeroGallery fullPage />` for slower full-document browse rhythm
  - **Lightbox removed entirely** — modal DOM, click handlers, keyboard nav, inline `onmouseover` all gone
  - Keep page hero block above the gallery for landing identity

- [ ] **Phase G — Final QA + tracker close-out**
  - Visual scan every page after indigo swap
  - Reduced-motion validation
  - Mobile breakpoints (≤900px, ≤600px)
  - `npm run check` + `npm run build` clean
  - Update HANDOFF.md "What's next" back to the pre-rebuild backlog
  - Add Phase 8 entry to [project_portfolio_v2 memory](file:///C:/Users/blaclair/.claude/projects/C--Users-blaclair/memory/project_portfolio_v2.md)

---

## Per-phase update protocol (mandatory)

After each phase's code commit lands, before moving to the next:

1. Tick the checkbox above for the phase just completed.
2. Update `Last touched:` and `Next up:` at the top.
3. Add a `**What landed:**` line under the phase listing exactly what shipped + any deviations + any follow-ups discovered.
4. Commit the doc update separately: `docs: tick Phase <X> in rebuild tracker`. Keeps the tracker truthful in main without entangling it with the feature diff.
5. If session is about to run out of usage, also append to `## Rebuild progress` in [project_portfolio_v2 memory](file:///C:/Users/blaclair/.claude/projects/C--Users-blaclair/memory/project_portfolio_v2.md) so the signal survives across machines outside the repo.

## Commit-message convention

`<type>(scope): Phase <X> — <short description>`. Examples:

- `feat(color): Phase A — swap orange accent to indigo #5b6cab`
- `refactor(copy): Phase B — remove section numbers, build credits, marquee`
- `feat(hero): Phase C — minimal phrase → 4-column gallery transition`
- `feat(hero): Phase D — scroll-past curtain wipe`
- `refactor(work): Phase E — convert horizontal scroll to vertical sticky-pin cards`
- `refactor(gallery): Phase F — auto-scrolling 4-column infinite loop`

`git log --oneline | grep "Phase"` becomes the next chat's checkpoint view.
