import './LibraryView.css';
import { storyCoverOptions } from '../data/storyCovers';
import type { Story } from '../types/story';
import { StoryCard } from '../components/StoryCard';

interface LibraryViewProps {
  stories: Story[];
  onOpenStory: (storyId: string) => void;
  onCreateStory: (title: string, imageUrl: string) => void;
  onDeleteStory: (storyId: string) => void;
}

export function LibraryView({ stories, onOpenStory, onCreateStory, onDeleteStory }: LibraryViewProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get('title') ?? '').trim();
    const cover = String(formData.get('cover'));
    if (!title) return;
    onCreateStory(title, cover || storyCoverOptions[0].imageUrl);
    event.currentTarget.reset();
  };

  return (
    <div className="library-view">
      <header className="library-view__intro">
        <div>
          <p className="eyebrow">The Story Within</p>
          <h1>Your library</h1>
          <p>Curate the cinematic beats of your life. Start a new story or revisit a favorite.</p>
        </div>
        <form className="new-story-form" onSubmit={handleSubmit}>
          <label>
            <span>Story title</span>
            <input type="text" name="title" placeholder="A Leap of Faith" required />
          </label>
          <label>
            <span>Cover image</span>
            <select name="cover" defaultValue={storyCoverOptions[0].imageUrl}>
              {storyCoverOptions.map((cover) => (
                <option key={cover.id} value={cover.imageUrl}>
                  {cover.label}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Create story</button>
        </form>
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
              onDelete={() => onDeleteStory(story.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
