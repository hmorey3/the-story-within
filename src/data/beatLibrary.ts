import type { BeatTemplate } from '../types/story';

const assetUrl = (fileName: string) => new URL(`../assets/${fileName}`, import.meta.url).href;

export const beatTemplates: BeatTemplate[] = [
  {
    id: 'departure-1',
    title: 'Call to Adventure',
    description: 'The moment life invites you to step outside the familiar.',
    imageUrl: assetUrl('call-to-adventure.png'),
    category: 'departure',
  },
  {
    id: 'departure-2',
    title: 'Crossing the Threshold',
    description: 'A decisive step into the unknown.',
    imageUrl: assetUrl('strange-omen.png'),
    category: 'departure',
  },
  {
    id: 'departure-3',
    title: 'Allies Gather',
    description: 'The companions and support systems that appear early on.',
    imageUrl: assetUrl('wizard.png'),
    category: 'departure',
  },
  {
    id: 'descent-1',
    title: 'Into the Unknown',
    description: 'Moments of freefall where certainty dissolves.',
    imageUrl: assetUrl('descend-into-abyss.png'),
    category: 'descent',
  },
  {
    id: 'descent-2',
    title: 'Facing the Shadow',
    description: 'Meeting the hardest truths or conflicts.',
    imageUrl: assetUrl('facing-the-dragon.png'),
    category: 'descent',
  },
  {
    id: 'descent-3',
    title: 'The Quiet Pause',
    description: 'A hush before transformation, often internal.',
    imageUrl: assetUrl('maiden.png'),
    category: 'descent',
  },
  {
    id: 'return-1',
    title: 'Glimpse of Dawn',
    description: 'Signs that the path upward has begun.',
    imageUrl: assetUrl('call-to-adventure.png'),
    category: 'return',
  },
  {
    id: 'return-2',
    title: 'Carrying the Gift',
    description: 'What you bring back from the journey.',
    imageUrl: assetUrl('treasure.png'),
    category: 'return',
  },
  {
    id: 'return-3',
    title: 'New Ground',
    description: 'Life reshaped by what you learned.',
    imageUrl: assetUrl('treasure2.png'),
    category: 'return',
  },
];

export const beatTemplatesByCategory = beatTemplates.reduce<Record<string, BeatTemplate[]>>(
  (acc, template) => {
    acc[template.category] = acc[template.category] ? [...acc[template.category], template] : [template];
    return acc;
  },
  {}
);

export const beatTemplateLookup = new Map<string, BeatTemplate>(beatTemplates.map((template) => [template.id, template]));
