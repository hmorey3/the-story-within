import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { StoryCoverDetailView } from '../views/storyCover/StoryCoverDetailView';
import { useStories } from '../state/StoriesContext';
import { NotFoundPage } from './NotFoundPage';

export function StoryCoverPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { storyId } = useParams<{ storyId: string }>();
  const { stories, renameStory, updateStoryNotes, updateStoryCover, finalizeStory, deleteStory } = useStories();

  const story = useMemo(() => stories.find((entry) => entry.id === storyId) ?? null, [stories, storyId]);
  const startEditing = Boolean((location.state as { startEditing?: boolean } | null)?.startEditing);

  if (!story || !storyId) {
    return <NotFoundPage message="Story not found." actionLabel="Return to library" onAction={() => navigate('/library')} />;
  }

  return (
    <main className="page">
      <StoryCoverDetailView
        story={story}
        startEditing={startEditing}
        onBack={() => {
          if (story.isDraft) {
            deleteStory(story.id);
            navigate('/library');
            return;
          }
          navigate(`/stories/${story.id}`);
        }}
        onSave={({ title, notes, coverTemplateId }) => {
          renameStory(story.id, title);
          updateStoryNotes(story.id, notes);
          if (coverTemplateId) {
            updateStoryCover(story.id, coverTemplateId);
          }
          finalizeStory(story.id);
          navigate(`/stories/${story.id}`);
        }}
        onDelete={() => {
          deleteStory(story.id);
          navigate('/library');
        }}
      />
    </main>
  );
}
