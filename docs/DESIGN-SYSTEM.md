# Design system

All tokens live in `src/styles/global.css` inside the `@theme` block (Tailwind v4 syntax). Inline styles across the site reference these via `var(--token-name)`.

If you change a token name, it breaks silently — there's no compile-time check on `var()` references. Prefer changing values, not names.

---

## Color tokens

### Light chapter (default body)

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#f4efe4` | Page background (warm parchment) |
| `--color-bg-alt` | `#ece6d6` | Alternate panels, slightly cooler |
| `--color-bg-2` | `#ece6d6` | Compat alias |
| `--color-panel` | `#fffaf0` | Cards, inset panels |
| `--color-paper` | `#fffaf0` | Compat alias |
| `--color-panel-strong` | `#ffffff` | Highest panel |
| `--color-ink` | `#161512` | Primary text (warm near-black) |
| `--color-ink-2` | `#2c2a25` | Secondary text |
| `--color-muted` | `#6e6a60` | Tertiary text, labels |
| `--color-line` | `rgba(22, 21, 18, 0.14)` | Borders, dividers |
| `--color-line-soft` | `rgba(22, 21, 18, 0.06)` | Whisper-soft dividers |
| `--color-line-strong` | `rgba(22, 21, 18, 0.28)` | Hard rule borders |

### Dark chapter

| Token | Value | Use |
|---|---|---|
| `--color-dark-bg` | `#0d0c0a` | Dark section background |
| `--color-dark-bg-alt` | `#131210` | Alternate dark surface |
| `--color-dark-panel` | `rgba(25, 23, 20, 0.06)` | Subtle dark panel |
| `--color-dark-ink` | `#f4efe4` | Primary text on dark |
| `--color-dark-ink-2` | `#d6d1c4` | Secondary text on dark |
| `--color-dark-muted` | `#898478` | Tertiary text on dark |
| `--color-dark-line` | `rgba(244, 239, 228, 0.14)` | Borders on dark |
| `--color-dark-line-strong` | `rgba(244, 239, 228, 0.32)` | Hard borders on dark |

### Accent

| Token | Value | Use |
|---|---|---|
| `--color-accent` | `#ff5c1a` | The orange. Used everywhere accent meaning matters |
| `--color-accent-hover` | `#ff7232` | Hover state |
| `--color-accent-soft` | `rgba(255, 92, 26, 0.14)` | Soft halos, pulse rings |

### Elevation (shadow tokens)

Card shadow recipes — light / dark / active variants. Consume via `box-shadow: var(--shadow-card)`. Don't hand-roll new stacks; if a card needs a different elevation, add a named token here.

| Token | Use |
|---|---|
| `--shadow-card` | Base card on cream/light canvas. Timeline pin, Tools rows, light Work panels |
| `--shadow-card-active` | Active light card. Deeper drop, no glow |
| `--shadow-card-dark` | Base card on dark room. Inset highlight + downward shadow |
| `--shadow-card-dark-active` | Active dark card. Inset highlight + dark shadow + accent-tinted ambient glow |
| `--shadow-nav-substrate` | Inset bottom-edge for navbar substrate (light mode) |
| `--shadow-nav-substrate-dark` | Same for dark mode |

---

## Typography

Three families, three roles. Drop everything else.

| Family | Weights | Role | Source |
|---|---|---|---|
| **Clash Display** | 500, 600 | Headings, hero, large display, accent words | Fontshare CDN |
| **Satoshi** | 400, 500, 700 | Body text, UI, links | Fontshare CDN |
| **JetBrains Mono** | 400, 500 | Mono labels, eyebrow text, timestamps | `@fontsource/jetbrains-mono` |

### Tokens

```css
--font-display: 'Clash Display', ui-sans-serif, system-ui, sans-serif;
--font-body:    'Satoshi', ui-sans-serif, system-ui, sans-serif;
--font-sans:    'Satoshi', ui-sans-serif, system-ui, sans-serif; /* compat alias */
--font-mono:    'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
```

**Do not use `var(--font-serif)`** — it was dropped with Instrument Serif. If you need a serif feel, use Clash Display 600 with tight letter-spacing.

### Type scale (fluid, in `@theme`)

| Token | Value | Typical use |
|---|---|---|
| `--text-xs` | `0.74rem` | Micro labels |
| `--text-sm` | `0.88rem` | Eyebrow, footnotes |
| `--text-base` | `1rem` | Body |
| `--text-md` | `1.0625rem` | Slightly larger body |
| `--text-lg` | `1.25rem` | Pull quotes |
| `--text-xl` | `1.5rem` | Section subheadings |
| `--text-2xl` | `clamp(1.65rem, 2.4vw, 2.1rem)` | h3 |
| `--text-3xl` | `clamp(2rem, 3vw, 2.85rem)` | h2 |
| `--text-display` | `clamp(2.6rem, 6.5vw, 5.4rem)` | Page hero h1 |
| `--text-hero` | `clamp(3rem, 9vw, 7.5rem)` | Homepage hero only |

In practice, the homepage hero and CTA use bespoke `clamp()` values — they don't pull from the scale because they need to fill the viewport at extreme sizes.

### Utility classes (Phase 7)

Composed recipes for the recurring typography roles. Prefer these over re-typing inline font stacks. Defined as `@utility` in `global.css`.

| Class | Composition |
|---|---|
| `.text-display-xl` | Clash 500 · `clamp(64px, 11vw, 180px)` · 0.92 lh · -0.045em | Page hero h1 |
| `.text-display-lg` | Clash 500 · `clamp(48px, 6.6vw, 100px)` · 0.96 lh · -0.04em |
| `.text-display-md` | Clash 500 · `clamp(36px, 4.4vw, 64px)` · 1.0 lh · -0.03em |
| `.text-display-sm` | Clash 500 · `clamp(24px, 3vw, 40px)` · 1.1 lh · -0.03em |
| `.text-eyebrow` | Mono · 11px · 0.12em tracking · uppercase · `--color-ink-2` |
| `.text-eyebrow-accent` | Same as above, colored `--color-accent` |
| `.text-meta` | Mono · 10px · 0.14em tracking · uppercase · `--color-muted` |
| `.text-body-lg` | 18px · 1.55 lh · `--color-ink-2` |
| `.text-body` | 15px · 1.6 lh · `--color-ink-2` |
| `.text-body-sm` | 14px · 1.6 lh · `--color-ink-2` |

When extending the system: if a typography recipe is used 2+ times, promote it to a utility class. Per-instance overrides (margin, max-width) stay inline.

### Accent words

The **orange accent role** is a `<span class="accent">` with `var(--color-accent)`. No italics, no font swap. Examples:

```html
Designer
<span class="accent">shaping</span> interfaces,
brands &amp; <span class="accent">moving</span>
pictures.
```

Phase 2's `<em>` italic-Instrument-Serif accent is gone. Don't reintroduce it.

---

## Easings

```css
--ease-out:    cubic-bezier(0.16, 1, 0.3, 1);   /* expo-out feel */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);    /* material-style */
```

GSAP code uses string easings (`'expo.out'`, `'power3.out'`) directly. CSS transitions use the tokens above.

---

## Chapter rhythm

The homepage alternates dark and light sections to create chromatic rhythm. Maintain this when adding sections.

| # | Section | Mode | Notes |
|---|---|---|---|
| 1 | Loader | dark | `--color-dark-bg`, SVG B-mark stroke-painted in |
| 2 | Hero | dark + halos | `is-dark has-halos`, orange + cool-blue radials |
| 3 | Tagline | light + warmth | `atmo-warmth-tl` softens the hand-off from dark vbreak |
| 4 | Vbreak | dark | Continuous strip, parallax background |
| 5 | HorizontalWork | light | Editorial focus, panels readable |
| 6 | Marquee | light | Re-typography |
| 7 | Timeline | light | Year numerals in Clash Display |
| 8 | CTA | dark + halos | Closing chromatic anchor |
| 9 | Footer | dark + grain | `atmo-grain-dark` adds film grain to the closing block |

Pattern: **D · D · L · D · L · L · L · D · D**. Hero and CTA/Footer are the two anchors; Vbreak is the mid-page beat between them.

### Painting a section dark

```html
<section class="my-section is-dark has-halos" data-section-mode="dark">
  …
</section>
```

- `is-dark` flips background + text colors via the global rule in `global.css`.
- `has-halos` adds two radial gradient halos (orange top-right, cool-blue bottom-left) via `::before/::after`. Optional — only the hero and CTA use it.
- `data-section-mode="dark"` hooks into the `BaseLayout.astro` ScrollTrigger that flips `body[data-mode]`. This is what swaps the cursor color from ink to dark-ink. **Always pair `is-dark` with this attribute** if the section is full-bleed and the user can pause inside it.

### Atmospheric utilities

Four named, finite utilities for sections that want softness or texture without rolling a per-section snowflake.

| Utility | Slot | Effect |
|---|---|---|
| `atmo-warmth-tl` | `::before` | Soft accent radial anchored top-left (light sections) |
| `atmo-warmth-br` | `::before` | Soft accent radial anchored bottom-right (variation for rhythm) |
| `atmo-grain-light` | `::after` | Subtle paper grain via SVG turbulence, `mix-blend-mode: multiply` |
| `atmo-grain-dark` | `::after` | Subtle film grain via SVG turbulence, `mix-blend-mode: overlay` |

Composition rules:
- Warmth utilities own `::before`; grain utilities own `::after`. You can stack one warmth + one grain on the same section.
- **Do not combine with `has-halos`** — halos already claim both pseudos, so atmo classes will be overwritten or overwrite the halos depending on order.
- Pick at most one variant from each slot. The audit guidance is "not per-section snowflakes" — these are intentional, repeatable choices.

The `.is-dark` rule in `global.css`:

```css
.is-dark {
  background: var(--color-dark-bg);
  color: var(--color-dark-ink);
}
.is-dark a, .is-dark .accent { color: var(--color-accent); }
.is-dark .label, .is-dark .mono, .is-dark .col-label { color: var(--color-dark-muted); }
.is-dark .col-value { color: var(--color-dark-ink-2); }
.is-dark .divider { background: var(--color-dark-line); }
```

If a child element has an explicit `color: var(--color-ink)` inline, the cascade won't reach it — you'll need a per-section override (see the bottom of `index.astro`'s `<style is:global>` for examples).

---

## Layout primitives

### `.wrap` utility

```css
@utility wrap {
  width: 100%;
  max-width: 1440px;
  margin-inline: auto;
  padding-inline: 24px;
}
@media (min-width: 768px) {
  .wrap { padding-inline: 40px; }
}
```

Used inside dark chapter blocks (footer, hero) to constrain content while allowing the section background to bleed full-width.

### Section padding convention

Most homepage sections use `padding: 200px 40px;` (or similar generous vertical) — this gives the pinned sections (HorizontalWork, Timeline) room to breathe and creates a slow editorial pace.

### Mobile breakpoint

`@media (max-width: 900px)` is the universal mobile breakpoint. At this width:
- Multi-column grids collapse to 1 column
- Hero font scales drop
- HorizontalWork falls back to vertical stacking (the pin/scroll is desktop-only)
- Timeline numeral shrinks
- Navbar's right-side cluster (clock) is hidden via `hidden md:flex`

---

## Logo

The SVG B-mark replaces all "Ben." wordmarks. Three variants, each in a specific home:

### Header (44×44, framed, `Navbar.tsx`)

Hollow rounded-square frame, B path filled, accent dot at top-right. Color via `currentColor` so it adapts to light/dark.

```jsx
<svg viewBox="0 0 44 44" width="36" height="36">
  <rect x="3" y="3" width="38" height="38" rx="12" fill="none" stroke="currentColor" strokeWidth="1.4" />
  <path d="M13 31V12h10.2c4 0 6.4 1.9 6.4 5.1 0 1.9-1 3.4-2.8 4.2 2.4.6 3.8 2.3 3.8 4.8 0 3.3-2.6 4.9-7.2 4.9H13Zm5-11.1h4.1c1.5 0 2.4-.7 2.4-1.9s-.9-1.8-2.5-1.8H18v3.7Zm0 7h4.9c1.7 0 2.6-.7 2.6-2s-.9-2-2.7-2H18v4Z" fill="currentColor" />
  <circle cx="32" cy="12" r="3.2" fill="var(--color-accent)" />
</svg>
```

### Footer (96×96, no frame, `Footer.astro`)

Solid B fills with cutouts for the inner shapes. Larger, no rounded frame, paired with "Ben LaClair" wordmark in Clash Display 600.

### Loader (96×96, stroke paths, `index.astro`)

Same B paths, but rendered as **strokes** (not fills) so they can be animated via `stroke-dasharray: 240; stroke-dashoffset: 240 → 0`. The accent circle stays solid throughout.

### Wordmark

"Ben LaClair" in Clash Display 600, `letter-spacing: -0.02em`. Sits to the right of the mark in the header (15px), below the mark in the footer (clamp 32–56px).

---

## When in doubt

- New text? `var(--font-body)` (Satoshi 400). Headings? `var(--font-display)` (Clash Display 500).
- Need a label? `var(--font-mono)` 11px, `letter-spacing: 0.12em`, `text-transform: uppercase`, `color: var(--color-ink-2)`.
- Need an accent word? `<span class="accent">…</span>`. Don't use color directly.
- Want a divider? `<div class="divider"></div>` — picks up `--color-line` light or `--color-dark-line` dark.
- Adding to a dark section? Use `--color-dark-*` tokens explicitly in inline styles, since the `.is-dark` cascade only catches generic `a`, `.accent`, `.label`, `.col-*`, and `.divider`.
