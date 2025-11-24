import type { BeatTemplate } from '../types/story';
import { beatTemplateData } from './beatTemplateData';

const assetUrl = (fileName: string) => new URL(`../assets/${fileName}`, import.meta.url).href;

export const beatTemplates: BeatTemplate[] = beatTemplateData.map(({ imageFile, ...template }) => ({
  ...template,
  imageUrl: assetUrl(imageFile),
}));

export const beatTemplatesByCategory = beatTemplates.reduce<Record<string, BeatTemplate[]>>(
  (acc, template) => {
    acc[template.category] = acc[template.category] ? [...acc[template.category], template] : [template];
    return acc;
  },
  {}
);

export const beatTemplateLookup = new Map<string, BeatTemplate>(beatTemplates.map((template) => [template.id, template]));

export { beatTemplateData } from './beatTemplateData';
