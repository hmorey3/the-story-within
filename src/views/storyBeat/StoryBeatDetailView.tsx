import './StoryBeatDetailView.css';
import type { StoryBeat } from '../../types/story';
import { BeatLibraryBrowser } from '../../components/BeatLibraryBrowser';
import { beatTemplateLookup } from '../../data/beatLibrary';
import { DetailEditorVisualPanel } from '../../components/detail-editor/DetailEditorVisualPanel';
import { DetailEditorNotesPanel } from '../../components/detail-editor/DetailEditorNotesPanel';
import { DetailEditorFooter } from '../../components/detail-editor/DetailEditorFooter';
import { DetailEditorHeader } from '../../components/detail-editor/DetailEditorHeader';
import { useDetailEditorState } from '../../hooks/useDetailEditorState';
import { DetailEditorSidebar } from '../../components/detail-editor/DetailEditorSidebar';
import { DetailEditorActions } from '../../components/detail-editor/DetailEditorActions';
import { DecoratedCard } from '../../components/DecoratedCard';

interface StoryBeatDetailViewProps {
  storyTitle: string;
  beat: StoryBeat;
  beatIndex: number;
  totalBeats: number;
  startEditing?: boolean;
  onBack: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  onSave: (beat: StoryBeat) => StoryBeat;
  onDelete: (beatId: string) => void;
  onDiscardDraft?: (beatId: string) => void;
}

export function StoryBeatDetailView({
  storyTitle,
  beat,
  beatIndex: _beatIndex,
  totalBeats: _totalBeats,
  startEditing = false,
  onBack,
  onNavigate,
  canGoPrev,
  canGoNext,
  onSave,
  onDelete,
  onDiscardDraft,
}: StoryBeatDetailViewProps) {
  const {
    draft: draftBeat,
    setDraft: setDraftBeat,
    isDirty,
    isEditing,
    beginEditing,
    cancelEditing,
    attemptExit,
    markDirty,
    applySaved,
    confirmDelete,
  } = useDetailEditorState(beat, { startEditing });

  const heading = draftBeat.title;
  const categoryLabel = draftBeat.category;

  const handleBack = () => {
    attemptExit(() => {
      if (draftBeat.isDraft && onDiscardDraft) {
        onDiscardDraft(draftBeat.id);
        return;
      }
      onBack();
    });
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    attemptExit(() => onNavigate(direction));
  };

  const handleSelectTemplate = (templateId: string) => {
    if (!isEditing) return;
    const template = beatTemplateLookup.get(templateId);
    if (!template) return;
    setDraftBeat((current) => ({
      ...current,
      templateId: template.id,
      title: template.title,
      imageUrl: template.imageUrl,
      category: template.category,
    }));
    markDirty();
  };

  const handleCancel = () => {
    if (draftBeat.isDraft && onDiscardDraft) {
      attemptExit(() => onDiscardDraft(draftBeat.id));
      return;
    }
    cancelEditing();
  };

  const handleSave = () => {
    const saved = onSave(draftBeat);
    applySaved(saved);
  };

  const handleDelete = () => {
    confirmDelete(() => onDelete(draftBeat.id));
  };

  return (
    <div className={`editor-view ${isEditing ? 'is-editing' : 'is-reading'}`}>
      <div className="editor-view__canvas">
        <button type="button" className="back-link" onClick={handleBack}>
          ← Back to story
        </button>
        <DecoratedCard className="beat-card beat-card--cover">
          <DetailEditorHeader
            chips={
              <>
                <p className="eyebrow">{storyTitle}</p>
                {categoryLabel && <span className="chip chip--soft">{categoryLabel}</span>}
              </>
            }
            title={undefined}
            actions={
              !isEditing ? (
                <button type="button" className="beat-card__edit" onClick={beginEditing}>
                  Edit beat
                </button>
              ) : (
                <DetailEditorActions onCancel={handleCancel} onSave={handleSave} onDelete={handleDelete} canSave={isDirty} />
              )
            }
          />

          <div className="beat-card__body detail-card__body">
            <DetailEditorVisualPanel imageUrl={draftBeat.imageUrl} placeholder="Pick a beat to add imagery" />
            <div className="detail-card__text-stack">
              <p className="detail-card__title-text">{heading}</p>
              <DetailEditorNotesPanel
                notes={draftBeat.notes}
                isEditing={isEditing}
                onChange={(value) => {
                  setDraftBeat((current) => ({ ...current, notes: value }));
                  markDirty();
                }}
                placeholder="Capture what this beat means to you"
                showHeader={false}
                className="detail-card__notes"
              />
            </div>
          </div>

          <DetailEditorFooter canGoPrev={canGoPrev} canGoNext={canGoNext} onNavigate={handleNavigate} />
        </DecoratedCard>
      </div>
      {isEditing && (
        <DetailEditorSidebar>
          <BeatLibraryBrowser selectedTemplateId={draftBeat.templateId} onSelect={handleSelectTemplate} />
        </DetailEditorSidebar>
      )}
    </div>
  );
}
