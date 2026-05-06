export const portfolioStats = [
  { value: '~10hrs', label: 'Concept to launch' },
  { value: 'Astro', label: 'Custom-coded' },
  { value: '0', label: 'Templates used' },
  { value: 'GSAP', label: 'Animation system' },
];

export const portfolioDecisions: {
  number: string;
  label: string;
  title: string;
  description: string;
  before?: string;
  after?: string;
}[] = [
  {
    number: '01',
    label: 'Typography',
    title: 'Clash Display + Satoshi + JetBrains Mono',
    description:
      'Clash Display 500/600 carries the editorial weight on hero, headings, and timeline numerals — geometric, modern, with enough character to read as a brand voice. Satoshi 400/500/700 handles body and UI: clean, neutral, readable down to 13px. JetBrains Mono picks up labels, eyebrows, and the live coordinate readout — the only place where machine voice belongs.',
    before: 'Phase 2: Inter Tight + Instrument Serif italic for accent words',
    after: 'Phase 3: Clash Display + Satoshi + JetBrains Mono. The accent role moved from an italic serif to an orange <span class="accent">.',
  },
  {
    number: '02',
    label: 'Chapter rhythm',
    title: 'Light and dark sections, alternating',
    description:
      'The homepage reads as a sequence of chapters — Loader, Hero, Tagline, Vbreak, HorizontalWork, Marquee, Timeline, CTA, Footer. Dark anchors (Hero, Vbreak, CTA, Footer) frame light reading beats so the page has a chromatic pulse instead of a single tone. A body[data-mode] tracker swaps the cursor color as the user scrolls between modes.',
    before: 'Single warm-parchment tone for every section',
    after: 'D · D · L · D · L · L · L · D · D rhythm, cursor flips per section',
  },
  {
    number: '03',
    label: 'Identity',
    title: 'SVG B-mark replaces the "Ben." wordmark',
    description:
      'A geometric B inside a rounded square, with an orange accent circle, replaces the Phase 2 italic-Instrument-Serif "Ben." wordmark. Three variants share the same paths: a framed 44×44 mark in the navbar, an unframed 96×96 mark in the footer, and a stroke-painted version in the loader that animates via stroke-dashoffset. currentColor lets the same SVG read on light or dark sections.',
    before: 'Italic Instrument Serif "Ben." wordmark across the site',
    after: 'SVG B-mark, three variants, currentColor-driven',
  },
  {
    number: '04',
    label: 'Motion',
    title: 'Three reveal patterns, used deliberately',
    description:
      'Word-reveal (yPercent 115 → 0) is hero-only, chained off the loader exit. Line-reveal (y 110% → 0) carries multi-line headlines on the CTA, work hero, and case studies. Everything else uses [data-reveal] — a single IntersectionObserver with a sibling-index stagger that fades and lifts elements as they cross the viewport. Lenis 1.4s smooth scroll sits under all of it; reduced-motion disables every layer.',
  },
  {
    number: '05',
    label: 'Architecture',
    title: 'Astro static, one React island',
    description:
      'Astro 5 ships zero JS by default. The only client-hydrated component is the Navbar (for mobile-menu state and the EST clock); ContactForm hydrates on the contact page only. Tailwind v4 via @tailwindcss/vite, with every design token in a single @theme block in global.css. GSAP 3.13 + ScrollTrigger handles motion. Static output, Vercel adapter, Formspree proxy for the contact form.',
  },
  {
    number: '06',
    label: 'Case Studies',
    title: 'Problem → Decision → Outcome',
    description:
      'Every case study leads with the problem — not a hero shot of the final design. Hiring managers see the thinking before the artifact. The artifact earns its place in the narrative.',
  },
];
