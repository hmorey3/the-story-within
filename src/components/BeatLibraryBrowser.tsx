import './BeatLibraryBrowser.css';
import { beatTemplatesByCategory } from '../data/beatLibrary';
import type { BeatCategory } from '../types/story';

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
    <div className={`beat-library beat-library--${layout}`}>
      {(Object.keys(categoryLabels) as BeatCategory[]).map((category) => (
        <section key={category} className="beat-library__section">
          <header className="beat-library__section-header">
            <p className="beat-library__eyebrow">Hero's Journey · {categoryLabels[category]}</p>
            <h3>{categoryLabels[category]}</h3>
          </header>
          <div className="beat-library__grid">
            {(beatTemplatesByCategory[category] ?? []).map((template) => {
              const isSelected = template.id === selectedTemplateId;
              return (
                <button
                  key={template.id}
                  className={`beat-library__card ${isSelected ? 'is-selected' : ''}`}
                  type="button"
                  onClick={() => onSelect(template.id)}
                >
                  <div className="beat-library__image" style={{ backgroundImage: `url(${template.imageUrl})` }} />
                  <div>
                    <p className="beat-library__title">{template.title}</p>
                    <p className="beat-library__description">{template.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
