import './StoryCard.css';
import type { Story } from '../types/story';

interface StoryCardProps {
  story: Story;
  onOpen: () => void;
  onDelete: () => void;
}

export function StoryCard({ story, onOpen, onDelete }: StoryCardProps) {
  return (
    <article className="story-card">
      <div className="story-card__image" style={{ backgroundImage: `url(${story.imageUrl})` }} />
      <div className="story-card__body">
        <div>
          <h3>{story.title}</h3>
          <p className="story-card__meta">{story.beats.length} beats</p>
        </div>
        <div className="story-card__actions">
          <button type="button" onClick={onOpen}>Open</button>
          <button type="button" className="story-card__danger" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
