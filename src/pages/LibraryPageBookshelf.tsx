import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStories } from '../state/StoriesContext';
import { CreateStorySpine } from '../components/CreateStorySpine';
import './LibraryPageBookshelf.css';

const SHELF_SIZE = 5;
const MAX_STORY_SLOTS = SHELF_SIZE - 1; // reserve at least one slot for the create button

export function LibraryPageBookshelf() {
  const navigate = useNavigate();
  const { stories, createStory } = useStories();

  const { visibleStories, placeholders } = useMemo(() => {
    const visible = stories.slice(0, MAX_STORY_SLOTS);
    const remainingSlots = Math.max(0, SHELF_SIZE - (visible.length + 1));
    return { visibleStories: visible, placeholders: remainingSlots };
  }, [stories]);

  return (
    <main className="page bookshelf-page">
      <div className="bookshelf-layout">
        <header className="bookshelf__intro">
          <p className="eyebrow">The Story Within</p>
        </header>

        <section className="bookshelf" aria-label="Story bookshelf">
          {visibleStories.map((story) => (
            <button
              key={story.id}
              type="button"
              className="book-spine"
              onClick={() => navigate(`/stories/${story.id}`)}
            >
              <span className="book-spine__cover" style={{ backgroundImage: story.imageUrl ? `url(${story.imageUrl})` : undefined }} />
              <span className="book-spine__content">
                <span className="book-spine__index">A STORY OF</span>
                <span className="book-spine__title">{story.title || 'Untitled Story'}</span>
                <span className="book-spine__cta">{story.isDraft ? 'Continue' : 'View story'}</span>
              </span>
            </button>
          ))}

          <CreateStorySpine
            onCreate={() => {
              const story = createStory('', '');
              navigate(`/stories/${story.id}/cover`, { state: { startEditing: true } });
            }}
          />

          {Array.from({ length: placeholders }).map((_, slotIndex) => (
            <div key={`placeholder-${slotIndex}`} className="book-spine book-spine--placeholder" aria-hidden />
          ))}
        </section>
      </div>
    </main>
  );
}
