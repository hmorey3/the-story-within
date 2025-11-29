import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStories } from '../state/StoriesContext';
import { StoryBeatsView } from '../views/storyBeat/StoryBeatsView';
import { NotFoundPage } from './NotFoundPage';

export function StoryPage() {
  const navigate = useNavigate();
  const { storyId } = useParams<{ storyId: string }>();
  const { stories, addBeatToStory } = useStories();

  const story = useMemo(() => stories.find((entry) => entry.id === storyId) ?? null, [stories, storyId]);

  if (!story || !storyId) {
    return <NotFoundPage message="Story not found." actionLabel="Return to library" onAction={() => navigate('/library')} />;
  }

  return (
    <main className="page">
      <StoryBeatsView
        story={story}
        onBack={() => navigate('/library')}
        onOpenEditor={(beatId) => navigate(`/stories/${story.id}/beats/${beatId}`)}
        onAddBeat={() => {
          const beat = addBeatToStory(story.id);
          navigate(`/stories/${story.id}/beats/${beat.id}`, { state: { startEditing: true } });
        }}
        onOpenCover={(startEditing) => navigate(`/stories/${story.id}/cover`, { state: { startEditing } })}
      />
    </main>
  );
}
