import { useEffect, useState } from 'react';
import './StoryBeatDetailView.css';
import './StoryCoverDetailView.css';
import type { Story } from '../types/story';
import { StoryCoverLibraryBrowser } from '../components/StoryCoverLibraryBrowser';
import { coverTemplateLookup } from '../data/storyCoverLibrary';

interface StoryCoverDetailViewProps {
  story: Story;
  onBack: () => void;
  onSave: (payload: { title: string; notes: string; coverTemplateId?: string }) => void;
  onDelete: () => void;
  startEditing?: boolean;
}

export function StoryCoverDetailView({ story, onBack, onSave, onDelete, startEditing = false }: StoryCoverDetailViewProps) {
  const [title, setTitle] = useState(story.title);
  const [notes, setNotes] = useState(story.notes ?? '');
  const [selectedCoverId, setSelectedCoverId] = useState<string | undefined>(story.coverTemplateId);
  const [previewImage, setPreviewImage] = useState(story.imageUrl);
  const [isDirty, setIsDirty] = useState(false);
  const [isEditing, setIsEditing] = useState(startEditing);

  useEffect(() => {
    setTitle(story.title);
    setNotes(story.notes ?? '');
    setSelectedCoverId(story.coverTemplateId);
    setPreviewImage(story.imageUrl);
    setIsDirty(false);
    setIsEditing(startEditing);
  }, [story.id, story.title, story.notes, story.coverTemplateId, story.imageUrl, startEditing]);

  const hasImage = Boolean(previewImage);

  return (
    <div className="editor-view">
      <div className="editor-view__canvas">
        <button
          type="button"
          className="back-link"
          onClick={() => {
            if (isDirty && !window.confirm('Are you sure you wish to exit without saving?')) {
              return;
            }
            setTitle(story.title);
            setNotes(story.notes ?? '');
            setSelectedCoverId(story.coverTemplateId);
            setPreviewImage(story.imageUrl);
            setIsDirty(false);
            setIsEditing(false);
            onBack();
          }}
        >
          ← Back to library
        </button>
        <p className="eyebrow">Story cover</p>
        <input
          className="cover-editor__title"
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setIsDirty(true);
          }}
          placeholder="Name your story"
          readOnly={!isEditing}
        />
        <p className="editor-view__progress">Choose a cover and set your intention.</p>
        {!isEditing && (
          <button type="button" className="secondary" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
        <div
          className={`editor-view__image ${hasImage ? '' : 'is-empty'}`}
          style={hasImage ? { backgroundImage: `url(${previewImage})` } : undefined}
        >
          {!hasImage && <span className="editor-view__image-placeholder">Choose a cover image</span>}
        </div>
        <label className="editor-view__notes">
          <span>Your story notes</span>
          <textarea
            value={notes}
            onChange={(event) => {
              setNotes(event.target.value);
              setIsDirty(true);
            }}
            placeholder="Capture what this story is about for you"
            readOnly={!isEditing}
          />
        </label>
        {isEditing && (
          <div className="cover-editor__actions">
            <button
              type="button"
              className="secondary"
              onClick={() => {
                if (isDirty && !window.confirm('Are you sure you wish to exit without saving?')) return;
                setTitle(story.title);
                setNotes(story.notes ?? '');
                setSelectedCoverId(story.coverTemplateId);
                setPreviewImage(story.imageUrl);
                setIsDirty(false);
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="primary"
              onClick={() => {
                onSave({ title, notes, coverTemplateId: selectedCoverId });
                setIsDirty(false);
                setIsEditing(false);
              }}
              disabled={!isDirty}
            >
              Save
            </button>
            <button
              type="button"
              className="danger"
              onClick={() => {
                if (!window.confirm('Delete this story? This cannot be undone.')) return;
                onDelete();
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      {isEditing && (
        <aside className="editor-view__library">
          <h2>Cover library</h2>
          <p>Browse Ego, Soul, or Self and pick the imagery that matches your starting point.</p>
          <StoryCoverLibraryBrowser
            selectedTemplateId={selectedCoverId}
            onSelect={(templateId) => {
              if (!isEditing) return;
              const template = coverTemplateLookup.get(templateId);
              setSelectedCoverId(templateId);
              if (template) {
                setPreviewImage(template.imageUrl);
              }
              setIsDirty(true);
            }}
          />
        </aside>
      )}
    </div>
  );
}
