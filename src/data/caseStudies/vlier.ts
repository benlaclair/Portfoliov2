import type { CaseStudy, StatItem, CardItem, DecisionItem, OutcomeItem } from './types';

const stats: StatItem[] = [
  { value: '100+', label: 'Product variants' },
  { value: '2', label: 'Workflows mapped' },
  { value: '1', label: 'Critical CTA surfaced' },
  { value: 'B2B', label: 'Engineer-first audience' },
];

const personas = [
  {
    role: 'The Browser',
    description:
      "An engineer with a positioning problem. They're comparing options across vendors — Vlier, JW Winco, Carr Lane. They need to scan product families, understand force ranges, and bookmark candidates. Not ready to download anything yet.",
  },
  {
    role: 'The Specifier',
    description:
      "The same engineer, later. They've narrowed it down. Now they need exact dimensions — A through G, thread size, end force. They're going to drop this into a CAD assembly. The download is the conversion. Everything else is friction.",
  },
];

const personaCards: CardItem[] = personas.map((p) => ({
  title: p.role,
  description: p.description,
}));

const decisions: DecisionItem[] = [
  {
    number: '01',
    label: 'Information Architecture',
    title: 'Separate browsing from speccing',
    description:
      'The old page was a single scroll serving both discovery and precision-data phases. I split these into two explicit tabs — Product Info and CAD/Specs. Clicking any part row automatically activates the CAD/Specs tab, moving the user forward without extra navigation.',
    before: 'All information in one scroll → cognitive overload → drop-off',
    after: 'Click a row → CAD tab activates → specs populate → download available',
  },
  {
    number: '02',
    label: 'CTA Hierarchy',
    title: 'Make CAD download the primary action',
    description:
      'I repositioned the CAD download as the most prominent CTA in the right column — persistent, always visible, surfaced the moment a part row is clicked. Find a Distributor moves to Product Info where it belongs: after the engineer has validated the spec.',
    before: "Primary CTA: 'Find a Distributor' (mid-funnel)",
    after: "Primary CTA: 'Download CAD' (conversion)",
  },
  {
    number: '03',
    label: 'Filtering',
    title: 'ANSI/Metric accordion filtering',
    description:
      'Vlier serves both domestic (inch) and international (metric) markets. The old table dumped all variants together. The redesign uses collapsible accordion sections with filter buttons — engineers working in one system don\'t have to mentally filter the other.',
    before: 'All variants mixed in one dense table',
    after: 'Collapsible sections with toggle — one system at a time',
  },
  {
    number: '04',
    label: 'Row Interaction',
    title: 'Click a row to surface the full spec',
    description:
      'Selecting a part number populates a dedicated specs panel in the right column with all dimensions labeled A through G, and auto-activates the CAD/Specs tab. No more hunting.',
    before: 'Inline data in dense rows, no isolation possible',
    after: 'Row click → named spec panel → format select → download',
  },
];

const outcomes: OutcomeItem[] = [
  { label: 'Deliverable', value: '2 full layout comps + dev-ready specs' },
  { label: 'Primary CTA shift', value: "'Find a Distributor' → 'Download CAD'" },
  { label: 'Interaction model', value: 'Row click → spec panel → format → download' },
];

export const vlierCaseStudy: CaseStudy = {
  slug: 'vlier',
  pre: [
    { kind: 'stats', items: stats },
  ],
  post: [
    { kind: 'cards', label: '— Two users, one page', columns: 2, items: personaCards },
    { kind: 'decisions', label: '— Key decisions', items: decisions },
    { kind: 'outcomes', label: '— Outcomes', items: outcomes },
  ],
};
