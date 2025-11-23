import './StoryCoverLibraryBrowser.css';
import { coverTemplatesByCategory } from '../data/storyCoverLibrary';
import type { StoryCoverCategory } from '../types/story';

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
    <div className="cover-library">
      {(Object.keys(categoryLabels) as StoryCoverCategory[]).map((category) => (
        <section key={category} className="cover-library__section">
          <header className="cover-library__section-header">
            <p className="cover-library__eyebrow">Cover Library · {categoryLabels[category]}</p>
            <h3>{categoryLabels[category]}</h3>
          </header>
          <div className="cover-library__grid">
            {(coverTemplatesByCategory[category] ?? []).map((template) => {
              const isSelected = template.id === selectedTemplateId;
              return (
                <button
                  key={template.id}
                  className={`cover-library__card ${isSelected ? 'is-selected' : ''}`}
                  type="button"
                  onClick={() => onSelect(template.id)}
                >
                  <div className="cover-library__image" style={{ backgroundImage: `url(${template.imageUrl})` }} />
                  <div>
                    <p className="cover-library__title">{template.title}</p>
                    <p className="cover-library__description">{template.description}</p>
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
