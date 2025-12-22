import './StoryBeatsView.css';
import type { Story } from '../../types/story';
import bookGraphic from '../../assets/book.png';
import { TriangleBeatPager } from '../../components/TriangleBeatPager';

interface StoryBeatsViewProps {
  story: Story;
  onBack: () => void;
  onOpenEditor: (beatId: string) => void;
  onAddBeat: () => void;
  onOpenCover: (startEditing: boolean) => void;
}

export function StoryBeatsView({ story, onBack, onOpenEditor, onAddBeat, onOpenCover }: StoryBeatsViewProps) {
  return (
    <div className="story-view">
      <button type="button" className="back-link" onClick={onBack}>
        ← Library
      </button>
      <header className="story-view__hero">
        <div>
          <p className="eyebrow">A Story Of {story.title}</p>
          <div className="story-view__actions">
            <button type="button" onClick={onAddBeat}>
              New Story Beat
            </button>
            <button type="button" className="secondary" onClick={() => onOpenCover(false)}>
              View cover
            </button>
          </div>
        </div>
      </header>

      <div className="story-view__beats-wrapper">
        {story.beats.length === 0 ? (
          <p>No beats yet. Add your first moment.</p>
        ) : (
          <TriangleBeatPager
            beats={story.beats}
            renderBeat={(beat) => {
              const hasImage = Boolean(beat.imageUrl);
              return (
                <button key={beat.id} type="button" className="story-view__beat" onClick={() => onOpenEditor(beat.id)}>
                  <div
                    className={`story-view__beat-image ${hasImage ? '' : 'is-empty'}`}
                    style={hasImage ? { backgroundImage: `url(${beat.imageUrl})` } : undefined}
                  />
                  <div className="story-view__beat-content">
                    <h3>{beat.title || 'Untitled beat'}</h3>
                    {beat.notes && <p className="story-view__beat-notes">{beat.notes || 'Tap to add your notes'}</p>}
                  </div>
                </button>
              );
            }}
          />
        )}
      </div>

      <img src={bookGraphic} alt="" aria-hidden className="story-view__book" />
    </div>
  );
}
