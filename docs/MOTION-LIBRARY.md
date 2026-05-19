# Motion Library — GSAP Recipe Reference

Copy-paste patterns for building new animations. Organized by what you're trying to do, not by API method.

For what's already live and where it lives → see [ANIMATIONS.md](ANIMATIONS.md).
For color/type tokens used in these patterns → see [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md).

---

## Import every time

```ts
import { gsap, ScrollTrigger, ease, reduceMotion, revealLines } from '../lib/motion';
import { scramble } from '../lib/scramble'; // text only
```

**`ease` token map**

| Token | String | Character |
|---|---|---|
| `ease.out` | `power3.out` | Smooth brake |
| `ease.expo` | `expo.out` | Fast in, long tail |
| `ease.expoInOut` | `expo.inOut` | Smooth both ends |
| `ease.power2` | `power2.out` | Moderate decel |
| `ease.power1InOut` | `power1.inOut` | Even in/out |
| — | `elastic.out(1, 0.4)` | Spring snap-back |
| — | `back.out(1.7)` | Slight overshoot |
| — | `none` | Scrubs, progress bars |

**Always guard with reduced-motion:**
```ts
if (!reduceMotion.current) { /* animate */ }
```

---

## Status key

| | |
|---|---|
| ✅ | Live in the site |
| 🟢 | Ready — no new deps |
| 🟡 | Needs one utility or CSS setup |
| 🔴 | Requires GSAP Club plugin (not in stack) |

---

## 1 — Text reveals

### Line wipe ✅ `revealLines()`
The default for multi-line display headlines. Parent must be `overflow: hidden`.

```ts
// HTML: <div class="line"><span>Headline text</span></div>
revealLines('.headline', { delay: 0.2, stagger: 0.08, duration: 1.1 });
```

### Word mask reveal ✅
Each word clips upward out of an `overflow:hidden` container. Live on process title and CTA.

```html
<span class="word"><span>Fewer</span></span>
<span class="word"><span>surprises.</span></span>
```
```ts
gsap.set('.word > span', { y: '110%' });
gsap.to('.word > span', {
  y: '0%', duration: 0.7, stagger: 0.1, ease: ease.expo,
  scrollTrigger: { trigger: '.headline', start: 'top 85%', once: true },
});
```

### Character scramble ✅ `scramble()`
Live in `ScrollStage`. Fires on scroll, not on load.

```ts
const handle = scramble(el, 'Target text', {
  charStagger: 30,      // ms between chars starting
  charDuration: 600,    // ms each char scrambles before settling
  tickInterval: 30,     // ms between glyph swaps
  glyphs: '!<>-_\\/[]{}—=+*^?#',
  onComplete: () => {},
});
handle.cancel(); // snap to final text immediately
```

### Character-by-character stagger 🟢
No plugin needed — manually split and stagger.

```ts
const chars = Array.from('Portfolio').map(c => {
  const s = document.createElement('span');
  s.style.display = 'inline-block';
  s.textContent = c;
  return s;
});
el.replaceChildren(...chars);
gsap.from(chars, { opacity: 0, y: 20, stagger: 0.04, duration: 0.4, ease: 'back.out(2)' });
```

### Word-scrub (opacity tied to scroll) 🟢
Was the tagline pattern before Phase 9. Each word fades in as you read through it.

```ts
// Each word is a <span class="tag-word">
gsap.to('.tag-word', {
  opacity: 1,
  stagger: { each: 0.04 },
  ease: 'none',
  scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 30%', scrub: 0.6 },
});
```

### Typewriter 🟢

```ts
const text = 'building cool stuff';
let i = 0;
const iv = setInterval(() => {
  el.textContent += text[i++];
  if (i >= text.length) clearInterval(iv);
}, 70);
```

### Infinite marquee 🟢
CSS-only approach — no GSAP needed unless you want pause-on-hover.

```css
@keyframes marquee { to { transform: translateX(-50%); } }
.track { display: inline-block; animation: marquee 10s linear infinite; }
```
```ts
// GSAP version (pauseable):
gsap.to('.track', { xPercent: -50, duration: 12, ease: 'none', repeat: -1 });
```

### SplitText (char/word/line auto-split) 🔴
> Club plugin. Use the manual approaches above.

---

## 2 — Scroll-driven

### `[data-reveal]` — free stagger ✅
The default for anything that isn't a display headline. Already wired globally in `BaseLayout.astro`.

```html
<p data-reveal>This fades up automatically.</p>
```
DOM order controls stagger — no JS needed. See `ANIMATIONS.md` for the full impl.

### Clip-path wipe reveal 🟢
Wipes content into view from the bottom edge.

```ts
gsap.fromTo('#el', { clipPath: 'inset(100% 0 0 0)' }, {
  clipPath: 'inset(0% 0 0 0)',
  duration: 0.9, ease: 'power3.out',
  scrollTrigger: { trigger: '#el', start: 'top 80%' },
});
```

### Parallax (background layer) ✅
Live on `.vbreak`.

```ts
gsap.fromTo('#bg', { yPercent: -14 }, {
  yPercent: 14, ease: 'none',
  scrollTrigger: { trigger: '.section', start: 'top bottom', end: 'bottom top', scrub: true },
});
```
Adjust `yPercent` range for more/less depth. `scrub: true` = 1:1, `scrub: 1` adds 1s smoothing lag.

### Pinned section ✅
Live on `#timeline-stage`. Basic recipe:

```ts
ScrollTrigger.create({
  trigger: '#stage',
  start: 'top top',
  end: '+=300%',
  pin: true,
  scrub: 1,
});
```
> Disable on mobile: `if (!window.matchMedia('(max-width: 900px)').matches) { ... }`

### Pinned + scrubbed timeline 🟢
Choreograph multiple animations inside a pinned container, all driven by the same scroll progress.

```ts
const tl = gsap.timeline({
  scrollTrigger: { trigger: '#stage', start: 'top top', end: '+=400%', pin: true, scrub: 1 },
});
tl.to('#layer-a', { opacity: 0, y: -40, duration: 1 })
  .to('#layer-b', { opacity: 1, duration: 0.8 }, '-=0.4')
  .to('#layer-c', { scale: 1.2, duration: 1 }, '<');
```

### Horizontal scroll rail 🟢
Vertical scroll drives horizontal movement. Used in `HorizontalWork` in a variant.

```ts
const panels = gsap.utils.toArray<HTMLElement>('.panel');
gsap.to(panels, {
  xPercent: -100 * (panels.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '.rail',
    pin: true,
    scrub: 1,
    snap: 1 / (panels.length - 1),
    end: () => '+=' + (document.querySelector('.rail') as HTMLElement).offsetWidth,
  },
});
```

### Horizontal + zoom-out combo 🟢
As each panel comes into view, it scales up from a slightly shrunken state.

```ts
const panels = gsap.utils.toArray<HTMLElement>('.panel');
gsap.set(panels, { scale: 0.88 });
const tl = gsap.timeline({
  scrollTrigger: { trigger: '.rail', pin: true, scrub: 1, end: '+=400%' },
});
tl.to('.track', { x: -(panels.length - 1) * panelWidth, ease: 'none' });
panels.forEach((p, i) => {
  tl.to(p, { scale: 1, duration: 0.3, ease: 'power2.out' }, i * (1 / panels.length));
});
```

### Velocity-based skew 🟢
Elements tilt in proportion to scroll speed then spring back.

```ts
ScrollTrigger.create({
  trigger: '.section',
  start: 'top bottom', end: 'bottom top',
  onUpdate: self => {
    const skew = Math.min(Math.max(self.getVelocity() / 2200, -1), 1) * 10;
    gsap.to('.target', { skewY: skew, duration: 0.16, overwrite: true });
  },
  onLeave:     () => gsap.to('.target', { skewY: 0, duration: 0.45 }),
  onLeaveBack: () => gsap.to('.target', { skewY: 0, duration: 0.45 }),
});
```

### Scroll-snap story beats 🟢
Locks scroll progress to labeled moments so a pinned narrative feels intentional.

```ts
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.story', start: 'top top', end: '+=400%',
    pin: true, scrub: 1,
    snap: { snapTo: [0, 0.25, 0.5, 0.75, 1], duration: 0.4, ease: ease.expo },
  },
});
tl.addLabel('beat1', 0.25)
  .addLabel('beat2', 0.5)
  .addLabel('beat3', 0.75);
```

### Faux video scrub 🟢
Scroll progress controls video `currentTime`, or a CSS-var-driven visual fake.

```ts
// Real video:
ScrollTrigger.create({
  trigger: '.video-scene', start: 'top top', end: '+=300%',
  pin: true, scrub: true,
  onUpdate: self => { video.currentTime = self.progress * video.duration; },
});

// CSS-var fake (no video file needed):
ScrollTrigger.create({
  trigger: '.scene', start: 'top top', end: '+=300%',
  pin: true, scrub: true,
  onUpdate: self => {
    el.style.setProperty('--progress', (self.progress * 100).toString());
  },
});
```

---

## 3 — Interactive & cursor

### Custom cursor follower 🟢
`quickTo` is the right API — creates a reusable function that doesn't re-parse on every mousemove.

```ts
const dot  = document.getElementById('cursor-dot')!;
const ring = document.getElementById('cursor-ring')!;
const setDX = gsap.quickTo(dot,  'x', { duration: 0.2, ease: 'power3.out' });
const setDY = gsap.quickTo(dot,  'y', { duration: 0.2, ease: 'power3.out' });
const setRX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' });
const setRY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' });
document.addEventListener('mousemove', e => {
  setDX(e.clientX); setDY(e.clientY);
  setRX(e.clientX); setRY(e.clientY);
});
```
> The full cursor (dot + ring + hover scale variants) is already in `BaseLayout.astro`.

### Magnetic button ✅ (`data-magnetic`)
Already wired globally — add `data-magnetic="0.4"` to any element.
To build a custom strength:

```ts
stage.addEventListener('mousemove', e => {
  const r = btn.getBoundingClientRect();
  const x = (e.clientX - r.left - r.width  / 2) * 0.35;
  const y = (e.clientY - r.top  - r.height / 2) * 0.35;
  gsap.to(btn, { x, y, duration: 0.3, ease: 'power3.out' });
});
stage.addEventListener('mouseleave', () => {
  gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
});
```

### 3D tilt card 🟢
Requires `perspective` on the parent container.

```html
<div style="perspective: 600px;">
  <div id="card">...</div>
</div>
```
```ts
stage.addEventListener('mousemove', e => {
  const r = stage.getBoundingClientRect();
  const rx = ((e.clientY - r.top)  / r.height - 0.5) * -20;
  const ry = ((e.clientX - r.left) / r.width  - 0.5) *  20;
  gsap.to('#card', { rotateX: rx, rotateY: ry, duration: 0.15 });
});
stage.addEventListener('mouseleave', () => {
  gsap.to('#card', { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
});
```

### Hover image reveal 🟢
Hovering a list item reveals a preview image that follows the cursor.

```ts
const preview = document.getElementById('preview')!;
const moveX = gsap.quickTo(preview, 'x', { duration: 0.3, ease: 'power3.out' });
const moveY = gsap.quickTo(preview, 'y', { duration: 0.3, ease: 'power3.out' });

items.forEach(item => {
  item.addEventListener('mouseenter', () => {
    gsap.to(preview, { opacity: 1, scale: 1, duration: 0.3, ease: 'power3.out' });
  });
  item.addEventListener('mousemove', e => { moveX(e.clientX); moveY(e.clientY); });
  item.addEventListener('mouseleave', () => {
    gsap.to(preview, { opacity: 0, scale: 0.85, duration: 0.2 });
  });
});
```

### Button micro-interactions 🟢

```ts
btn.addEventListener('mouseenter', () =>
  gsap.to(btn, { y: -3, scale: 1.05, duration: 0.2, ease: 'power2.out' }));
btn.addEventListener('mouseleave', () =>
  gsap.to(btn, { y: 0, scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.3)' }));
```

---

## 4 — Entrances & load choreography

### Stagger group entrance 🟢

```ts
gsap.from('.card', { y: 30, opacity: 0, stagger: 0.1, duration: 0.7, ease: ease.expo,
  scrollTrigger: { trigger: '.grid', start: 'top 85%', once: true },
});
```

### Timeline orchestration (loader pattern) ✅
Used for the site loader. Same pattern for any sequenced entrance.

```ts
const tl = gsap.timeline({ defaults: { ease: ease.expo } });
tl.to(counter, { v: 100, duration: 1.4, ease: 'power1.inOut', onUpdate: () => { /* write text */ } }, 0)
  .to('#bar',   { width: '100%', duration: 1.4, ease: 'power1.inOut' }, 0)
  .to('#panel', { yPercent: -100, duration: 1.0, ease: 'expo.inOut' }, '+=0.6')
  .set('#panel', { display: 'none' })
  .to('#nav',   { opacity: 1, duration: 0.6 }, '-=0.5');
```

### Counter 🟢

```ts
const obj = { v: 0 };
gsap.to(obj, {
  v: 2026, duration: 1.8, ease: ease.power2,
  snap: { v: 1 },
  onUpdate: () => { el.textContent = Math.round(obj.v).toString(); },
});
```

### Scroll-linked counter 🟢
Same as above but fires when the stat enters the viewport.

```ts
ScrollTrigger.create({
  trigger: '#stats', start: 'top 80%', once: true,
  onEnter: () => {
    const obj = { v: 0 };
    gsap.to(obj, { v: 128, duration: 1.6, ease: 'power3.out', snap: { v: 1 },
      onUpdate: () => { el.textContent = Math.round(obj.v).toString(); },
    });
  },
});
```

---

## 5 — Immersive systems

### Vortex / tunnel illusion 🟢
Stack rings with `position: absolute; border-radius: 50%` inside a `perspective` container.
Scale + rotate all rings from a scrubbed timeline.

```ts
// CSS: .tunnel { perspective: 800px; } .ring { position: absolute; left: 50%; top: 50%; ... }
const rings = gsap.utils.toArray<HTMLElement>('.ring');
const tl = gsap.timeline({
  scrollTrigger: { trigger: '.tunnel', start: 'top top', end: '+=240%', pin: true, scrub: 1 },
});
rings.forEach((ring, i) => {
  tl.to(ring, {
    scale:    1 + i * 0.35,
    rotation: i % 2 ? 140 : -140,
    opacity:  1 - i * 0.06,
  }, 0);
});
```

### Layered zoom stack 🟢
Three absolutely-positioned planes with different `inset` values — scale + opacity shifts create depth.

```ts
const tl = gsap.timeline({
  scrollTrigger: { trigger: '.zoom', start: 'top top', end: '+=200%', pin: true, scrub: 1 },
});
tl.to('#z1', { scale: 1.22, opacity: 0.42, rotation: -8, duration: 1 })
  .to('#z2', { scale: 1.08, opacity: 0.78, rotation:  6, duration: 1 }, '<')
  .to('#z3', { scale: 0.92, opacity: 1,    duration: 1 }, '<');
```

### FLIP layout transition 🟢
Captures positions before/after a DOM reorder, then animates from the delta.

```ts
const items  = [...grid.children] as HTMLElement[];
const before = items.map(el => el.getBoundingClientRect());

// --- reorder the DOM here ---
newOrder.forEach(el => grid.appendChild(el));

const reordered = [...grid.children] as HTMLElement[];
reordered.forEach((el, i) => {
  const dx = before[i].left - el.getBoundingClientRect().left;
  const dy = before[i].top  - el.getBoundingClientRect().top;
  gsap.fromTo(el, { x: dx, y: dy }, { x: 0, y: 0, duration: 0.6, ease: 'power3.out' });
});
```

### Canvas particles 🟢

```ts
const ctx = canvas.getContext('2d')!;
const pts = Array.from({ length: 60 }, () => ({
  x: W / 2, y: H / 2,
  tx: W / 2 + (Math.random() - 0.5) * 200,
  ty: H / 2 + (Math.random() - 0.5) * 140,
  p: 0, size: 1.5 + Math.random() * 3, hue: 200 + Math.random() * 120,
}));

function draw() {
  ctx.clearRect(0, 0, W, H);
  pts.forEach(pt => {
    ctx.beginPath();
    ctx.arc(
      pt.x + (pt.tx - pt.x) * pt.p,
      pt.y + (pt.ty - pt.y) * pt.p,
      pt.size, 0, Math.PI * 2,
    );
    ctx.fillStyle = `hsla(${pt.hue}, 80%, 70%, ${0.4 + pt.p * 0.6})`;
    ctx.fill();
  });
}

// Expand outward:
pts.forEach((pt, i) =>
  gsap.to(pt, { p: 1, duration: 1.2, delay: i * 0.01, ease: 'power2.out', onUpdate: draw }));
// Collapse back (delay 1.5s):
gsap.to(pts, { p: 0, duration: 0.85, delay: 1.5, stagger: 0.004, ease: 'power3.in', onUpdate: draw });
```

---

## 6 — SVG

### DrawSVG / stroke paint-in 🟢
No plugin — raw `strokeDashoffset`. Used on the loader logo paths.

```css
.path { stroke-dasharray: 200; stroke-dashoffset: 200; }
```
```ts
gsap.to('.path', { strokeDashoffset: 0, duration: 1.5, ease: 'power3.out',
  scrollTrigger: { trigger: '.svg', start: 'top 80%' },
});
```
> `stroke-dasharray` value should roughly equal the path length. Get it via `path.getTotalLength()`.

### SVG distortion (feTurbulence) 🟢
Hover-activated warp — or tie to scroll progress.

```html
<filter id="df">
  <feTurbulence id="turb" type="fractalNoise" baseFrequency="0 0" numOctaves="3"/>
  <feDisplacementMap id="disp" in="SourceGraphic" in2="noise" scale="0"/>
</filter>
<div style="filter: url(#df)">content</div>
```
```ts
const o = { freq: 0, scale: 0 };
const turb = document.getElementById('turb')!;
const disp = document.getElementById('disp')!;

// Warp in on hover:
el.addEventListener('mouseenter', () =>
  gsap.to(o, { freq: 0.02, scale: 22, duration: 0.45, ease: 'power2.out',
    onUpdate: () => {
      turb.setAttribute('baseFrequency', `${o.freq} ${o.freq * 0.75}`);
      disp.setAttribute('scale', o.scale.toString());
    },
  }));
// Settle back:
el.addEventListener('mouseleave', () =>
  gsap.to(o, { freq: 0, scale: 0, duration: 0.8, ease: 'power3.out',
    onUpdate: () => {
      turb.setAttribute('baseFrequency', `${o.freq} ${o.freq * 0.75}`);
      disp.setAttribute('scale', o.scale.toString());
    },
  }));
```

### MotionPath (path travel) 🟢
Free plugin included in GSAP 3.

```ts
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
gsap.registerPlugin(MotionPathPlugin);
gsap.to('#traveler', {
  motionPath: { path: '#curve', align: '#curve', autoRotate: true },
  duration: 2.5, ease: 'power1.inOut',
  scrollTrigger: { trigger: '.section', start: 'top 80%' },
});
```

### MorphSVG 🔴
> Club plugin. For simple shape morphs, tween the `d` attribute directly:
```ts
gsap.to(el, { attr: { d: 'M0,-40 C22,-42...' }, duration: 0.8, ease: 'power2.inOut' });
```

---

## 7 — CSS variable animation 🟢

GSAP can't tween CSS vars directly, but it can tween a plain object and write the value via `onUpdate`.

```ts
// Rotating conic gradient border:
const o = { angle: 0 };
gsap.to(o, {
  angle: 360, duration: 2, ease: 'none', repeat: -1,
  onUpdate: () => {
    el.style.background =
      `conic-gradient(from ${o.angle}deg, var(--color-accent), var(--accent-2), var(--color-accent))`;
  },
});

// Glow intensity driven by scroll:
ScrollTrigger.create({
  trigger: '.section', start: 'top center', end: 'bottom center', scrub: true,
  onUpdate: self => {
    el.style.setProperty('--glow', (self.progress * 40).toString() + 'px');
  },
});
```

---

## 8 — Page transitions

### Overlay wipe (the site default) ✅
A full-screen curtain sweeps in and out between pages. Already in `BaseLayout.astro` — don't rebuild.

### Clip-path circle expand 🟢

```ts
gsap.fromTo('#layer', { clipPath: 'circle(0% at 50% 50%)' }, {
  clipPath: 'circle(150% at 50% 50%)',
  duration: 1, ease: 'power3.inOut',
  onComplete: () =>
    gsap.to('#layer', { clipPath: 'circle(0% at 50% 50%)', duration: 0.6, delay: 0.5 }),
});
```

### Astro page-load cleanup 🟢
Required if any component registers ScrollTrigger instances.

```ts
document.addEventListener('astro:page-load', () => ScrollTrigger.refresh());
// On route change / component unmount:
ScrollTrigger.getAll().forEach(st => st.kill());
```

---

## 9 — Loading screens

Patterns for full-screen loaders that run before the page is revealed. All are free-tier GSAP + CSS/Canvas.

### Minimal line sweep ✅ (site loader)
Progress counter + bar fill + text fade → curtain wipe out. The current site loader follows this pattern exactly.

```ts
const pct = { val: 0 };
const tl = gsap.timeline();
tl.to(text,  { opacity: 1, duration: 0.4, ease: 'power2.out' })
  .to(bar,   { left: '0%', duration: 1.6, ease: 'power2.inOut' }, '-=0.2')
  .to(pct,   { val: 100, duration: 1.6, ease: 'power2.inOut',
    onUpdate() { numEl.textContent = Math.round(pct.val) + '%'; }
  }, '<')
  .to([text, bar, numEl], { opacity: 0, duration: 0.4 }, '+=0.2')
  .to('#loader', { yPercent: -100, duration: 1.0, ease: 'expo.inOut' });
```

### Curtain split 🟢
Two panels split open from center left/right, revealing the page behind.

```ts
// HTML: .curtain-left { left:0; transform-origin:left } .curtain-right { right:0; transform-origin:right }
gsap.set([left, right], { scaleX: 1 });
const tl = gsap.timeline();
tl.to(text, { opacity: 1, duration: 0.4 }, 0.3)
  .to(left,  { scaleX: 0, duration: 0.8, ease: 'power3.inOut' }, 1)
  .to(right, { scaleX: 0, duration: 0.8, ease: 'power3.inOut' }, 1);
```

### Grid cells stagger 🟢
Full-screen grid of cells dissolves away with random stagger, revealing the site.

```ts
const cells = document.querySelectorAll('.grid-cell');
gsap.to(cells, {
  opacity: 0, scale: 0.8,
  duration: 0.4, ease: 'power2.in',
  stagger: { amount: 1.2, from: 'random' },
});
```

### Number counter loader 🟢
Giant number counts 0 → 100 (or any value) as the sole visual. Exits on complete.

```ts
const obj = { val: 0 };
gsap.to(obj, {
  val: 100, duration: 2, ease: 'none',
  onUpdate() { el.textContent = Math.round(obj.val); },
  onComplete() { /* wipe loader out */ },
});
```

### Horizontal bars sweep 🟢
Rows scale in from left (`scaleX: 0 → 1`), hold, then reverse out.

```ts
gsap.set(rows, { scaleX: 0, transformOrigin: 'left center' });
gsap.to(rows, {
  scaleX: 1, duration: 0.6, ease: 'power3.out', stagger: 0.06,
  onComplete() {
    gsap.to(rows, { scaleX: 0, duration: 0.4, ease: 'power2.in', stagger: 0.04, delay: 0.3 });
  },
});
```

### Circle pulse reveal 🟢
Concentric rings pulse outward, then a logo/wordmark fades in at center.

```ts
const rings = [ring1, ring2, ring3];
const tl = gsap.timeline();
gsap.set(rings, { opacity: 0, scale: 0 });
rings.forEach((r, i) => tl.to(r, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, i * 0.15));
tl.to(logoText, { opacity: 1, duration: 0.5 }, 0.5)
  .to(rings, { opacity: 0, scale: 1.5, duration: 0.8, stagger: 0.1 }, '+=0.4');
```

### Pixel dissolve 🟢 (Canvas)
Grid of colored cells fade out with randomized timing, clearing to the page.

```ts
const cols = 20, rows = 12;
const cw = canvas.width / cols, ch = canvas.height / rows;
const cells = Array.from({ length: cols * rows }, (_, i) => ({
  x: i % cols, y: Math.floor(i / cols), alpha: 1,
}));
cells.sort(() => Math.random() - 0.5); // shuffle render order

const obj = { p: 0 };
gsap.to(obj, {
  p: 1, duration: 2, ease: 'power2.inOut',
  onUpdate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cells.forEach((c, i) => {
      const fade = Math.max(0, Math.min(1, (obj.p - i / cells.length * 0.6) / 0.4));
      ctx.fillStyle = `rgba(200, 169, 110, ${1 - fade})`;
      ctx.fillRect(c.x * cw + 1, c.y * ch + 1, cw - 2, ch - 2);
    });
  },
});
```

### Diagonal wipe 🟢
A panel with a skewed right edge (`clip-path: polygon(...)`) slides off to the right.

```ts
// HTML: .diag-panel { clip-path: polygon(0 0, 100% 0, 92% 100%, 0 100%); }
gsap.set(panel, { x: '0%' });
const tl = gsap.timeline();
tl.to(panel, { x: '100%', duration: 0.9, ease: 'power3.inOut' })
  .to(text, { opacity: 1, duration: 0.4 }, '-=0.3')
  .to(text, { opacity: 0, duration: 0.3 }, '+=0.8');
```

### SVG shape morph loader 🟢
An SVG path morphs through several shapes (triangle → pentagon → circle → hexagon) while loading.

```ts
const shapes = [
  'M40,10 L70,70 L10,70 Z',                   // triangle
  'M40,5 L75,40 L55,75 L25,75 L5,40 Z',       // pentagon
  'M60,20 C80,20 100,40 100,60 C100,80...',    // circle-ish
  'M40,10 L70,70 L10,70 Z',                    // back to start
];
let i = 0;
function next() {
  if (++i >= shapes.length) return;
  gsap.to(path, { attr: { d: shapes[i] }, duration: 0.7, ease: 'power2.inOut', onComplete: next });
}
next();
```

### Typewriter loader 🟢
Text types itself in, erases, then types the next phrase. No TextPlugin needed.

```ts
const words = ['Designing...', 'Building...', 'Launching...'];
let wi = 0;
function type(word: string) {
  el.textContent = word;
  gsap.fromTo(el, { width: 0 }, {
    width: word.length * 10.8,  // approximate char width
    duration: word.length * 0.07, ease: 'none',
    onComplete: () => setTimeout(erase, 500),
  });
}
function erase() {
  gsap.to(el, { width: 0, duration: 0.3, ease: 'power2.in',
    onComplete: () => { wi = (wi + 1) % words.length; setTimeout(() => type(words[wi]), 200); },
  });
}
type(words[0]);
```

### Stagger dot burst 🟢
Dots pop in with `back.out` stagger, hold, then collapse back. Works as a minimal waiting state.

```ts
gsap.set(dots, { opacity: 0, scale: 0 });
gsap.to(dots, {
  opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)', stagger: 0.08,
  onComplete() {
    gsap.to(dots, { opacity: 0, scale: 0, duration: 0.3, ease: 'power2.in', stagger: 0.06, delay: 0.5 });
  },
});
```

### Grain texture reveal 🟢 (Canvas)
Animated film-grain noise flickers over the screen, then fades — content title fades in through the grain.

```ts
let frame = 0;
const interval = setInterval(() => {
  const img = ctx.createImageData(canvas.width, canvas.height);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  if (++frame > 40) clearInterval(interval);
}, 40);
gsap.to(text,   { opacity: 1, duration: 0.6, delay: 0.4 });
gsap.to(canvas, { opacity: 0, duration: 0.8, delay: 1.2 });
```

---

## 10 — Intro animations

These run after the loader exits — the first thing the user sees once the page is live.

### Stagger text reveal 🟢
Lines wipe in sequentially using `clip-path: inset(0 0 100% 0) → inset(0 0 0% 0)`.

```ts
gsap.set(lines, { clipPath: 'inset(0 0 100% 0)' });
const tl = gsap.timeline();
lines.forEach((l, i) =>
  tl.to(l, { clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: 'power3.out' }, i * 0.15));
tl.to(sub, { opacity: 1, duration: 0.4 }, 0.4);
```

### SVG logo draw 🟢
Border rectangle and divider line paint in via `strokeDashoffset`, then the wordmark fades in.

```ts
// CSS: .path { stroke-dasharray: [totalLength]; stroke-dashoffset: [totalLength]; }
gsap.set(rect,  { strokeDasharray: 320, strokeDashoffset: 320 });
gsap.set(line1, { strokeDasharray: 80,  strokeDashoffset: 80 });
gsap.set(text,  { opacity: 0 });
const tl = gsap.timeline();
tl.to(rect,  { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out' })
  .to(line1, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' }, '-=0.4')
  .to(text,  { opacity: 1, duration: 0.4 }, '-=0.1');
```
> Get the exact dasharray value at runtime: `el.getTotalLength()`.

### Clip wipe words ✅
Each word slides up out of an `overflow:hidden` container. The core word-reveal pattern used site-wide.

```ts
gsap.set(words, { y: '110%' });
gsap.to(words, { y: '0%', duration: 0.7, ease: 'power3.out', stagger: 0.12 });
```

### Scale + fade sequence 🟢
Icon/symbol scales up from small, then title and subtitle fade in sequentially.

```ts
gsap.set([icon, title, sub], { opacity: 0 });
gsap.set(icon,  { scale: 0.3 });
gsap.set(title, { scale: 0.9 });
const tl = gsap.timeline();
tl.to(icon,  { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' })
  .to(title, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }, '-=0.2')
  .to(sub,   { opacity: 1, duration: 0.4 }, '-=0.1');
```

### Horizontal slide-in 🟢
Content panel slides in from off-screen left, then an accent line extends.

```ts
gsap.set(panel,  { x: '-120%' });
gsap.set(accent, { width: 0 });
gsap.timeline()
  .to(panel,  { x: '0%',  duration: 0.8, ease: 'power3.out' })
  .to(accent, { width: 80, duration: 0.4, ease: 'power2.out' }, '-=0.2');
```

### Particle burst reveal 🟢
Dots explode outward from center, title fades in through them, dots fade away.

```ts
const cx = wrap.offsetWidth / 2, cy = wrap.offsetHeight / 2;
const tl = gsap.timeline();
dots.forEach((d, i) => {
  const angle = (i / dots.length) * Math.PI * 2;
  const dist  = 40 + Math.random() * 60;
  tl.to(d, { opacity: 1, x: Math.cos(angle) * dist, y: Math.sin(angle) * dist,
    duration: 0.6, ease: 'power2.out' }, 0);
});
tl.to(title, { opacity: 1, duration: 0.5 }, 0.2)
  .to(dots,  { opacity: 0, duration: 0.4, ease: 'power2.in', stagger: 0.02 }, 0.6);
```

### Text scramble decode ✅ `scramble()`
Already built — `src/lib/scramble.ts`. See Section 1 for full API.

### Cinematic letterbox 🟢
Black bars slide in from top and bottom (like a film opening), title appears between them, then bars slide back out.

```ts
gsap.set(topBar,  { y: '-100%' });
gsap.set(botBar,  { y:  '100%' });
gsap.set(title,   { opacity: 0 });
gsap.timeline()
  .to([topBar, botBar], { y: '0%',    duration: 0.7, ease: 'power3.out' })
  .to(title,            { opacity: 1, duration: 0.5 }, '-=0.2')
  .to(title,            { opacity: 0, duration: 0.3 }, '+=0.8')
  .to(topBar,           { y: '-100%', duration: 0.7, ease: 'power3.in' })
  .to(botBar,           { y:  '100%', duration: 0.7, ease: 'power3.in' }, '<');
```

### Glitch reveal 🟢
Element rapid-fires `x`/`skewX` offsets with opacity flickers — classic digital glitch entrance.

```ts
const tl = gsap.timeline();
[{ x: 4, skewX: 2 }, { x: -4, skewX: -2 }, { x: 2, skewX: 1 }, { x: 0, skewX: 0 }]
  .forEach((f, i) => tl.to(el, { ...f, duration: 0.06, ease: 'none' }, i * 0.06));
// Opacity flicker:
tl.to(el, { opacity: 0, duration: 0.05 }, 0.1)
  .to(el, { opacity: 1, duration: 0.05 }, 0.15)
  .to(el, { opacity: 0, duration: 0.05 }, 0.22)
  .to(el, { opacity: 1, duration: 0.05 }, 0.27);
```

### Morphing blob 🟢
SVG path tweens through organic shapes — same `attr: { d }` technique as the morph loader.

```ts
const shapes = [
  'M60,20 C80,20 100,40 100,60 C100,80 80,100 60,100...',  // circle
  'M60,15 C90,15 105,45 100,65 C95,85 75,108 55,105...',   // warped
  'M55,18 C85,12 110,38 108,62 C106,86 85,110 62,108...',  // warped 2
  'M60,20 C80,20 100,40 100,60...',                        // back to circle
];
let i = 0;
function next() {
  if (++i >= shapes.length) return;
  gsap.to(blob, { attr: { d: shapes[i] }, duration: 0.9, ease: 'power2.inOut', onComplete: next });
}
next();
```

### Number ticker reveal 🟢
The number wipes up into view while counting, then a label fades in below it.

```ts
gsap.set(numEl, { clipPath: 'inset(0 0 100% 0)' });
const obj = { val: 0 };
gsap.timeline()
  .to(numEl, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'power3.out' })
  .to(obj, {
    val: 100, duration: 1.5, ease: 'power2.out',
    onUpdate() { numEl.textContent = Math.round(obj.val).toString(); },
  }, '<')
  .to(label, { opacity: 1, duration: 0.4 }, '-=0.5');
```

### Elastic character bounce 🟢
Each letter drops in from above with elastic spring — most impactful on short words (3–6 chars).

```ts
const chars = Array.from('HELLO').map(c => {
  const s = document.createElement('span');
  s.style.display = 'inline-block';
  s.textContent = c;
  el.appendChild(s);
  return s;
});
gsap.set(chars, { opacity: 0, y: -60 });
gsap.to(chars, { opacity: 1, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)', stagger: 0.06 });
```

---

## 11 — Plugins not in this stack

| Plugin | What it does | Workaround |
|---|---|---|
| SplitText 🔴 | Auto-splits text into animatable chars/words/lines | Manual `span` wrapping (char loop or `overflow:hidden > span`) |
| ScrambleText 🔴 | Built-in cipher/random-char text animation | `src/lib/scramble.ts` — already built, richer control |
| DrawSVG 🔴 | Animates SVG stroke from/to any point | Raw `strokeDashoffset` tween (same visual result) |
| MorphSVG 🔴 | Morphs between paths with different point counts | `attr: { d: '...' }` tween for simple cases |
| ScrollSmoother 🔴 | GSAP's own smooth scroll with parallax helpers | Lenis 1.1 already in stack — don't add both |

All five are GSAP Club (paid). Everything else in this file uses the free tier.
