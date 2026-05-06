# benlaclair.com v2 — Claude session bootstrap

Personal portfolio for Ben LaClair (UX/UI + Graphic Designer). Astro 5 + GSAP 3.13 + Tailwind v4, deployed to Vercel.

**Read [HANDOFF.md](HANDOFF.md) first.** It is the master orientation and links to:
- [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) — color tokens, typography, chapter rhythm, logo variants
- [docs/ANIMATIONS.md](docs/ANIMATIONS.md) — every GSAP timeline, ScrollTrigger, observer, reveal pattern
- [docs/WORKFLOW.md](docs/WORKFLOW.md) — dev commands, branches, deploy, common tasks, don'ts

## Active branch

`claude/astro-gsap-portfolio-rebuild-3Jeel` — tracked by PR #1 (draft). Push here; Vercel posts a preview URL automatically.

## Current state

Phase 3 (Perplexity comp visual integration) is complete on the active branch:
Clash Display + Satoshi typography, light/dark chapter rhythm, SVG B-mark logo, word-reveal, live-dot pulse, coordinate readout, `[data-reveal]` cascade, clip-path mobile menu.

## Hard rules

- No Instrument Serif — it was dropped in Phase 3. Use `<span class="accent">` for accent words, not `<em>`.
- Never rename CSS custom properties (`--color-*`, `--font-*`) — inline `var()` references break silently.
- Never push to `main` directly. PR flow only.
- Never `git rebase -i` or `git add -i` — interactive flags don't work in this shell.
