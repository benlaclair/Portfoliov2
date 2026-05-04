export interface Project {
  slug: string;
  title: string;
  shortTitle: string;
  category: 'UX/UI' | 'Brand' | 'AI Creative' | 'Editorial';
  tags: string[];
  coverColor: string;
  coverImage?: string;
  description: string;
  overview: string;
  problem?: string;
  outcome?: string;
  tools: string[];
  year: string;
  role: string;
  client?: string;
  videoUrl?: string;
  images: string[];
  featured: boolean;
}

export const PROJECTS: Project[] = [
  {
    slug: 'vlier',
    title: 'Vlier — Industrial Product Page Redesign',
    shortTitle: 'Vlier',
    category: 'UX/UI',
    tags: ['UX/UI Design', 'B2B', 'Information Architecture', 'Research'],
    coverColor: '#E8FF4A',
    coverImage: '/images/projects/vlier-cover.jpg',
    description: 'Restructuring a legacy industrial product page so the most valuable action — downloading a CAD file — became unavoidable.',
    overview: 'Vlier is a division of Hutchinson Aerospace & Industry that has manufactured precision positioning hardware since 1946. As part of their Website 4.0 initiative, I redesigned the product page UX — the most critical touchpoint in the conversion path. The core shift: stop treating the product page as a catalog and start treating it as the beginning of a sale.',
    problem: 'Engineers came to spec a part and download a CAD file. The old layout buried that download behind a dense table and a single mid-funnel CTA — "Find a Distributor." Two distinct workflows were jammed into one flat scroll.',
    outcome: 'A tabbed layout that separates browsing from speccing, a persistent right-column CTA stack, click-to-populate spec rows, and ANSI/Metric filtering. The CAD download became the primary action.',
    tools: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    year: '2025',
    role: 'UX/UI Designer',
    client: 'Hutchinson Aerospace & Industry',
    images: [],
    featured: true,
  },
  {
    slug: 'veo-olympics',
    title: 'AI Winter Olympics — Broadcast Spot',
    shortTitle: 'VEO Olympics',
    category: 'AI Creative',
    tags: ['AI Video', 'Google Flow', 'TV / CTV', 'Creative Direction'],
    coverColor: '#4A90D9',
    coverImage: '/images/projects/veo-cover.jpg',
    description: 'A 15-second AI-generated TV spot that aired during Winter Olympics coverage — fully storyboarded, generated, and delivered as broadcast-ready footage.',
    overview: 'A pest control brand needed a broadcast spot timed to Winter Olympics coverage — with no Olympic branding, no "Team USA," not even the word "Olympics." The concept: mice as winter athletes, sneaking from the rooftop into the attic. I storyboarded each scene with Gemini and ChatGPT, generated the footage in Google Flow, and delivered production-ready clips to the agency.',
    problem: 'Tell an Olympics-coded story without any Olympic references, and deliver AI footage that holds up on a living-room TV — not just a phone screen.',
    outcome: 'Four production-ready scenes, broadcast-quality lighting and motion, aired during Winter Olympics coverage on traditional TV and CTV.',
    tools: ['Google Flow', 'Gemini', 'ChatGPT', 'Storyboarding'],
    year: '2026',
    role: 'AI Video Creator & Storyboard Lead',
    client: 'Confidential pest control brand',
    videoUrl: '/videos/veo-spot.mp4',
    images: [],
    featured: true,
  },
  {
    slug: 'graphic-design',
    title: 'Graphic Design — Brand & Editorial Work',
    shortTitle: 'Graphic Design',
    category: 'Brand',
    tags: ['Brand Identity', 'Editorial', 'Print', 'Visual Design'],
    coverColor: '#1E293B',
    coverImage: '/images/projects/graphic-design-cover.jpg',
    description: 'A curated selection of brand, editorial, and visual design — spanning esports identity, ESPN-affiliated tournaments, and email design systems.',
    overview: 'Five years of design work across esports personalities and teams, ESPN-affiliated tournaments at The Gazelle Group, and ongoing client work at Market Mentors. The selection here prioritizes craft, range, and brand-system thinking — not volume.',
    problem: 'Designing across wildly different audiences — esports fans, college basketball venues, B2B email subscribers — while keeping each brand distinct and on-strategy.',
    outcome: 'A coherent body of work that reads as range, not chaos. Each piece sits in a system; each system has an audience.',
    tools: ['Photoshop', 'Illustrator', 'InDesign', 'Figma'],
    year: '2020 — 2026',
    role: 'Graphic Designer',
    images: [],
    featured: true,
  },
  {
    slug: 'portfolio',
    title: 'benlaclair.com — This Portfolio',
    shortTitle: 'Portfolio',
    category: 'UX/UI',
    tags: ['UX/UI Design', 'Web Development', 'Brand System'],
    coverColor: '#F8F8F6',
    coverImage: '/images/projects/portfolio-cover.jpg',
    description: 'A custom-built portfolio focused on case study clarity — designed to communicate process and craft over showboating tech.',
    overview: 'I rebuilt this site from scratch in Astro with GSAP, paired Instrument Serif with Geist for an editorial-meets-modern voice, and treated case study clarity as the primary design constraint. Lighthouse 95+ across the board, near-zero hydration cost.',
    problem: 'Most designer portfolios optimize for visual flair and bury the thinking. I wanted the opposite — a site that reads as "I understand design thinking and can execute cleanly."',
    outcome: 'A static-first Astro site, GSAP for purposeful motion, and case studies that lead with the problem, decision, and outcome — not a hero shot.',
    tools: ['Astro', 'GSAP', 'React', 'Tailwind v4', 'Figma', 'Claude Code'],
    year: '2026',
    role: 'Designer & Developer',
    images: [],
    featured: true,
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);
