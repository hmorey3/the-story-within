import { coverTemplatesByCategory } from '../data/storyCoverLibrary';
import type { StoryCoverCategory } from '../types/story';
import { TemplateLibraryBrowser } from './TemplateLibraryBrowser';

const categoryLabels: Record<StoryCoverCategory, string> = {
  ego: 'Ego',
  soul: 'Soul',
  self: 'Self',
};

interface StoryCoverLibraryBrowserProps {
  selectedTemplateId?: string;
  onSelect: (templateId: string) => void;
}

export function StoryCoverLibraryBrowser({ selectedTemplateId, onSelect }: StoryCoverLibraryBrowserProps) {
  return (
    <TemplateLibraryBrowser
      selectedTemplateId={selectedTemplateId}
      onSelect={onSelect}
      sections={(Object.keys(categoryLabels) as StoryCoverCategory[]).map((category) => ({
        id: category,
        label: categoryLabels[category],
        eyebrowPrefix: 'Cover Library',
      }))}
      templatesByCategory={coverTemplatesByCategory}
    />
  );
}
