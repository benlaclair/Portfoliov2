# benlaclair.com v2 — Claude session bootstrap

Personal portfolio for Ben LaClair (UX/UI + Graphic Designer). Astro 6 + GSAP 3.13 + Tailwind v4, deployed to Vercel.

**Read [HANDOFF.md](HANDOFF.md) first.** It is the master orientation and links to:
- [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) — color tokens, typography, chapter rhythm, logo variants
- [docs/ANIMATIONS.md](docs/ANIMATIONS.md) — every GSAP timeline, ScrollTrigger, observer, reveal pattern
- [docs/WORKFLOW.md](docs/WORKFLOW.md) — dev commands, branches, deploy, common tasks, don'ts

## Branch model

`main` is the only branch. All work happens directly on it. Push triggers a Vercel deploy to https://portfoliov2-jet-six.vercel.app. (This is a separate Vercel project from the v1 portfolio at benlaclair.com — anything done here does not touch the live site.)

## Current state

**Phase 10** is the most recent phase (2026-05-27). Major homepage rebuild:

- **Hero**: single editorial headline on light parchment (`var(--color-bg)`), left-aligned, type-only. Wrapped in `.intro-stage` (200svh) with sticky-pinned `.intro-pin` (100svh). Hero text recedes via scrub-driven Z-translate + opacity + blur as user scrolls.
- **Sweep transition**: 16 curated graphic-design images (`src/data/sweepImages.ts`) form a horizontal strip that auto-plays R→L once the hero recede completes (triggered at 50% scroll via `ScrollTrigger.create({ once: true })`). Uses GSAP `SlowMo` ease (from `gsap/EasePack`) for dramatic slow-fast-slow pacing. Depth-of-field scaling via per-image `--sweep-scale` CSS variable updated each frame. Scroll is locked during sweep (`Lenis.stop()` + wheel/touch `preventDefault`). On complete: scroll unlocks, page auto-scrolls to `#work`.
- **Work section**: back to normal `variant="stack"` flow with per-card scrubs. Card 0's enter scrub is skipped (snapped to final state) for seamless handoff from the sweep.
- **Deleted**: `ScrollStage.astro`, `StickyBackground.astro`, `HeroCarousel.astro`, `scramble.ts`, `three` dep, vbreak section.
- **Added**: `src/data/sweepImages.ts`, `SlowMo` ease registration in `src/lib/motion.ts`.

Phases 6–8 still in place: section-contrast rhythm, architecture migration, HeroGallery (used by graphic-design case study page).

## Hard rules

- No Instrument Serif — it was dropped in Phase 3. Use `<span class="accent">` for accent words, not `<em>`.
- Never rename CSS custom properties (`--color-*`, `--font-*`) — inline `var()` references break silently.
- Never force-push to `main`. Fix forward with a new commit instead.
- Never `git rebase -i` or `git add -i` — interactive flags don't work in this shell.
