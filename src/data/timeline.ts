export interface TimelineEntry {
  y: string;
  text: string;
  tag: string;
}

export const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    y: '2018',
    text: 'First freelance esports overlay. Discord DMs, forty bucks, learning Photoshop the hard way.',
    tag: 'Self-taught',
  },
  {
    y: '2019',
    text: 'Pivot to UX. First paid web project for a community nonprofit; learned Figma overnight.',
    tag: 'Pivot',
  },
  {
    y: '2021',
    text: 'Joined the Gazelle Group. Brand systems for ESPN-affiliated tournaments touching ten million screens.',
    tag: 'Studio',
  },
  {
    y: '2024',
    text: 'Vlier and YMCA — first proper enterprise UX engagements. Deliverables that actually shipped.',
    tag: 'Enterprise',
  },
  {
    y: '2026',
    text: 'AI-generated TV spot for the Winter Olympics. Now rebuilding everything — in public.',
    tag: 'Today',
  },
];
