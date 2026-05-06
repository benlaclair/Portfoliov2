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

```
FORMSPREE_ID=your_form_id_here
```

Copy to `.env.local` for local dev. Vercel has it set as a project-level env var; don't commit `.env.local`.

The contact form route (`src/pages/api/contact.ts`) is the only consumer.

---

## Branches

| Branch | Purpose |
|---|---|
| `main` | Production. Auto-deploys to Vercel. Direct pushes go live. |
| `claude/astro-gsap-portfolio-rebuild-3Jeel` | Active dev. Tracked by PR #1. Vercel posts a preview URL on each push. |
| `prototype/experimental-portfolio-rebuild` | **Frozen reference.** The Perplexity-generated comp Phase 3's tokens were lifted from. Do not merge. Cherry-pick details if needed. |

### Why one long-running PR?

Phases 1–3 all live on PR #1. This is fine for a one-developer portfolio, but it means the PR diff is enormous. **Once Phase 3 is verified live, squash-merge PR #1 to main and start Phase 4 as a fresh PR off main.**

---

## Commit style

Conventional-commit-ish prefixes:

| Prefix | When |
|---|---|
| `feat:` | New feature or section |
| `feat(scope):` | Scoped feature (`feat(deploy):`, `feat(pages):`) |
| `fix:` | Bug fix |
| `refactor:` | Non-behavioral cleanup |
| `redesign:` | Visual overhaul (Phase 2 used this) |
| `chore:` | Tooling, deps, configs |
| `docs:` | Docs only |

Body: bullets describing **why**, not the diff. Example:

```
feat: Phase 3 — Perplexity comp visual integration

- Design tokens: Clash Display + Satoshi replace Inter Tight + Instrument Serif…
- SVG B-mark: replaces all italic "Ben." wordmarks…
- …
```

See `git log --oneline main` for shipped examples.

---

## Pushing & PRs

```bash
git push -u origin claude/astro-gsap-portfolio-rebuild-3Jeel
```

If a force-push is needed (rebase, etc.), use `--force-with-lease`, never plain `--force` to a branch others might be working on. **Never force-push to `main`.**

PRs are managed via the GitHub MCP tools (or the GitHub web UI). When opening a fresh phase PR:

1. Branch off latest `main`.
2. Push first commit.
3. Open as **draft** — Vercel will post a preview URL automatically.
4. Mark ready for review when CI passes and the preview looks right.

---

## Deploy

Vercel is wired to the repo. Two deploy triggers:

- **Push to `main`** → production deploy at `benlaclair.com`.
- **Push to any other branch with an open PR** → preview deploy at `<branch>-benlaclairs-projects.vercel.app`.

The Vercel bot comments on the PR with the preview URL on each push. Wait for the build status to flip from "Building" to "Ready" (~30–60 seconds for this site) before testing.

If a deploy fails, check the Vercel build logs (link in the PR comment). The most common failures:

| Symptom | Likely cause |
|---|---|
| `ETARGET / no matching version` | A dep version in `package.json` doesn't exist on npm. Check `@astrojs/react` is `^3.6.0`, not `^4.x`. |
| `Cannot find module 'lenis'` | Lenis missing from `package.json`. It's needed even though it's used dynamically. |
| Font not loading | Fontshare CDN blocked or `display=swap` typo. Check the `<link>` in `BaseLayout.astro`. |
| Hero blank, no fade-in | Loader timeline broke — check console for failed selector. |

---

## Common tasks

### Add a new project

1. Append to `src/data/projects.ts`. Required fields: `slug`, `title`, `shortTitle`, `category`, `year`, `description`, `role`, `tools[]`, `coverColor`, `overview`. Optional: `coverImage`, `videoUrl`, `client`, `problem`.
2. Drop the cover into `public/images/`.
3. If it has detailed sections (decisions, process, outcomes), create `src/data/<slug>CaseStudyData.ts` and import it in `work/[slug].astro` using the existing pattern:
   ```ts
   } else if (project.slug === '<new>') {
     const d = await import('../../data/<new>CaseStudyData');
     stats = d.<new>Stats;
     decisions = d.<new>Decisions;
     outcomes = d.<new>Outcomes;
   }
   ```
4. The homepage's `HorizontalWork.astro` shows `PROJECTS.slice(0, 3)` — if your new project should be featured, reorder the array.

### Add a homepage section

1. Pick light or dark per the chapter rhythm in [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md). Don't break **D · D · L · D · L · L · L · D · D**.
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

Edit `src/pages/index.astro` directly. The hero title, tagline, vbreak quote, timeline entries (`tlData` array in the script), and CTA copy are all there.

### Update the loader

Loader markup, CSS, and timeline are all in `src/pages/index.astro`. The contract: counter must reach 100, bar must fill, B-mark must paint, then exit-wipe and hand off to nav/eyebrow/word-reveal/foot. Don't touch the order of the post-loader chain.

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

Use `gsap.globalTimeline.timeScale(0.3)` in the console to slow everything down 3.3×. Useful for verifying the loader-to-hero chain or the HorizontalWork shrink-on-focus.

---

## Don't

- **Don't push to `main` directly** unless it's a hotfix. Use the PR flow.
- **Don't force-push to `main`**, ever.
- **Don't re-introduce Instrument Serif italic accents.** Phase 3 explicitly dropped that role; use `<span class="accent">` instead.
- **Don't add new globals to `BaseLayout.astro`** unless they apply site-wide. Section-local motion belongs in the section's `<script>` block.
- **Don't rename CSS custom properties** without grep-replacing every inline `var()` reference across the whole `src/`.
- **Don't `git rebase -i` or `git add -i`** in the Claude Code shell — interactive flags don't work.
- **Don't `--no-verify` or `--no-gpg-sign`** without explicit instruction. If a hook fails, fix the root cause.
- **Don't delete `MarqueeBanner.astro` without grep-checking** that it's truly unimported. (Phase 3 replaced its homepage usage with `Marquee.astro`, but I haven't verified no other page references it.)

---

## Repo state at handoff

- `main` — last commit `d2f899c` ("refactor: remove hero mountain, apply shrink-on-focus to project panels in horizontal scroll"). This is Phase 2 + the mountain-removal cleanup.
- `claude/astro-gsap-portfolio-rebuild-3Jeel` — last commit `d1f1e4e` ("feat: Phase 3 — Perplexity comp visual integration"). This is what you'd merge to ship Phase 3.
- PR #1 — open, draft, base `main`, head `claude/astro-gsap-portfolio-rebuild-3Jeel`. Vercel preview live.

Once you're satisfied with the preview, squash-merge PR #1 to `main` to ship Phase 3 to production.
