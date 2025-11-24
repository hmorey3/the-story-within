import type { StoryCoverTemplate, StoryCoverCategory } from '../types/story';
import { storyCoverTemplateData } from './storyCoverTemplateData';

const assetUrl = (fileName: string) => new URL(`../assets/covers/${fileName}`, import.meta.url).href;

export const coverTemplates: StoryCoverTemplate[] = storyCoverTemplateData.map(({ imageFile, ...template }) => ({
  ...template,
  imageUrl: assetUrl(imageFile),
}));

export const coverTemplatesByCategory = coverTemplates.reduce<Record<StoryCoverCategory, StoryCoverTemplate[]>>(
  (acc, template) => {
    acc[template.category] = acc[template.category] ? [...acc[template.category], template] : [template];
    return acc;
  },
  { ego: [], soul: [], self: [] }
);

export const coverTemplateLookup = new Map<string, StoryCoverTemplate>(coverTemplates.map((template) => [template.id, template]));

export { storyCoverTemplateData } from './storyCoverTemplateData';
