import { useNavigate } from 'react-router-dom';
import { LibraryView } from '../views/library/LibraryView';
import { useStories } from '../state/StoriesContext';

export function LibraryPage() {
  const navigate = useNavigate();
  const { stories, createStory } = useStories();

  return (
    <main className="page">
      <LibraryView
        stories={stories}
        onOpenStory={(storyId) => navigate(`/stories/${storyId}`)}
        onCreateStory={() => {
          const story = createStory('', '');
          navigate(`/stories/${story.id}/cover`, { state: { startEditing: true } });
        }}
      />
    </main>
  );
}
