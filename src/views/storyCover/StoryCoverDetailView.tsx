import { useMemo } from 'react';
import '../storyBeat/StoryBeatDetailView.css';
import type { Story } from '../../types/story';
import { StoryCoverLibraryBrowser } from '../../components/StoryCoverLibraryBrowser';
import { coverTemplateLookup } from '../../data/storyCoverLibrary';
import { DetailEditorVisualPanel } from '../../components/detail-editor/DetailEditorVisualPanel';
import { DetailEditorNotesPanel } from '../../components/detail-editor/DetailEditorNotesPanel';
import { DetailEditorHeader } from '../../components/detail-editor/DetailEditorHeader';
import { useDetailEditorState } from '../../hooks/useDetailEditorState';
import { DetailEditorSidebar } from '../../components/detail-editor/DetailEditorSidebar';
import { DetailEditorActions } from '../../components/detail-editor/DetailEditorActions';

interface StoryCoverDetailViewProps {
  story: Story;
  onBack: () => void;
  onSave: (payload: { title: string; notes: string; coverTemplateId?: string }) => void;
  onDelete: () => void;
  startEditing?: boolean;
}

export function StoryCoverDetailView({ story, onBack, onSave, onDelete, startEditing = false }: StoryCoverDetailViewProps) {
  const coverDraft = useMemo(() => {
    const initialTemplate = story.coverTemplateId ? coverTemplateLookup.get(story.coverTemplateId) : undefined;
    return {
      title: initialTemplate?.title ?? story.title,
      notes: story.notes ?? '',
      selectedCoverId: story.coverTemplateId,
      previewImage: story.imageUrl,
    };
  }, [story.id, story.title, story.notes, story.coverTemplateId, story.imageUrl]);
  const { draft, setDraft, isDirty, isEditing, beginEditing, cancelEditing, attemptExit, markDirty, applySaved, confirmDelete } =
    useDetailEditorState(coverDraft, { startEditing });
  const templateForDisplay = useMemo(() => {
    if (draft.selectedCoverId) {
      return coverTemplateLookup.get(draft.selectedCoverId);
    }
    if (story.coverTemplateId) {
      return coverTemplateLookup.get(story.coverTemplateId);
    }
    return undefined;
  }, [draft.selectedCoverId, story.coverTemplateId]);
  const displayTitle = templateForDisplay?.title ?? draft.title ?? 'Select a cover template';

  const handleBack = () => {
    attemptExit(onBack);
  };

  const handleSave = () => {
    onSave({ title: displayTitle, notes: draft.notes, coverTemplateId: draft.selectedCoverId });
    applySaved(draft);
  };

  const handleDelete = () => {
    confirmDelete(onDelete);
  };

  return (
    <div className="editor-view">
      <div className="editor-view__canvas">
        <button type="button" className="back-link" onClick={handleBack}>
          ← Back to story
        </button>
        <section className="beat-card beat-card--cover">
          <DetailEditorHeader
            chips={
              <>
                <p className="eyebrow">Story cover</p>
                {story.coverCategory && <span className="chip chip--soft">{story.coverCategory}</span>}
              </>
            }
            title={undefined}
            actions={
              !isEditing ? (
                <button type="button" className="beat-card__edit" onClick={beginEditing}>
                  Edit cover
                </button>
              ) : (
                <DetailEditorActions onCancel={cancelEditing} onSave={handleSave} onDelete={handleDelete} canSave={isDirty} />
              )
            }
          />

          <div className="beat-card__body detail-card__body">
            <DetailEditorVisualPanel imageUrl={draft.previewImage} placeholder="Choose a cover image" />
            <div className="detail-card__text-stack">
              <p className="detail-card__title-text">{displayTitle}</p>
              <DetailEditorNotesPanel
                notes={draft.notes}
                isEditing={isEditing}
                onChange={(value) => {
                  setDraft((current) => ({ ...current, notes: value }));
                  markDirty();
                }}
                ariaLabel="Your story notes"
                editingHint="Let your words define the story behind the cover."
                readOnlyHint="Tap edit to describe the intention for this cover."
                placeholder="Personal notes here"
                showHeader={false}
                className="detail-card__notes"
              />
            </div>
          </div>
        </section>
      </div>
      {isEditing && (
        <DetailEditorSidebar>
          <StoryCoverLibraryBrowser
            selectedTemplateId={draft.selectedCoverId}
            onSelect={(templateId) => {
              if (!isEditing) return;
              const template = coverTemplateLookup.get(templateId);
              setDraft((current) => ({
                ...current,
                selectedCoverId: templateId,
                previewImage: template?.imageUrl ?? current.previewImage,
                title: template?.title ?? current.title,
              }));
              markDirty();
            }}
          />
        </DetailEditorSidebar>
      )}
    </div>
  );
}
