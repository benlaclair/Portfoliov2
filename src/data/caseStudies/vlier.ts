import type { CaseStudy, CardItem } from './types';
import { vlierStats, vlierPersonas, vlierDecisions, vlierOutcomes } from '../vlierCaseStudyData';

const personaCards: CardItem[] = vlierPersonas.map((p) => ({
  title: p.role,
  description: p.description,
}));

export const vlierCaseStudy: CaseStudy = {
  slug: 'vlier',
  pre: [
    { kind: 'stats', items: vlierStats },
  ],
  post: [
    { kind: 'cards', label: '— Two users, one page', columns: 2, items: personaCards },
    { kind: 'decisions', label: '— Key decisions', items: vlierDecisions },
    { kind: 'outcomes', label: '— Outcomes', items: vlierOutcomes },
  ],
};
