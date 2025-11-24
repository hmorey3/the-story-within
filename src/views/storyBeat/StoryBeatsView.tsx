import './StoryBeatsView.css';
import type { Story } from '../../types/story';

interface StoryBeatsViewProps {
  story: Story;
  onBack: () => void;
  onOpenEditor: (beatId: string) => void;
  onAddBeat: () => void;
  onOpenCover: (startEditing: boolean) => void;
}

export function StoryBeatsView({ story, onBack, onOpenEditor, onAddBeat, onOpenCover }: StoryBeatsViewProps) {
  const storyNotes = story.notes ?? '';

  return (
    <div className="story-view">
      <button type="button" className="back-link" onClick={onBack}>
        ← Library
      </button>
      <header className="story-view__hero">
        <div
          className={`story-view__cover ${story.imageUrl ? '' : 'is-empty'}`}
          style={story.imageUrl ? { backgroundImage: `url(${story.imageUrl})` } : undefined}
        />
        <div>
          <p className="eyebrow">Story</p>
          <h1>{story.title}</h1>
          <p>{story.beats.length} beats captured</p>
          <div className="story-view__actions">
            <button type="button" onClick={onAddBeat}>
              New Story Beat
            </button>
            <button type="button" className="secondary" onClick={() => onOpenCover(false)}>
              View cover
            </button>
          </div>
          {storyNotes && <p className="story-view__notes">{storyNotes}</p>}
        </div>
      </header>

      <div className="story-view__beats">
        {story.beats.length === 0 && <p>No beats yet. Add your first moment.</p>}
        {story.beats.map((beat, index) => {
          const hasImage = Boolean(beat.imageUrl);
          return (
            <button key={beat.id} type="button" className="story-view__beat" onClick={() => onOpenEditor(beat.id)}>
              <div
                className={`story-view__beat-image ${hasImage ? '' : 'is-empty'}`}
                style={hasImage ? { backgroundImage: `url(${beat.imageUrl})` } : undefined}
              />
              <div>
                <p className="eyebrow">Beat {index + 1}</p>
                <h3>{beat.title || 'Untitled beat'}</h3>
                <p className="story-view__beat-notes">{beat.notes || 'Tap to add your notes'}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
