export interface Project {
  slug: string;
  title: string;
  shortTitle: string;
  category: 'UX/UI' | 'Brand' | 'AI Creative' | 'Editorial';
  coverColor: string;
  coverImage?: string;
  /** Source image dimensions — required when coverImage is present, drives <Image /> srcset and prevents CLS. */
  coverWidth?: number;
  coverHeight?: number;
  description: string;
  overview: string;
  problem?: string;
  tools: string[];
  year: string;
  role: string;
  client?: string;
  videoUrl?: string;
  featured: boolean;
}

export const PROJECTS: Project[] = [
  {
    slug: 'vlier',
    title: 'Vlier — Industrial Product Page Redesign',
    shortTitle: 'Vlier',
    category: 'UX/UI',
    coverColor: '#E8FF4A',
    coverImage: '/images/projects/vlier-cover.jpg',
    coverWidth: 1440,
    coverHeight: 900,
    description: 'Restructuring a legacy industrial product page so the most valuable action — downloading a CAD file — became unavoidable.',
    overview: 'Vlier is a division of Hutchinson Aerospace & Industry that has manufactured precision positioning hardware since 1946. As part of their Website 4.0 initiative, I redesigned the product page UX — the most critical touchpoint in the conversion path. The core shift: stop treating the product page as a catalog and start treating it as the beginning of a sale.',
    problem: 'Engineers came to spec a part and download a CAD file. The old layout buried that download behind a dense table and a single mid-funnel CTA — "Find a Distributor." Two distinct workflows were jammed into one flat scroll.',
    tools: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    year: '2025',
    role: 'UX/UI Designer',
    client: 'Hutchinson Aerospace & Industry',
    featured: true,
  },
  {
    slug: 'veo-olympics',
    title: 'AI Winter Olympics — Broadcast Spot',
    shortTitle: 'VEO Olympics',
    category: 'AI Creative',
    coverColor: '#4A90D9',
    coverImage: '/images/projects/veo-cover.jpg',
    coverWidth: 1440,
    coverHeight: 900,
    description: 'A 15-second AI-generated TV spot that aired during Winter Olympics coverage — fully storyboarded, generated, and delivered as broadcast-ready footage.',
    overview: 'A pest control brand needed a broadcast spot timed to Winter Olympics coverage — with no Olympic branding, no "Team USA," not even the word "Olympics." The concept: mice as winter athletes, sneaking from the rooftop into the attic. I storyboarded each scene with Gemini and ChatGPT, generated the footage in Google Flow, and delivered production-ready clips to the agency.',
    problem: 'Tell an Olympics-coded story without any Olympic references, and deliver AI footage that holds up on a living-room TV — not just a phone screen.',
    tools: ['Google Flow', 'Gemini', 'ChatGPT', 'Storyboarding'],
    year: '2026',
    role: 'AI Video Creator & Storyboard Lead',
    client: 'Confidential pest control brand',
    videoUrl: '/videos/veo-spot.mp4',
    featured: true,
  },
  {
    slug: 'graphic-design',
    title: 'Graphic Design — Brand & Editorial Work',
    shortTitle: 'Graphic Design',
    category: 'Brand',
    coverColor: '#1E293B',
    coverImage: '/images/projects/graphic-design-cover.jpg',
    coverWidth: 1440,
    coverHeight: 900,
    description: 'A curated selection of brand, editorial, and visual design — spanning esports identity, ESPN-affiliated tournaments, and email design systems.',
    overview: 'Five years of design work across esports personalities and teams, ESPN-affiliated tournaments at The Gazelle Group, and ongoing client work at Market Mentors. The selection here prioritizes craft, range, and brand-system thinking — not volume.',
    problem: 'Designing across wildly different audiences — esports fans, college basketball venues, B2B email subscribers — while keeping each brand distinct and on-strategy.',
    tools: ['Photoshop', 'Illustrator', 'InDesign', 'Figma'],
    year: '2020 — 2026',
    role: 'Graphic Designer',
    featured: true,
  },
  {
    slug: 'portfolio',
    title: 'benlaclair.com — This Portfolio',
    shortTitle: 'Portfolio',
    category: 'UX/UI',
    coverColor: '#F8F8F6',
    coverImage: '/images/projects/portfolio-cover.jpg',
    coverWidth: 1440,
    coverHeight: 900,
    description: 'A custom-built portfolio focused on case study clarity — designed to communicate process and craft over showboating tech.',
    overview: 'I rebuilt this site from scratch in Astro with GSAP. Clash Display + Satoshi + JetBrains Mono replace the Phase 2 Inter Tight + Instrument Serif pairing; an SVG B-mark replaces the italic "Ben." wordmark; and the homepage now alternates dark and light chapters in a D · D · L · D · L · L · L · D · D rhythm. Case study clarity stayed the primary design constraint — hero word-reveals, [data-reveal] cascade, and Lenis smooth scroll layer in motion without burying the writing.',
    problem: 'Most designer portfolios optimize for visual flair and bury the thinking. I wanted the opposite — a site that reads as "I understand design thinking and can execute cleanly."',
    tools: ['Astro', 'GSAP', 'React', 'Tailwind v4', 'Figma', 'Claude Code'],
    year: '2026',
    role: 'Designer & Developer',
    featured: true,
  },
];
