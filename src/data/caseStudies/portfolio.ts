import type { CaseStudy } from './types';
import { portfolioStats, portfolioDecisions } from '../caseStudyData';

export const portfolioCaseStudy: CaseStudy = {
  slug: 'portfolio',
  pre: [
    { kind: 'stats', items: portfolioStats },
  ],
  post: [
    { kind: 'decisions', label: '— Key decisions', items: portfolioDecisions },
  ],
};
