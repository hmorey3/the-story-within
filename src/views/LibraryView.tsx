import './LibraryView.css';
import type { Story } from '../types/story';
import { StoryCard } from '../components/StoryCard';

interface LibraryViewProps {
  stories: Story[];
  onOpenStory: (storyId: string) => void;
  onCreateStory: () => void;
}

export function LibraryView({ stories, onOpenStory, onCreateStory }: LibraryViewProps) {
  return (
    <div className="library-view">
      <header className="library-view__intro">
        <div>
          <p className="eyebrow">The Story Within</p>
          <h1>Your library</h1>
          <p>Curate the cinematic beats of your life. Start a new story or revisit a favorite.</p>
        </div>
        <button className="new-story-button" type="button" onClick={onCreateStory}>
          + New story
        </button>
      </header>

      {stories.length === 0 ? (
        <p className="library-view__empty">No stories yet. Start with your first spark.</p>
      ) : (
        <div className="library-view__grid">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onOpen={() => onOpenStory(story.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
