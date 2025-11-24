import type { StoryCoverTemplate, StoryCoverCategory } from '../types/story';

const assetUrl = (fileName: string) => new URL(`../assets/covers/${fileName}`, import.meta.url).href;

export const coverTemplates: StoryCoverTemplate[] = [
  {
    id: 'ego-rise',
    title: 'A Story of Awakening',
    description: 'A lone path toward the summit, driven and focused.',
    imageUrl: assetUrl('dragon_stars.png'),
    category: 'ego',
  },
  {
    id: 'ego-path',
    title: 'A Story of Courage',
    description: 'Ambition framed by city lights and kinetic energy.',
    imageUrl: assetUrl('dragon-battle.png'),
    category: 'soul',
  },
];

export const coverTemplatesByCategory = coverTemplates.reduce<Record<StoryCoverCategory, StoryCoverTemplate[]>>(
  (acc, template) => {
    acc[template.category] = acc[template.category] ? [...acc[template.category], template] : [template];
    return acc;
  },
  { ego: [], soul: [], self: [] }
);

export const coverTemplateLookup = new Map<string, StoryCoverTemplate>(coverTemplates.map((template) => [template.id, template]));
