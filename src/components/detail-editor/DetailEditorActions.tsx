interface DetailEditorActionsProps {
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
  canSave: boolean;
  cancelLabel?: string;
  saveLabel?: string;
  deleteLabel?: string;
}

export function DetailEditorActions({
  onCancel,
  onSave,
  onDelete,
  canSave,
  cancelLabel = 'Cancel',
  saveLabel = 'Save',
  deleteLabel = 'Delete',
}: DetailEditorActionsProps) {
  return (
    <div className="beat-card__title-actions">
      <button type="button" className="secondary" onClick={onCancel}>
        {cancelLabel}
      </button>
      <button type="button" className={`primary ${!canSave ? 'is-disabled' : ''}`} onClick={onSave} disabled={!canSave}>
        {saveLabel}
      </button>
      <button type="button" className="danger" onClick={onDelete}>
        {deleteLabel}
      </button>
    </div>
  );
}
