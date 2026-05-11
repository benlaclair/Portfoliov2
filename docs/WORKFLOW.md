# Workflow

How to develop, deploy, and avoid blowing things up.

---

## Local dev

```bash
npm install
npm run dev          # http://localhost:4321 — HMR, fast refresh
npm run build        # static output to dist/
npm run preview      # serve the production build locally
npm run check        # astro type-check (TypeScript + .astro)
```

Vercel adapter is set in `astro.config.mjs`. Local `npm run build` produces a `.vercel/` directory in addition to `dist/` — that's normal.

### Env vars

`.env.example` lists everything required:

```text
FORMSPREE_ID=your_form_id_here
```

Copy to `.env.local` for local dev. Vercel has it set as a project-level env var; don't commit `.env.local`.

The contact form route (`src/pages/api/contact.ts`) is the only consumer.

---

## Branches

| Branch | Purpose |
| --- | --- |
| `main` | The only branch. All work happens here. Push triggers a Vercel deploy to <https://portfoliov2-jet-six.vercel.app>. |

For experimental work, branch off `main` locally if you want to compare a state before pushing. Don't push exploratory branches to origin — keep the remote tidy.

---

## Commit style

Conventional-commit-ish prefixes:

| Prefix | When |
| --- | --- |
| `feat:` | New feature or section |
| `feat(scope):` | Scoped feature (`feat(deploy):`, `feat(pages):`) |
| `fix:` | Bug fix |
| `refactor:` | Non-behavioral cleanup |
| `redesign:` | Visual overhaul (Phase 2 used this) |
| `chore:` | Tooling, deps, configs |
| `docs:` | Docs only |

Body: bullets describing **why**, not the diff. Example:

```text
feat: Phase 3 — Perplexity comp visual integration

- Design tokens: Clash Display + Satoshi replace Inter Tight + Instrument Serif…
- SVG B-mark: replaces all italic "Ben." wordmarks…
- …
```

See `git log --oneline main` for shipped examples.

---

## Pushing

```bash
git push origin main
```

Vercel sees the push and rebuilds. Watch the deploy in the Vercel dashboard. **Never force-push to `main`.** If you mess up a commit, fix forward — make a new commit that corrects it.

---

## Deploy

Vercel is wired to the repo. Push to `main` → deploy to <https://portfoliov2-jet-six.vercel.app>. (This is a separate Vercel project from the v1 site at benlaclair.com — anything done here does not touch the live portfolio.)

Build takes ~30–60 seconds. Watch in the Vercel dashboard or wait until the URL serves the new content.

If a deploy fails, check the Vercel build logs in the dashboard. The most common failures:

| Symptom | Likely cause |
| --- | --- |
| `ETARGET / no matching version` | A dep version in `package.json` doesn't exist on npm. Check `@astrojs/react` is `^3.6.0`, not `^4.x`. |
| `Cannot find module 'lenis'` | Lenis missing from `package.json`. It's needed even though it's used dynamically. |
| Font not loading | Fontshare CDN blocked or `display=swap` typo. Check the `<link>` in `BaseLayout.astro`. |
| Hero blank, no fade-in | Loader timeline broke — check console for failed selector. |

---

## Common tasks

### Add a new project

1. Append to `src/data/projects.ts`. Required fields: `slug`, `title`, `shortTitle`, `category`, `year`, `description`, `role`, `tools[]`, `coverColor`, `overview`. Optional: `coverImage`, `videoUrl`, `client`, `problem`.
2. Drop the cover into `public/images/`.
3. If it has detailed sections, create `src/data/caseStudies/<slug>.ts` modeled on `vlier.ts` / `portfolio.ts`. Section types are defined in `caseStudies/types.ts` (discriminated union by `kind`).
4. Register the case study in `src/data/caseStudies/index.ts`. The `[slug].astro` template reads the registry — no per-slug branches needed.
5. The homepage's `HorizontalWork.astro` (now rendering vertical sticky-pin cards) shows `PROJECTS.slice(0, 3)` — if your new project should be featured, reorder the array.

### Add a homepage section

1. Pick light or dark per the chapter rhythm in [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md). Don't break **D · D · L · D · L · L · D · D**.
2. Insert markup between existing sections in `src/pages/index.astro`.
3. If dark: add `class="is-dark has-halos"` (halos are optional, anchor-only) and `data-section-mode="dark"`.
4. Use `[data-reveal]` on subsidiary elements rather than writing custom GSAP.
5. Add a `@media (max-width: 900px)` block — collapse grids, drop heavy effects.

### Add a new page

1. Create `src/pages/<page>.astro`.
2. Wrap in `<BaseLayout title="..." description="...">`.
3. Use the same eyebrow/h1/body pattern as `about.astro` or `tools.astro`.
4. Add a Navbar link in `src/components/Navbar.tsx` `navLinks` array.
5. The page automatically gets cursor, Lenis, curtain, and `[data-reveal]` for free.

### Tweak a design token

Edit `src/styles/global.css` `@theme` block. Don't rename tokens — inline `var()` references won't catch the rename. If you need a new token, add it; don't repurpose an existing one.

### Update copy on the homepage

Edit `src/pages/index.astro` directly. The hero phrase (Phase 8), tagline, vbreak quote, timeline entries (`tlData` array in the script), and CTA copy are all there. The hero CTA label + destination is in the `<a class="hero-cta" href="…">` markup near the top.

### Update the loader

Loader markup, CSS, and timeline are all in `src/pages/index.astro`. The contract: counter must reach 100, bar must fill, B-mark must paint, then exit-wipe and hand off to nav, phrase word-reveal, dwell, then phrase exit + gallery fade-in + CTA fade-in. Don't touch the order of the post-loader chain.

### Test reduced-motion

DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`. Hard-refresh.

Verify:
- Loader doesn't appear (or appears for one frame and exits)
- Hero is visible immediately
- Cursor is hidden
- `[data-reveal]` elements are visible without transition
- Tagline word-scrub is fully visible
- Lenis is off (scroll uses native browser smoothness, not our 1.4s easing)

### Run a Lighthouse audit

```bash
npm run build && npm run preview
# Open http://localhost:4321 in Chrome
# DevTools → Lighthouse → Mobile, Performance + Accessibility + Best Practices + SEO
```

Targets: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 100. The Fontshare CDN swap (Phase 3) may have slightly hurt LCP; if it dropped below 90, consider self-hosting Clash + Satoshi.

### Verify a specific animation

Use `gsap.globalTimeline.timeScale(0.3)` in the console to slow everything down 3.3×. Useful for verifying the loader-to-hero chain or the VerticalWork card scale-into-focus animation.

---

## Don't

- **Don't force-push to `main`**, ever. Fix forward with a new commit instead.
- **Don't re-introduce Instrument Serif italic accents.** Phase 3 explicitly dropped that role; use `<span class="accent">` instead.
- **Don't add new globals to `BaseLayout.astro`** unless they apply site-wide. Section-local motion belongs in the section's `<script>` block.
- **Don't rename CSS custom properties** without grep-replacing every inline `var()` reference across the whole `src/`.
- **Don't `git rebase -i` or `git add -i`** in the Claude Code shell — interactive flags don't work.
- **Don't `--no-verify` or `--no-gpg-sign`** without explicit instruction. If a hook fails, fix the root cause.

