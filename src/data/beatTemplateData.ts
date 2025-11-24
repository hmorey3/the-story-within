import type { BeatCategory } from '../types/story';

export interface BeatTemplateDataItem {
  id: string;
  title: string;
  description: string;
  imageFile: string;
  category: BeatCategory;
}

export const beatTemplateData: BeatTemplateDataItem[] = [
  {
    id: 'departure-1',
    title: 'Call to Adventure',
    description: 'The moment life invites you to step outside the familiar.',
    imageFile: 'call-to-adventure.png',
    category: 'departure',
  },
  {
    id: 'departure-2',
    title: 'Crossing the Threshold',
    description: 'A decisive step into the unknown.',
    imageFile: 'strange-omen.png',
    category: 'departure',
  },
  {
    id: 'departure-3',
    title: 'Allies Gather',
    description: 'The companions and support systems that appear early on.',
    imageFile: 'wizard.png',
    category: 'departure',
  },
  {
    id: 'descent-1',
    title: 'Into the Unknown',
    description: 'Moments of freefall where certainty dissolves.',
    imageFile: 'descend-into-abyss.png',
    category: 'descent',
  },
  {
    id: 'descent-2',
    title: 'Facing the Shadow',
    description: 'Meeting the hardest truths or conflicts.',
    imageFile: 'facing-the-dragon.png',
    category: 'descent',
  },
  {
    id: 'descent-3',
    title: 'The Quiet Pause',
    description: 'A hush before transformation, often internal.',
    imageFile: 'maiden.png',
    category: 'descent',
  },
  {
    id: 'return-1',
    title: 'Glimpse of Dawn',
    description: 'Signs that the path upward has begun.',
    imageFile: 'call-to-adventure.png',
    category: 'return',
  },
  {
    id: 'return-2',
    title: 'Carrying the Gift',
    description: 'What you bring back from the journey.',
    imageFile: 'treasure.png',
    category: 'return',
  },
  {
    id: 'return-3',
    title: 'New Ground',
    description: 'Life reshaped by what you learned.',
    imageFile: 'treasure2.png',
    category: 'return',
  },
];
