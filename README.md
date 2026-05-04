# benlaclair.com v2

Astro + GSAP + Tailwind v4 rebuild of [benlaclair.com](https://benlaclair.com).

## Stack

- **Astro 5** — static-first, file-based routing
- **GSAP + ScrollTrigger** — all animations
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **Instrument Serif + Geist** — editorial headings, clean UI
- **React islands** — contact form only
- **Vercel** — deployment

## Dev

```bash
npm install
npm run dev      # localhost:4321
npm run build    # static output to dist/
npm run preview  # preview the build
```

## Env

Copy `.env.example` to `.env.local` and fill in your Formspree ID:

```
FORMSPREE_ID=your_form_id_here
```

## Asset migration

The following folders need to be copied from `benlaclair/portfolio` (main branch) into `public/`:

```
public/graphics/       ← 86 graphic design images (webp)
public/images/         ← project cover images + site assets
public/videos/         ← VEO Olympics broadcast spot
public/resume.pdf      ← current resume
```

These are binary assets that can't be pushed via the GitHub API. Use git locally:

```bash
# From the v1 repo
git checkout main
cp -r public/graphics ../Portfoliov2/public/
cp -r public/images ../Portfoliov2/public/
cp -r public/videos ../Portfoliov2/public/
cp public/resume.pdf ../Portfoliov2/public/
```

## Project structure

```
src/
  components/    Navbar, Footer, ProjectCard, ContactForm
  data/          projects, graphicDesign, tools, case study data
  layouts/       BaseLayout.astro
  pages/
    index.astro           Homepage
    work/
      index.astro         All projects grid
      [slug].astro        Case study template
      graphic-design.astro Gallery with lightbox
    about.astro
    contact.astro
    tools.astro
    api/contact.ts        Formspree proxy
    robots.txt.ts
  styles/
    global.css            Tailwind v4 theme tokens
```

## Color tokens

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#F8F8F6` | Page background |
| `--color-surface` | `#FFFFFF` | Cards, panels |
| `--color-ink` | `#0F172A` | Primary text |
| `--color-muted` | `#64748B` | Secondary text |
| `--color-line` | `#E2E8F0` | Borders |
| `--color-pop` | `#2563EB` | Accent / hover |
