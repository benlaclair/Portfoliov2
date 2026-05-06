import type { CaseStudy, StatItem, CardItem, ChallengeItem, ProcessStep, OutcomeItem } from './types';

const stats: StatItem[] = [
  { value: '15s', label: 'Spot length' },
  { value: '4+', label: 'AI scenes generated' },
  { value: 'TV + CTV', label: 'Aired on' },
  { value: 'Google Flow', label: 'AI platform' },
];

const scenes = [
  {
    number: '01',
    title: 'The Starting Line',
    description:
      'Mice line up at the roofline edge — poised like athletes before a race. Sets the tone: playful, cinematic, unmistakably winter.',
  },
  {
    number: '02',
    title: 'The Sledding Run',
    description:
      'A mouse drops into a gutter and sleds downward — the hero moment. The camera punches in and pans to follow the descent, selling the speed and scale.',
  },
  {
    number: '03',
    title: 'Going Inside',
    description:
      'The mice transition from outdoor athletics to indoor infiltration — slipping through a gap in the structure. The shift from sport to threat happens in a single cut.',
  },
  {
    number: '04',
    title: 'The Attic',
    description:
      "Mice pop up from insulation in the attic — the punchline. They've reached the finish line. Voiceover lands: 'Don't let 'em reach the finish line.'",
  },
];

const sceneCards: CardItem[] = scenes.map((s) => ({
  eyebrow: `Scene ${s.number}`,
  title: s.title,
  description: s.description,
}));

const challenges: ChallengeItem[] = [
  {
    number: '01',
    title: 'No direct Olympic references',
    body: 'Legal restrictions meant zero use of the Olympics logo, rings, "Team USA," "medal," or even the word "Olympics." The concept had to evoke the Games through visual storytelling alone.',
  },
  {
    number: '02',
    title: 'Broadcast-ready AI footage',
    body: 'AI-generated video had to meet the quality bar for traditional TV and CTV — no uncanny artifacts, consistent lighting, believable motion. Each scene went through multiple generation rounds.',
  },
  {
    number: '03',
    title: "Matching the editor's pacing",
    body: 'The script called for precise timing — scenes had to deliver enough usable footage for cuts at specific beats. Generating clips with the right length and composition for a 15-second edit required deliberate prompting.',
  },
];

const process: ProcessStep[] = [
  {
    step: '01',
    title: 'Brief & Concept',
    description: 'Received the creative brief: mice as winter athletes, pest control tie-in, no direct Olympic branding. Broke the script into four distinct scenes for storyboarding.',
  },
  {
    step: '02',
    title: 'Storyboarding with AI',
    description: 'Used Gemini and ChatGPT to fully storyboard each scene — mapping camera angles, character action, lighting, and atmosphere. Iterated on storyboards to build more specific generation prompts.',
  },
  {
    step: '03',
    title: 'Generation in Google Flow',
    description: 'Brought refined prompts into Google Flow. Used a mix of frame-to-frame, extension, and element-to-video techniques to control motion, continuity, and composition across scenes.',
  },
  {
    step: '04',
    title: 'Iteration & Selection',
    description: 'Ran multiple generation rounds per scene, selecting best outputs and refining prompts until each clip held up at full resolution — clean enough for a living-room TV, not just a phone screen.',
  },
  {
    step: '05',
    title: 'Delivery',
    description: 'Delivered production-ready AI footage to the agency for final editing, voiceover integration, sound design, and broadcast packaging.',
  },
];

const outcomes: OutcomeItem[] = [
  { label: 'Deliverable', value: '4+ production-ready AI video scenes' },
  { label: 'Platform', value: 'Aired on traditional TV & CTV during Winter Olympics coverage' },
  { label: 'Format', value: '15-second broadcast spot with VO, SFX, and end slate' },
];

export const veoCaseStudy: CaseStudy = {
  slug: 'veo-olympics',
  pre: [
    { kind: 'video', label: '— The spot', caption: '15-second AI-generated broadcast spot — aired during Winter Olympics coverage.' },
    { kind: 'stats', items: stats },
  ],
  post: [
    { kind: 'cards', label: '— Scene breakdown', columns: 2, items: sceneCards },
    { kind: 'process', label: '— Process', items: process },
    { kind: 'challenges', label: '— Constraints & solutions', items: challenges },
    { kind: 'outcomes', label: '— Outcomes', items: outcomes },
  ],
};
