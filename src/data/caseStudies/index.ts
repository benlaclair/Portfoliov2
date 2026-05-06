// Slug-keyed registry of case-study content. Add a new case study by
// dropping its definition file alongside this index and adding one entry
// below — no edits to work/[slug].astro required.

import type { CaseStudy } from './types';
import { vlierCaseStudy } from './vlier';
import { veoCaseStudy } from './veo';
import { portfolioCaseStudy } from './portfolio';

export const CASE_STUDIES: Record<string, CaseStudy> = {
  [vlierCaseStudy.slug]: vlierCaseStudy,
  [veoCaseStudy.slug]: veoCaseStudy,
  [portfolioCaseStudy.slug]: portfolioCaseStudy,
};

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES[slug];
}

export type { CaseStudy, CaseStudySection } from './types';
