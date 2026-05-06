// Normalized case-study content model.
//
// A case study is a Project plus an ordered list of sections. Each section
// is a discriminated-union object so the template can render it through a
// small per-type component without slug-specific branching.
//
// Sections are split into `pre` and `post` slots — `pre` renders between
// the cover image and the meta+overview block, `post` renders after.
// Stats traditionally sit in `pre`; everything else in `post`.

export interface StatItem {
  value: string;
  label: string;
}

export interface CardItem {
  // Optional eyebrow (e.g. "Scene 01"). When omitted the card uses no eyebrow.
  eyebrow?: string;
  title: string;
  description: string;
}

export interface DecisionItem {
  number: string;
  label: string;
  title: string;
  description: string;
  before?: string;
  after?: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface ChallengeItem {
  number: string;
  title: string;
  body: string;
}

export interface OutcomeItem {
  label: string;
  value: string;
}

export type CaseStudySection =
  | { kind: 'video'; label: string; caption?: string }
  | { kind: 'stats'; items: StatItem[] }
  | { kind: 'cards'; label: string; columns?: 2 | 3; items: CardItem[] }
  | { kind: 'decisions'; label: string; items: DecisionItem[] }
  | { kind: 'process'; label: string; items: ProcessStep[] }
  | { kind: 'challenges'; label: string; items: ChallengeItem[] }
  | { kind: 'outcomes'; label: string; items: OutcomeItem[] };

export interface CaseStudy {
  slug: string;
  // Sections rendered before the meta+overview grid (typically video, stats).
  pre: CaseStudySection[];
  // Sections rendered after the meta+overview grid.
  post: CaseStudySection[];
}
