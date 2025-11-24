import type { StoryCoverCategory } from '../types/story';

export interface StoryCoverTemplateDataItem {
  id: string;
  title: string;
  description: string;
  imageFile: string;
  category: StoryCoverCategory;
}

export const storyCoverTemplateData: StoryCoverTemplateDataItem[] = [
  {
    id: 'ego-rise',
    title: 'A Story of Awakening',
    description: 'A lone path toward the summit, driven and focused.',
    imageFile: 'dragon_stars.png',
    category: 'ego',
  },
  {
    id: 'ego-path',
    title: 'A Story of Courage',
    description: 'Ambition framed by city lights and kinetic energy.',
    imageFile: 'dragon-battle.png',
    category: 'soul',
  },
];
