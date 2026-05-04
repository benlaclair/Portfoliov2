export type ToolStatus = 'live' | 'beta' | 'coming-soon';

export interface Tool {
  id: string;
  slug: string;
  number: string;
  name: string;
  tagline: string;
  problem: string;
  status: ToolStatus;
  url?: string;
  tech: string[];
  visual: 'proofer' | 'social' | 'seo';
  accentColor: string;
}

export const TOOLS: Tool[] = [
  {
    id: 'design-proofer',
    slug: 'design-proofer',
    number: '01',
    name: 'Design Proofer',
    tagline: 'Upload a PDF design and a copy doc — AI finds every discrepancy, highlights it on the design, and exports a client-ready markup report.',
    problem: 'Manual proofing across 40+ client accounts was eating hours per week and still missing errors. No existing tool understood both the design and the copy simultaneously.',
    status: 'live',
    url: 'https://nimbus-done-48723029.figma.site',
    tech: ['React', 'TypeScript', 'Gemini API', 'jsPDF', 'Canvas API'],
    visual: 'proofer',
    accentColor: '#2563EB',
  },
  {
    id: 'social-grid-generator',
    slug: 'social-grid-generator',
    number: '02',
    name: 'Social Grid Generator',
    tagline: 'Paste a month of copy — get a full visual grid of post designs with AI-matched images, bulk selection, and export-ready PNGs in 5 minutes.',
    problem: 'Producing 30+ branded posts per client per month across four platforms was a repetitive time sink. The tool handles image matching, layout, and file naming automatically.',
    status: 'live',
    url: 'https://stage-pickle-21243320.figma.site',
    tech: ['React', 'TypeScript', 'Canvas API', 'JSZip', 'Tailwind'],
    visual: 'social',
    accentColor: '#0F766E',
  },
  {
    id: 'search-intelligence-hub',
    slug: 'search-intelligence-hub',
    number: '03',
    name: 'Search Intelligence Hub',
    tagline: 'An interactive learning platform that breaks down SEO, GEO, and AEO — built to replace a slide deck that wasn\'t sticking.',
    problem: 'A creative team couldn\'t distinguish AEO from a standard FAQ page. A static presentation wasn\'t working — so the presentation became a product: color-coded, interactive, and useful as an ongoing reference.',
    status: 'live',
    url: 'https://dot-crave-26920128.figma.site',
    tech: ['React', 'TypeScript', 'Motion', 'Tailwind', 'Figma Make'],
    visual: 'seo',
    accentColor: '#7C3AED',
  },
];
