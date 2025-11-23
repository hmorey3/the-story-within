import type { BeatTemplate } from '../types/story';

export const beatTemplates: BeatTemplate[] = [
  {
    id: 'departure-1',
    title: 'Call to Adventure',
    description: 'The moment life invites you to step outside the familiar.',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    category: 'departure',
  },
  {
    id: 'departure-2',
    title: 'Crossing the Threshold',
    description: 'A decisive step into the unknown.',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    category: 'departure',
  },
  {
    id: 'departure-3',
    title: 'Allies Gather',
    description: 'The companions and support systems that appear early on.',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
    category: 'departure',
  },
  {
    id: 'descent-1',
    title: 'Into the Unknown',
    description: 'Moments of freefall where certainty dissolves.',
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    category: 'descent',
  },
  {
    id: 'descent-2',
    title: 'Facing the Shadow',
    description: 'Meeting the hardest truths or conflicts.',
    imageUrl: 'https://images.unsplash.com/photo-1500534310925-0b815a6f03be?auto=format&fit=crop&w=1200&q=80',
    category: 'descent',
  },
  {
    id: 'descent-3',
    title: 'The Quiet Pause',
    description: 'A hush before transformation, often internal.',
    imageUrl: 'https://images.unsplash.com/photo-1500534311513-7b3c12f394fa?auto=format&fit=crop&w=1200&q=80',
    category: 'descent',
  },
  {
    id: 'return-1',
    title: 'Glimpse of Dawn',
    description: 'Signs that the path upward has begun.',
    imageUrl: 'https://images.unsplash.com/photo-1500534311609-52944a1c70b0?auto=format&fit=crop&w=1200&q=80',
    category: 'return',
  },
  {
    id: 'return-2',
    title: 'Carrying the Gift',
    description: 'What you bring back from the journey.',
    imageUrl: 'https://images.unsplash.com/photo-1500534311886-6c5ebb46a8f0?auto=format&fit=crop&w=1200&q=80',
    category: 'return',
  },
  {
    id: 'return-3',
    title: 'New Ground',
    description: 'Life reshaped by what you learned.',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
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
