import { useEffect, useState } from 'react';

interface UseDetailEditorStateOptions {
  startEditing?: boolean;
  confirmMessage?: string;
}

export function useDetailEditorState<T>(value: T, options?: UseDetailEditorStateOptions) {
  const confirmMessage = options?.confirmMessage ?? 'Are you sure you wish to exit without saving?';
  const [draft, setDraft] = useState(value);
  const [isDirty, setIsDirty] = useState(false);
  const [isEditing, setIsEditing] = useState(options?.startEditing ?? false);

  useEffect(() => {
    setDraft(value);
    setIsDirty(false);
    setIsEditing(options?.startEditing ?? false);
  }, [value, options?.startEditing]);

  const markDirty = () => setIsDirty(true);
  const beginEditing = () => setIsEditing(true);
  const resetToSource = () => {
    setDraft(value);
    setIsDirty(false);
  };
  const exitEditing = () => {
    resetToSource();
    setIsEditing(false);
  };

  const confirmExit = () => {
    if (!isDirty) {
      exitEditing();
      return true;
    }
    const shouldExit = window.confirm(confirmMessage);
    if (shouldExit) {
      exitEditing();
    }
    return shouldExit;
  };

  const attemptExit = (callback?: () => void) => {
    if (!confirmExit()) return false;
    if (callback) callback();
    return true;
  };

  const applySaved = (next?: T) => {
    if (next !== undefined) {
      setDraft(next);
    } else {
      setDraft(value);
    }
    setIsDirty(false);
    setIsEditing(false);
  };

  const confirmDelete = (onConfirm: () => void) => {
    if (!window.confirm('Are you sure you want to delete?')) return;
    onConfirm();
  };

  return {
    draft,
    setDraft,
    isDirty,
    isEditing,
    beginEditing,
    cancelEditing: () => attemptExit(),
    attemptExit,
    markDirty,
    applySaved,
    confirmDelete,
  };
}
