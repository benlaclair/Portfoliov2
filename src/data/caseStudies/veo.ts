import type { CaseStudy, CardItem } from './types';
import { veoStats, veoScenes, veoChallenges, veoProcess, veoOutcomes } from '../veoCaseStudyData';

const sceneCards: CardItem[] = veoScenes.map((s) => ({
  eyebrow: `Scene ${s.number}`,
  title: s.title,
  description: s.description,
}));

export const veoCaseStudy: CaseStudy = {
  slug: 'veo-olympics',
  pre: [
    { kind: 'video', label: '— The spot', caption: '15-second AI-generated broadcast spot — aired during Winter Olympics coverage.' },
    { kind: 'stats', items: veoStats },
  ],
  post: [
    { kind: 'cards', label: '— Scene breakdown', columns: 2, items: sceneCards },
    { kind: 'process', label: '— Process', items: veoProcess },
    { kind: 'challenges', label: '— Constraints & solutions', items: veoChallenges },
    { kind: 'outcomes', label: '— Outcomes', items: veoOutcomes },
  ],
};
