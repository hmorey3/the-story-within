import { useState } from 'react';
import './StoryBeatsView.css';
import type { Story } from '../types/story';
import { BeatLibraryBrowser } from '../components/BeatLibraryBrowser';

interface StoryBeatsViewProps {
  story: Story;
  onBack: () => void;
  onOpenEditor: (beatId: string) => void;
  onAddBeat: (templateId: string) => void;
}

export function StoryBeatsView({ story, onBack, onOpenEditor, onAddBeat }: StoryBeatsViewProps) {
  const [isAddingBeat, setIsAddingBeat] = useState(false);

  return (
    <div className="story-view">
      <button type="button" className="back-link" onClick={onBack}>
        ← Library
      </button>
      <header className="story-view__hero">
        <div className="story-view__cover" style={{ backgroundImage: `url(${story.imageUrl})` }} />
        <div>
          <p className="eyebrow">Story</p>
          <h1>{story.title}</h1>
          <p>{story.beats.length} beats captured</p>
          <button type="button" onClick={() => setIsAddingBeat((value) => !value)}>
            {isAddingBeat ? 'Close beat library' : 'Add beat from library'}
          </button>
        </div>
      </header>

      {isAddingBeat && (
        <div className="story-view__library">
          <BeatLibraryBrowser
            layout="grid"
            onSelect={(templateId) => {
              onAddBeat(templateId);
              setIsAddingBeat(false);
            }}
          />
        </div>
      )}

      <div className="story-view__beats">
        {story.beats.length === 0 && <p>No beats yet. Add your first moment.</p>}
        {story.beats.map((beat, index) => (
          <button key={beat.id} type="button" className="story-view__beat" onClick={() => onOpenEditor(beat.id)}>
            <div className="story-view__beat-image" style={{ backgroundImage: `url(${beat.imageUrl})` }} />
            <div>
              <p className="eyebrow">Beat {index + 1}</p>
              <h3>{beat.title}</h3>
              <p className="story-view__beat-notes">{beat.notes || 'Tap to add your notes'}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
