# Animation playbook

Every motion on the site, where it lives, and how to extend it without breaking neighbors.

**Reduced-motion is non-negotiable.** Every animation has a corresponding `@media (prefers-reduced-motion: reduce)` fallback or a `reduceMotion.current` JS guard. If you add motion, add the fallback.

---

## The motion lib — `src/lib/motion.ts`

Every consumer imports from one place. `gsap.registerPlugin(ScrollTrigger)` runs here once; a global resize handler refreshes ScrollTrigger here once.

```ts
import { gsap, ScrollTrigger, ease, reduceMotion, revealLines } from '../lib/motion';
```

- **`gsap`, `ScrollTrigger`** — re-exported singletons. Don't import from `gsap` directly anywhere else.
- **`ease`** — typed token map: `ease.out` (`'power3.out'`), `ease.expo` (`'expo.out'`), `ease.expoInOut`, `ease.power2`, `ease.power1InOut`. Don't retype the strings; add a new key here if you need a new easing.
- **`reduceMotion`** — reactive object, *not* a boolean. Read `reduceMotion.current` at the moment of decision (so OS preference toggles are respected mid-session). Subscribe with `reduceMotion.onChange(cb)` if you need to react.
- **`revealLines(selector, opts?)`** — the canonical `.line > span` reveal. Sets `y: '110%'`, tweens to `y: '0%'` over 1.1s with `ease.expo`. Bails under reduced-motion. Used by every page hero with a `.line` reveal.

## What runs where

| File | Motion it owns |
| --- | --- |
| `BaseLayout.astro` | Lenis init, custom cursor, magnetic links, page curtain, `body[data-mode]` ScrollTrigger, `[data-reveal]` IntersectionObserver |
| `index.astro` | Loader → hero intro timeline, hero word-reveal, hero scrub-out, vbreak parallax, tagline word-scrub, timeline pin, CTA line-reveal |
| `HorizontalWork.astro` | Pinned horizontal scroll, shrink-on-focus + Y-drift on whole `.hwork-panel-inner` cards, `is-active` shadow upgrade, side-rail, clip-path entrance, inner-image parallax, body-mode flip when middle (dark) card is active |
| `Marquee.astro` | Looping ticker, hover-slow |
| `Footer.astro` | Mark scale-in entrance |
| `Navbar.astro` | Mobile menu link stagger (on open), scroll-substrate fade-in past hero |
| `ProjectCard.astro` | Inner-image parallax scrub only (reveals migrated to `[data-reveal]`) |
| `work/[slug].astro` | Hero entrance timeline + cover clip-path entrance (row reveals migrated to `[data-reveal]`) |
| `about.astro` | h1 line-reveal via `revealLines()`, stat number tickup (exp-row reveals migrated to `[data-reveal]`) |
| `contact.astro`, `tools.astro`, `work/index.astro`, `work/graphic-design.astro` | h1 line-reveal via `revealLines()` |

---

## Globals (live in `BaseLayout.astro`)

### Lenis smooth scroll

```js
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
window.__lenis = lenis;
```

- Duration 1.4 = premium pacing. Bump to 1.6 for a more luxurious feel; drop to 1.0 for snappier scrolling. Don't go below 0.8 — ScrollTrigger pin transitions get jittery.
- Disabled when `prefers-reduced-motion: reduce`.
- Exposed on `window.__lenis` for debugging in the browser console.

### Custom cursor

`#cursor-dot` (10×10 solid) + `#cursor-ring` (44×44, 12% opacity, lerps behind dot). Both use `position: fixed; pointer-events: none;`.

Hover behavior:
- On `<a>`, `<button>`, `[role="button"]`: ring scales to **2.2**, dot to **0.35**.
- On `[data-cursor]` elements: ring scales to **3.2** (the "feature" hover — used on email link, project links, etc.).
- Touch and `prefers-reduced-motion` hide the cursor entirely.

Cursor color follows `body[data-mode]`:
```css
body[data-mode="dark"] .cursor-dot,
body[data-mode="dark"] .cursor-ring {
  background: var(--color-dark-ink);
}
```

### Magnetic links

Any element with `data-magnetic="0.4"` translates toward the pointer with the given strength. Used on the wordmark, nav links, hero CTA buttons. Snaps back via `elastic.out(1, 0.4)` on mouseleave.

### Page transition curtain

A full-screen `.page-curtain` div sits at the top with `transform: translateY(-100%)`. On any internal-link click, GSAP slides it back in (`yPercent: 0`) and triggers `window.location.href` after `0.7s`. On page load, it slides out (`yPercent: -100`).

Don't add SPA routing — Astro is multi-page and the curtain is the seam. If you ever introduce View Transitions, the curtain will become redundant.

### `body[data-mode]` tracking

```js
const darkSections = document.querySelectorAll('[data-section-mode="dark"]');
darkSections.forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top 60px',
    end: 'bottom 60px',
    onEnter:     () => { document.body.dataset.mode = 'dark'; },
    onLeave:     () => { document.body.dataset.mode = 'light'; },
    onEnterBack: () => { document.body.dataset.mode = 'dark'; },
    onLeaveBack: () => { document.body.dataset.mode = 'light'; },
  });
});
```

Used to flip cursor color (and could be extended to flip nav text color, theme-color meta, etc.). Any new dark section needs `data-section-mode="dark"` for this to fire.

### `[data-reveal]` IntersectionObserver

This is the workhorse. Any element with `data-reveal` will fade up when it enters the viewport, with a sibling-index stagger (cap 280ms) so groups feel orchestrated without per-element ScrollTrigger plumbing.

```js
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const sib = Array.from(e.target.parentElement?.children ?? []).indexOf(e.target);
    e.target.style.transitionDelay = `${Math.min(sib * 60, 280)}ms`;
    e.target.classList.add('is-revealed');
    io.unobserve(e.target);
  });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
```

CSS:
```css
[data-reveal] { opacity: 0; transform: translateY(18px); transition: opacity 0.8s var(--ease-out), transform 0.8s var(--ease-out); }
[data-reveal].is-revealed { opacity: 1; transform: none; }
```

Apply liberally — it costs ~zero. Stagger comes from sibling index, so to control sequence, just order the elements in the DOM.

---

## Loader → hero intro (the most important timeline)

Lives in `src/pages/index.astro`. This is the only cross-section orchestration.

```js
intro
  // 1. Counter 000 → 100
  .to(pct, { v: 100, duration: 1.4, ease: 'power1.inOut',
    onUpdate: () => { /* writes #loader-pct */ } }, 0)
  // 2. Bar fill 0% → 100%
  .to('#loader-bar-fill', { width: '100%', duration: 1.4, ease: 'power1.inOut' }, 0)
  // 3. SVG B-mark stroke paint-in (3 paths, staggered)
  .to('.loader-path', { strokeDashoffset: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out' }, 0)
  // 4. Loader curtain wipe up
  .to('#loader', { yPercent: -100, duration: 1.0, ease: 'expo.inOut' }, '+=0.6')
  .set('#loader', { display: 'none' })
  // 5. Nav fades in
  .to('#site-nav', { opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.5')
  // 6. Hero eyebrow fades in
  .to('#hero-eyebrow', { opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4')
  // 7. Hero word-reveal — wraps each word in <span class="word"><span>word</span></span>,
  //    then GSAP yPercent 115 → 0, stagger 0.04
  .add(() => { /* word-wrap + tween */ }, '-=0.3')
  // 8. Hero footer info grid fades in
  .to('#hero-foot', { opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.6');
```

Total runtime ~3 seconds. Reduced-motion path skips everything and shows the hero instantly.

**If you change the loader**, keep the contract: counter, bar, mark, exit wipe, then the post-loader chain must still hand off `#site-nav`, `#hero-eyebrow`, `#hero-foot`, and the hero word-reveal — those four are the entrance choreography that makes the homepage feel composed.

---

## Section-level motion

### Hero scrub-out (`index.astro`)

As the hero leaves the viewport, the title shrinks and dims:

```js
gsap.to('#hero-title', {
  scale: 0.96, yPercent: -8, opacity: 0.4,
  ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'bottom bottom', end: 'bottom 30%', scrub: true },
});
```

Subtle but important — gives the page a sense of depth as you leave the hero.

### Vbreak parallax (`index.astro`)

The dark strip's background translates `yPercent: -14 → 14` as the section passes through the viewport, creating a parallax inset.

### Tagline word-scrub (`index.astro`)

JS wraps each word in `<span class="tag-word">`, then GSAP tweens opacity `0.18 → 1` with `scrub: 0.6` tied to the section. Reading the line literally fills it in.

**Note**: this used to be `.word`, renamed to `.tag-word` in Phase 3 to avoid colliding with the new `.word > span` hero word-reveal container. If you ever see "tagline isn't fading in" — check for the rename.

### HorizontalWork (`HorizontalWork.astro`)

The pinned horizontal scroll has four interlocking pieces:

1. **Pin + horizontal translate**: `gsap.to(track, { x: -distance, scrollTrigger: { pin: true, scrub: 0.6, end: '+=' + distance } })`. ScrollTrigger holds the section while the user scrolls and translates the inner track horizontally.

2. **Shrink-on-focus** (the Phase 2 → 3 highlight): in the same tween's `onUpdate`, each panel's visual is scaled based on its distance from the active center.
   ```js
   const dist = Math.abs(progress - i);
   const scale = Math.max(0.72, 1 - dist * 0.28);
   const yPercent = -dist * 14;
   gsap.set(vis, { scale, yPercent });
   ```
   Active panel sits at scale 1; neighbors recede toward 0.72 with a slight upward lift.

3. **Active-panel detection**: a per-panel ScrollTrigger toggles the side-rail tick, runs the title's line-reveal, and adds `.in` to the visual (which triggers the clip-path entrance).

4. **Inner image parallax**: each panel's image translates `yPercent: -8 → 8` over its slice of horizontal scroll.

Mobile fallback: pin is disabled, panels stack vertically, simple stagger reveal.

### Timeline pin (`index.astro`)

Five timeline entries (`tlData`). ScrollTrigger pins `#timeline-pin` for `280vh` of scroll, and `onUpdate` calculates which entry is active based on progress. Switching entries triggers GSAP fades on the year, text, and tag.

### CTA line-reveal (`index.astro`)

`<span class="line"><span>...</span></span>` wrappers, GSAP `y: '110%' → '0%'`. Standard line-reveal pattern — used here because it's a 2-line headline that benefits from per-line entrance.

### Footer mark entrance (`Footer.astro`)

`.footer-mark` scales from 0.96 + y: 60 + opacity: 0 to identity, on `top 92%` scroll-into-view. Subtle but signals "you've reached the bottom."

---

## Reveal patterns — when to use which

| Pattern | Class / attr | When |
| --- | --- | --- |
| **Word-reveal** | `<span class="word"><span>w</span></span>` + GSAP yPercent 115→0 | Hero only. Loader-chained. Don't use elsewhere. |
| **Line-reveal** | `<span class="line"><span>...</span></span>` + GSAP y 110%→0 | Multi-line headlines (CTA, contact, work hero, about hero). Per-line stagger. |
| **`[data-reveal]` cascade** | `data-reveal` attribute | Anything else: meta, body copy, info grid cells, footer columns. Free, automatic stagger. Default choice. |
| **Section ScrollTrigger** | Custom `gsap.to(...)` with `scrollTrigger` | When you need scrub, pin, or a precise per-element timeline. Use sparingly. |

---

## Adding new motion — checklist

Before you add:
- [ ] Could `[data-reveal]` do this? If yes, use it.
- [ ] Will it work with `prefers-reduced-motion: reduce`? Add the guard or static fallback.
- [ ] If on a dark section: does the cursor color flip work? (Section needs `data-section-mode="dark"`.)
- [ ] Are the easings consistent with the rest of the site? Use `expo.out`, `power3.out`, or `--ease-out`.
- [ ] Is there a mobile fallback if it's pin- or scroll-based? Pinned scrolls should disable below 900px.

After you add:
- [ ] Test the loader-to-hero intro chain still feels composed (your new motion shouldn't compete with it).
- [ ] Refresh ScrollTrigger after layout-affecting JS: `ScrollTrigger.refresh()` (already wired on resize).
- [ ] Check Vercel preview on a real phone — desktop emulation lies about pin/scroll smoothness.

---

## Debugging tips

- **ScrollTrigger markers**: pass `markers: true` into a `scrollTrigger` config to see the start/end lines. Strip before merging.
- **GSAP timeline.timeScale(0.3)**: slow a timeline down 3.3× while debugging by setting `gsap.globalTimeline.timeScale(0.3)` in the console.
- **Lenis pause**: `window.__lenis.stop()` in console to disable smooth scroll temporarily.
- **`document.body.dataset.mode`**: read in console to confirm dark/light section detection is firing.
- **Loader stuck**: usually means a `gsap.to` target selector returned 0 elements. Check the loader timeline's `defaults` — it'll fail silently otherwise.

---

## Easings used on this site

| Where | Easing |
| --- | --- |
| Loader counter, bar | `power1.inOut` |
| Loader B-mark stroke paint | `power3.out` |
| Loader exit wipe, hero word-reveal | `expo.out` / `expo.inOut` |
| Page curtain | `expo.inOut` |
| Cursor dot follow | `power3.out` (duration 0.12) |
| Cursor scale on hover | `power2.out` (in), `elastic.out(1, 0.45)` (release) |
| Magnetic links snap-back | `elastic.out(1, 0.4)` |
| ScrollTrigger scrubs | `'none'` (linear, scrub does the curving) |
| Section reveals | `expo.out` or `power3.out` |
| `[data-reveal]` CSS transitions | `var(--ease-out)` (cubic-bezier(0.16, 1, 0.3, 1)) |

If you're unsure which to use: **`expo.out` for entrances, `elastic.out` for snap-backs, `none` for scrubs, `power3.out` for general-purpose UI**. That covers 95% of cases.
