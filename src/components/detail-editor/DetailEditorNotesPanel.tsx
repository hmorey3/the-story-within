interface DetailEditorNotesPanelProps {
  notes: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  title?: string;
  ariaLabel?: string;
  editingHint?: string;
  readOnlyHint?: string;
  placeholder?: string;
  showHeader?: boolean;
  className?: string;
}

export function DetailEditorNotesPanel({
  notes,
  isEditing,
  onChange,
  title = 'Your notes',
  ariaLabel,
  editingHint = 'Refine until it resonates, then save.',
  readOnlyHint = 'Tap edit to capture your thoughts.',
  placeholder = 'Capture what this beat means to you',
  showHeader = true,
  className,
}: DetailEditorNotesPanelProps) {
  const hasContent = Boolean(notes && notes.trim().length > 0);
  const label = ariaLabel ?? title;

  return (
    <div className={`beat-card__notes-panel ${className ?? ''}`.trim()}>
      {showHeader && (
        <div className="beat-card__notes-header">
          <span>{title}</span>
          <span className="beat-card__notes-hint">{isEditing ? editingHint : readOnlyHint}</span>
        </div>
      )}
      {isEditing ? (
        <textarea
          aria-label={label}
          value={notes}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
      ) : hasContent ? (
        <p className="detail-editor__notes-display" aria-label={label}>
          {notes}
        </p>
      ) : null}
    </div>
  );
}
