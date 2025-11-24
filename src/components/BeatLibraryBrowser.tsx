import { beatTemplatesByCategory } from '../data/beatLibrary';
import type { BeatCategory } from '../types/story';
import { TemplateLibraryBrowser } from './TemplateLibraryBrowser';

const categoryLabels: Record<BeatCategory, string> = {
  departure: 'Departure',
  descent: 'Descent',
  return: 'Return',
};

interface BeatLibraryBrowserProps {
  selectedTemplateId?: string;
  onSelect: (templateId: string) => void;
  layout?: 'rail' | 'grid';
}

export function BeatLibraryBrowser({ selectedTemplateId, onSelect, layout = 'rail' }: BeatLibraryBrowserProps) {
  return (
    <TemplateLibraryBrowser
      selectedTemplateId={selectedTemplateId}
      onSelect={onSelect}
      layout={layout}
      cardLayout="stacked"
      sections={(Object.keys(categoryLabels) as BeatCategory[]).map((category) => ({
        id: category,
        label: categoryLabels[category],
      }))}
      templatesByCategory={beatTemplatesByCategory}
    />
  );
}
