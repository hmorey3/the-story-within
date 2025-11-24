import './TemplateLibraryBrowser.css';
import type { ReactNode } from 'react';

interface TemplateItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface TemplateLibrarySection<Category extends string> {
  id: Category;
  label: string;
}

interface TemplateLibraryBrowserProps<Category extends string> {
  sections: TemplateLibrarySection<Category>[];
  templatesByCategory: Record<Category, TemplateItem[] | undefined>;
  selectedTemplateId?: string;
  onSelect: (templateId: string) => void;
  layout?: 'grid' | 'rail';
  cardLayout?: 'stacked' | 'inline';
  emptyState?: ReactNode;
}

export function TemplateLibraryBrowser<Category extends string>({
  sections,
  templatesByCategory,
  selectedTemplateId,
  onSelect,
  layout = 'grid',
  cardLayout = 'inline',
  emptyState,
}: TemplateLibraryBrowserProps<Category>) {
  return (
    <div className={`template-library template-library--${layout}`}>
      {sections.map((section) => {
        const templates = templatesByCategory[section.id] ?? [];
        if (templates.length === 0 && emptyState) {
          return (
            <section key={section.id} className="template-library__section">
              <div className="template-library__section-header">
                <h3>{section.label}</h3>
              </div>
              {emptyState}
            </section>
          );
        }
        return (
          <section key={section.id} className="template-library__section">
            <div className="template-library__section-header">
              <h3>{section.label}</h3>
            </div>
            <div className="template-library__grid">
              {templates.map((template) => {
                const isSelected = template.id === selectedTemplateId;
                return (
                  <button
                    key={template.id}
                    type="button"
                    className={`template-library__card ${isSelected ? 'is-selected' : ''} ${
                      cardLayout === 'stacked' ? 'template-library__card--stacked' : ''
                    }`.trim()}
                    onClick={() => onSelect(template.id)}
                  >
                    <div className="template-library__image" style={{ backgroundImage: `url(${template.imageUrl})` }} />
                    <div>
                      <p className="template-library__title">{template.title}</p>
                      <p className="template-library__description">{template.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
