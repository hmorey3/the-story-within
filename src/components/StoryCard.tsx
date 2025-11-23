import './StoryCard.css';
import type { Story } from '../types/story';

interface StoryCardProps {
  story: Story;
  onOpen: () => void;
}

export function StoryCard({ story, onOpen }: StoryCardProps) {
  const hasImage = Boolean(story.imageUrl);
  return (
    <article className="story-card" role="button" tabIndex={0} onClick={onOpen} onKeyDown={(event) => event.key === 'Enter' && onOpen()}>
      <div className={`story-card__image ${hasImage ? '' : 'is-empty'}`} style={hasImage ? { backgroundImage: `url(${story.imageUrl})` } : undefined} />
      <div className="story-card__body">
        <div>
          <h3>{story.title || 'Untitled story'}</h3>
          <p className="story-card__meta">{story.beats.length} beats</p>
        </div>
      </div>
    </article>
  );
}
