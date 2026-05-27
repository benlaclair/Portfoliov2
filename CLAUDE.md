# benlaclair.com v2 — Claude session bootstrap

Personal portfolio for Ben LaClair (UX/UI + Graphic Designer). Astro 6 + GSAP 3.13 + Tailwind v4, deployed to Vercel.

**Read [HANDOFF.md](HANDOFF.md) first.** It is the master orientation and links to:
- [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) — color tokens, typography, chapter rhythm, logo variants
- [docs/ANIMATIONS.md](docs/ANIMATIONS.md) — every GSAP timeline, ScrollTrigger, observer, reveal pattern
- [docs/WORKFLOW.md](docs/WORKFLOW.md) — dev commands, branches, deploy, common tasks, don'ts

## Branch model

`main` is the only branch. All work happens directly on it. Push triggers a Vercel deploy to https://portfoliov2-jet-six.vercel.app. (This is a separate Vercel project from the v1 portfolio at benlaclair.com — anything done here does not touch the live site.)

## Current state

**Phase 9** is the most recent phase (committed `fd8224b`, 2026-05-26). The homepage hero is a scroll-driven `ScrollStage` with a `StickyBackground` (five crossfading bg layers) and three scramble-entrance headlines. The hero bg layer hosts a **Three.js WebGL `HeroCarousel`** — 8 graphic-design images on a 3D ring that auto-rotates continuously. The ring tilt/camera angle is still being tuned (see HANDOFF.md "Open items from Phase 9"). Phases 6–8 also all landed: section-contrast rhythm, architecture migration, and the full homepage rebuild (HeroGallery, scroll-gate curtain, indigo accent).

## Hard rules

- No Instrument Serif — it was dropped in Phase 3. Use `<span class="accent">` for accent words, not `<em>`.
- Never rename CSS custom properties (`--color-*`, `--font-*`) — inline `var()` references break silently.
- Never force-push to `main`. Fix forward with a new commit instead.
- Never `git rebase -i` or `git add -i` — interactive flags don't work in this shell.
