import type { StoryCoverTemplate, StoryCoverCategory } from '../types/story';

export const coverTemplates: StoryCoverTemplate[] = [
  {
    id: 'ego-rise',
    title: 'Rising Above',
    description: 'Ambition framed by city lights and kinetic energy.',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    category: 'ego',
  },
  {
    id: 'ego-path',
    title: 'Road to Peak',
    description: 'A lone path toward the summit, driven and focused.',
    imageUrl: 'https://images.unsplash.com/photo-1500534311886-6c5ebb46a8f0?auto=format&fit=crop&w=1200&q=80',
    category: 'ego',
  },
  {
    id: 'ego-spotlight',
    title: 'Center Stage',
    description: 'The heat of the lights when everything is on the line.',
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    category: 'ego',
  },
  {
    id: 'soul-embers',
    title: 'Quiet Embers',
    description: 'Warm light in the dark night, tending inner fire.',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
    category: 'soul',
  },
  {
    id: 'soul-dawn',
    title: 'Early Light',
    description: 'First light breaking through, a softened awakening.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    category: 'soul',
  },
  {
    id: 'soul-harbor',
    title: 'Safe Harbor',
    description: 'Still waters and space to breathe.',
    imageUrl: 'https://images.unsplash.com/photo-1500534311513-7b3c12f394fa?auto=format&fit=crop&w=1200&q=80',
    category: 'soul',
  },
  {
    id: 'self-sky',
    title: 'Wide Open',
    description: 'Expansive sky inviting integration and ease.',
    imageUrl: 'https://images.unsplash.com/photo-1500534311609-52944a1c70b0?auto=format&fit=crop&w=1200&q=80',
    category: 'self',
  },
  {
    id: 'self-balance',
    title: 'Quiet Balance',
    description: 'Balanced stones at water’s edge, grounded presence.',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    category: 'self',
  },
  {
    id: 'self-trail',
    title: 'Return Home',
    description: 'A path winding home with calm confidence.',
    imageUrl: 'https://images.unsplash.com/photo-1500534310925-0b815a6f03be?auto=format&fit=crop&w=1200&q=80',
    category: 'self',
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
