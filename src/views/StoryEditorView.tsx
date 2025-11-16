import './StoryEditorView.css';
import type { StoryBeat } from '../types/story';
import { BeatLibraryBrowser } from '../components/BeatLibraryBrowser';

interface StoryEditorViewProps {
  storyTitle: string;
  beat: StoryBeat;
  beatIndex: number;
  totalBeats: number;
  onBack: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  onUpdateNotes: (notes: string) => void;
  onSelectTemplate: (templateId: string) => void;
}

export function StoryEditorView({
  storyTitle,
  beat,
  beatIndex,
  totalBeats,
  onBack,
  onNavigate,
  canGoPrev,
  canGoNext,
  onUpdateNotes,
  onSelectTemplate,
}: StoryEditorViewProps) {
  return (
    <div className="editor-view">
      <div className="editor-view__canvas">
        <button type="button" className="back-link" onClick={onBack}>
          ← Back to story
        </button>
        <p className="eyebrow">{storyTitle}</p>
        <h1>{beat.title}</h1>
        <p className="editor-view__progress">
          Beat {beatIndex + 1} of {totalBeats}
        </p>
        <div className="editor-view__image" style={{ backgroundImage: `url(${beat.imageUrl})` }} />
        <label className="editor-view__notes">
          <span>Your notes</span>
          <textarea value={beat.notes} onChange={(event) => onUpdateNotes(event.target.value)} placeholder="Capture what this beat means to you" />
        </label>
        <div className="editor-view__navigation">
          <button type="button" onClick={() => onNavigate('prev')} disabled={!canGoPrev}>
            ← Previous
          </button>
          <button type="button" onClick={() => onNavigate('next')} disabled={!canGoNext}>
            Next →
          </button>
        </div>
      </div>
      <aside className="editor-view__library">
        <h2>Beat library</h2>
        <p>Scroll through any phase—Departure, Descent, or Return. Swap images freely.</p>
        <BeatLibraryBrowser selectedTemplateId={beat.templateId} onSelect={onSelectTemplate} />
      </aside>
    </div>
  );
}
