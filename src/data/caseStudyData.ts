export const portfolioStats = [
  { value: '~10hrs', label: 'Concept to launch' },
  { value: 'Astro', label: 'Custom-coded' },
  { value: '0', label: 'Templates used' },
  { value: 'GSAP', label: 'Animation system' },
];

export const portfolioDecisions = [
  {
    label: 'Typography',
    title: 'Instrument Serif + Geist',
    description:
      'Instrument Serif brings editorial weight to headings without feeling stiff — it sits between a newspaper masthead and a modern brand. Geist is clean and opinionated at small sizes. Together they read as considered, not corporate.',
    detail: 'Headings: Instrument Serif 400/italic · UI: Geist 500/700 · Code labels: Geist Mono',
  },
  {
    label: 'Motion',
    title: 'GSAP ScrollTrigger, nothing gratuitous',
    description:
      'Every animation serves a purpose — guiding attention, confirming interaction, or staging content to be read in order. No glitch, no scramble, no burst frames. Subtle stagger-fades and scroll-triggered reveals.',
    detail: 'power3.out easing · 0.08s stagger · ScrollTrigger batch on card grids',
  },
  {
    label: 'Architecture',
    title: 'Astro over Next.js',
    description:
      'Astro ships near-zero JavaScript by default. React islands only where genuinely needed (contact form, interactive demos). Lighthouse 95+ on all categories without fighting the framework.',
    detail: 'Static output · Prefetch on viewport · @astrojs/vercel adapter',
  },
  {
    label: 'Case Studies',
    title: 'Problem → Decision → Outcome',
    description:
      'Every case study leads with the problem — not a hero shot of the final design. Hiring managers see the thinking before the artifact. The artifact earns its place in the narrative.',
    detail: 'Unified [slug].astro template · Project-specific data modules',
  },
];
