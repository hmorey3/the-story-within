import { useEffect, useMemo, useState } from 'react';
import './StoryBeatDetailView.css';
import type { StoryBeat } from '../types/story';
import { BeatLibraryBrowser } from '../components/BeatLibraryBrowser';
import { beatTemplateLookup } from '../data/beatLibrary';

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
}

export function StoryBeatDetailView({
  storyTitle,
  beat,
  beatIndex,
  totalBeats,
  startEditing = false,
  onBack,
  onNavigate,
  canGoPrev,
  canGoNext,
  onSave,
  onDelete,
}: StoryBeatDetailViewProps) {
  const [draftBeat, setDraftBeat] = useState<StoryBeat>(beat);
  const [isDirty, setIsDirty] = useState(false);
  const [isEditing, setIsEditing] = useState(startEditing);

  useEffect(() => {
    setDraftBeat(beat);
    setIsDirty(false);
    setIsEditing(startEditing);
  }, [beat, startEditing]);

  const hasTemplateSelection = Boolean(draftBeat.templateId);
  const hasImage = Boolean(draftBeat.imageUrl);
  const heading = draftBeat.title || 'New beat';

  const confirmExitIfDirty = () => {
    if (!isDirty) return true;
    const shouldExit = window.confirm('Are you sure you wish to exit without saving?');
    if (shouldExit) {
      setDraftBeat(beat);
      setIsDirty(false);
      setIsEditing(false);
    }
    return shouldExit;
  };

  const handleBack = () => {
    if (!confirmExitIfDirty()) return;
    onBack();
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!confirmExitIfDirty()) return;
    onNavigate(direction);
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
    setIsDirty(true);
  };

  const handleSave = () => {
    const saved = onSave(draftBeat);
    setDraftBeat(saved);
    setIsDirty(false);
    setIsEditing(false);
  };

  const dirtyLabel = useMemo(() => (isDirty ? ' (unsaved changes)' : ''), [isDirty]);

  return (
    <div className="editor-view">
      <div className="editor-view__canvas">
        <button type="button" className="back-link" onClick={handleBack}>
          ← Back to story
        </button>
        <p className="eyebrow">{storyTitle}</p>
        <h1>{heading}</h1>
        <p className="editor-view__progress">
          Beat {beatIndex + 1} of {totalBeats}
          {dirtyLabel}
        </p>
        {!isEditing && (
          <button type="button" className="secondary" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
        <div
          className={`editor-view__image ${hasImage ? '' : 'is-empty'}`}
          style={hasImage ? { backgroundImage: `url(${draftBeat.imageUrl})` } : undefined}
        >
          {!hasImage && <span className="editor-view__image-placeholder">Pick a beat to add imagery</span>}
        </div>
        {!hasTemplateSelection && (
          <p className="editor-view__placeholder">Select a beat from the library to add a title and image.</p>
        )}
        <label className="editor-view__notes">
          <span>Your notes</span>
          <textarea
            value={draftBeat.notes}
            onChange={(event) => {
              setDraftBeat((current) => ({ ...current, notes: event.target.value }));
              setIsDirty(true);
            }}
            placeholder="Capture what this beat means to you"
            readOnly={!isEditing}
          />
        </label>
        <div className="editor-view__navigation">
          <button type="button" onClick={() => handleNavigate('prev')} disabled={!canGoPrev}>
            ← Previous
          </button>
          <div className="editor-view__action-buttons">
            <button type="button" className="secondary" onClick={handleBack}>
              Back
            </button>
            {isEditing && (
              <>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    if (isDirty && !window.confirm('Are you sure you wish to exit without saving?')) return;
                    setDraftBeat(beat);
                    setIsDirty(false);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
                <button type="button" className="primary" onClick={handleSave} disabled={!isDirty}>
                  Save
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => {
                    if (!window.confirm('Delete this beat? This cannot be undone.')) return;
                    onDelete(draftBeat.id);
                  }}
                >
                  Delete
                </button>
              </>
            )}
          </div>
          <button type="button" onClick={() => handleNavigate('next')} disabled={!canGoNext}>
            Next →
          </button>
        </div>
      </div>
      {isEditing && (
        <aside className="editor-view__library">
          <h2>Beat library</h2>
          <p>Scroll through any phase—Departure, Descent, or Return. Swap images freely.</p>
          <BeatLibraryBrowser selectedTemplateId={draftBeat.templateId} onSelect={handleSelectTemplate} />
        </aside>
      )}
    </div>
  );
}
