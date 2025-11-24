import type { ReactNode } from 'react';

interface DetailEditorHeaderProps {
  chips?: ReactNode;
  title?: ReactNode;
  actions?: ReactNode;
  supportingCopy?: string;
}

export function DetailEditorHeader({ chips, title, actions, supportingCopy }: DetailEditorHeaderProps) {
  return (
    <header className="beat-card__header">
      {chips && <div className="beat-card__chips">{chips}</div>}
      {(title || actions) && (
        <div className="beat-card__title-row">
          {title && <div className="beat-card__title">{title}</div>}
          {actions}
        </div>
      )}
      {supportingCopy && <p className="beat-card__subtitle">{supportingCopy}</p>}
    </header>
  );
}
