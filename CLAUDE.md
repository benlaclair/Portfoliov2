# benlaclair.com v2 — Claude session bootstrap

Personal portfolio for Ben LaClair (UX/UI + Graphic Designer). Astro 5 + GSAP 3.13 + Tailwind v4, deployed to Vercel.

**Read [HANDOFF.md](HANDOFF.md) first.** It is the master orientation and links to:
- [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) — color tokens, typography, chapter rhythm, logo variants
- [docs/ANIMATIONS.md](docs/ANIMATIONS.md) — every GSAP timeline, ScrollTrigger, observer, reveal pattern
- [docs/WORKFLOW.md](docs/WORKFLOW.md) — dev commands, branches, deploy, common tasks, don'ts

## Branch model

`main` is the only branch. All work happens directly on it. Push triggers a Vercel deploy to https://portfoliov2-jet-six.vercel.app. (This is a separate Vercel project from the v1 portfolio at benlaclair.com — anything done here does not touch the live site.)

## Current state

Phase 5 (case-study architecture refactor) is the most recent phase. Previous phases (1–4) have all landed: Astro/GSAP/Tailwind scaffold, warm parchment editorial system, Perplexity comp visual integration, reduced-motion + motion-correctness hardening. The case-study system is now slug-keyed via `src/data/caseStudies/` and rendered through modular components in `src/components/case-study/*` — no more if/else ladder in `work/[slug].astro`.

## Hard rules

- No Instrument Serif — it was dropped in Phase 3. Use `<span class="accent">` for accent words, not `<em>`.
- Never rename CSS custom properties (`--color-*`, `--font-*`) — inline `var()` references break silently.
- Never force-push to `main`. Fix forward with a new commit instead.
- Never `git rebase -i` or `git add -i` — interactive flags don't work in this shell.
