import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { StoryBeatDetailView } from '../views/storyBeat/StoryBeatDetailView';
import { useStories } from '../state/StoriesContext';
import { NotFoundPage } from './NotFoundPage';

export function StoryBeatEditorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { storyId, beatId } = useParams<{ storyId: string; beatId: string }>();
  const { stories, saveBeat, deleteStoryBeat } = useStories();

  const story = useMemo(() => stories.find((entry) => entry.id === storyId) ?? null, [stories, storyId]);
  const startEditing = Boolean((location.state as { startEditing?: boolean } | null)?.startEditing);

  if (!story || !storyId) {
    return <NotFoundPage message="Story not found." actionLabel="Return to library" onAction={() => navigate('/')} />;
  }

  const beatIndex = story.beats.findIndex((entry) => entry.id === beatId);
  const beat = beatIndex >= 0 ? story.beats[beatIndex] : null;

  if (!beat || !beatId) {
    return (
      <NotFoundPage
        message="Beat not found."
        actionLabel="Back to story"
        onAction={() => navigate(`/stories/${story.id}`)}
      />
    );
  }

  const discardDraftBeat = (targetBeatId: string) => {
    deleteStoryBeat(story.id, targetBeatId);
    navigate(`/stories/${story.id}`);
  };

  return (
    <main className="page">
      <StoryBeatDetailView
        storyTitle={story.title}
        beat={beat}
        beatIndex={beatIndex}
        totalBeats={story.beats.length}
        startEditing={startEditing}
        onBack={() => navigate(`/stories/${story.id}`)}
        onDiscardDraft={discardDraftBeat}
        canGoPrev={beatIndex > 0}
        canGoNext={beatIndex < story.beats.length - 1}
        onNavigate={(direction) => {
          const nextIndex = direction === 'next' ? beatIndex + 1 : beatIndex - 1;
          if (nextIndex < 0 || nextIndex >= story.beats.length) return;
          navigate(`/stories/${story.id}/beats/${story.beats[nextIndex].id}`);
        }}
        onSave={(draft) => {
          const saved = saveBeat(story.id, draft);
          navigate(`/stories/${story.id}/beats/${saved.id}`, { replace: true });
          return saved;
        }}
        onDelete={(targetBeatId) => {
          deleteStoryBeat(story.id, targetBeatId);
          const remainingBeats = story.beats.filter((existing) => existing.id !== targetBeatId);
          if (remainingBeats.length === 0) {
            navigate(`/stories/${story.id}`);
            return;
          }
          const nextIndex = Math.max(0, beatIndex - 1);
          navigate(`/stories/${story.id}/beats/${remainingBeats[nextIndex].id}`);
        }}
      />
    </main>
  );
}
