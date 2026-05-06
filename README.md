# benlaclair.com v2

Astro + GSAP + Tailwind v4 rebuild of [benlaclair.com](https://benlaclair.com).

> **For a full handoff, read [HANDOFF.md](HANDOFF.md).** It links to the design system, animation playbook, and workflow guide in [`docs/`](docs/).

## Stack

- **Astro 5** — static, file-based routing
- **GSAP 3.13 + ScrollTrigger** — all motion
- **Lenis 1.1** — smooth scroll
- **Tailwind v4** via `@tailwindcss/vite`
- **Clash Display + Satoshi** (Fontshare CDN) + **JetBrains Mono** (Fontsource)
- **React islands** — `ContactForm.tsx`, `Navbar.tsx`
- **Vercel** — deployment

## Dev

```bash
npm install
npm run dev      # localhost:4321
npm run build    # static output to dist/
npm run preview  # preview the build
npm run check    # astro type-check
```

## Env

Copy `.env.example` to `.env.local` and fill in your Formspree ID:

```
FORMSPREE_ID=your_form_id_here
```

## Asset migration

Binary assets aren't tracked in this repo. Pull them from `benlaclair/portfolio` (main branch) into `public/`:

```bash
# From the v1 repo
git checkout main
cp -r public/graphics ../Portfoliov2/public/
cp -r public/images   ../Portfoliov2/public/
cp -r public/videos   ../Portfoliov2/public/
cp public/resume.pdf  ../Portfoliov2/public/
```

## Project structure

```
src/
  layouts/    BaseLayout.astro — head, fonts, cursor, Lenis, curtain, observers
  components/ Navbar, Footer, HorizontalWork, Marquee, ProjectCard, ContactForm
  data/       projects, graphicDesign, tools, constants, *CaseStudyData
  pages/
    index.astro            Homepage (loader → hero → tagline → vbreak →
                           horizontal work → marquee → timeline → CTA)
    work/index.astro       All projects grid
    work/[slug].astro      Case study template
    work/graphic-design.astro  86-image gallery + lightbox
    about.astro
    contact.astro
    tools.astro
    api/contact.ts         Formspree proxy
    robots.txt.ts
  styles/global.css        @theme tokens, base, motion utilities
public/                     graphics/, images/, videos/, resume.pdf, favicon
```

## Color tokens (Phase 3)

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#f4efe4` | Page background (warm parchment) |
| `--color-ink` | `#161512` | Primary text |
| `--color-ink-2` | `#2c2a25` | Secondary text |
| `--color-muted` | `#6e6a60` | Tertiary text, labels |
| `--color-line` | `rgba(22, 21, 18, 0.14)` | Borders |
| `--color-dark-bg` | `#0d0c0a` | Dark chapter background |
| `--color-dark-ink` | `#f4efe4` | Text on dark |
| `--color-accent` | `#ff5c1a` | Orange accent (the only "pop" color) |
| `--color-accent-soft` | `rgba(255, 92, 26, 0.14)` | Halos, pulse rings |

Full reference in [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md).

## Phases

- **Phase 1** — Astro/GSAP/Tailwind scaffold (Plus Jakarta Sans, dark default)
- **Phase 2** — Warm parchment editorial system (Inter Tight + Instrument Serif italic), full motion layer
- **Phase 3** — Perplexity comp visual integration (Clash Display + Satoshi, light/dark chapter rhythm, SVG B-mark, word-reveal, live-dot pulse, coordinate readout, `[data-reveal]` cascade, clip-path mobile menu) — **current**

See [HANDOFF.md](HANDOFF.md) for the full state and roadmap.
