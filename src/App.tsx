import { useMemo, useState } from 'react';
import './App.css';
import { StoriesProvider, useStories } from './state/StoriesContext';
import { LibraryView } from './views/LibraryView';
import { StoryBeatsView } from './views/StoryBeatsView';
import { StoryBeatDetailView } from './views/StoryBeatDetailView';
import { StoryCoverDetailView } from './views/StoryCoverDetailView';

export function App() {
  return (
    <StoriesProvider>
      <AppContent />
    </StoriesProvider>
  );
}

type ScreenState =
  | { screen: 'library' }
  | { screen: 'story'; storyId: string }
  | { screen: 'editor'; storyId: string; beatId: string; startEditing?: boolean }
  | { screen: 'story-cover'; storyId: string; startEditing?: boolean };

function AppContent() {
  const storyStore = useStories();
  const [screen, setScreen] = useState<ScreenState>({ screen: 'library' });

  const activeStory = useMemo(() => {
    if (screen.screen === 'library') return null;
    return storyStore.stories.find((story) => story.id === screen.storyId) ?? null;
  }, [screen, storyStore.stories]);

  if (screen.screen === 'library') {
    return (
      <main className="page">
        <LibraryView
          stories={storyStore.stories}
          onOpenStory={(storyId) => setScreen({ screen: 'story', storyId })}
          onCreateStory={() => {
            const story = storyStore.createStory('', '');
            setScreen({ screen: 'story-cover', storyId: story.id, startEditing: true });
          }}
        />
      </main>
    );
  }

  if (!activeStory) {
    return (
      <main className="page">
        <p>Story not found.</p>
        <button type="button" onClick={() => setScreen({ screen: 'library' })}>
          Return to library
        </button>
      </main>
    );
  }

  if (screen.screen === 'story-cover' && activeStory) {
    const handleCloseCover = () => {
      if (activeStory.isDraft) {
        storyStore.deleteStory(activeStory.id);
      }
      setScreen({ screen: 'library' });
    };

    return (
      <main className="page">
        <StoryCoverDetailView
          story={activeStory}
          onBack={handleCloseCover}
          startEditing={screen.startEditing}
          onSave={({ title, notes, coverTemplateId }) => {
            storyStore.renameStory(activeStory.id, title);
            storyStore.updateStoryNotes(activeStory.id, notes);
            if (coverTemplateId) {
              storyStore.updateStoryCover(activeStory.id, coverTemplateId);
            }
            storyStore.finalizeStory(activeStory.id);
            setScreen({ screen: 'story-cover', storyId: activeStory.id });
          }}
          onDelete={() => {
            storyStore.deleteStory(activeStory.id);
            setScreen({ screen: 'library' });
          }}
        />
      </main>
    );
  }

  if (screen.screen === 'story') {
    return (
      <main className="page">
        <StoryBeatsView
          story={activeStory}
          onBack={() => setScreen({ screen: 'library' })}
          onOpenEditor={(beatId) => setScreen({ screen: 'editor', storyId: activeStory.id, beatId })}
          onAddBeat={() => {
            const beat = storyStore.addBeatToStory(activeStory.id);
            setScreen({ screen: 'editor', storyId: activeStory.id, beatId: beat.id, startEditing: true });
          }}
          onEditCover={() => setScreen({ screen: 'story-cover', storyId: activeStory.id, startEditing: true })}
        />
      </main>
    );
  }

  if (screen.screen !== 'editor') {
    return (
      <main className="page">
        <p>Screen not found.</p>
        <button type="button" onClick={() => setScreen({ screen: 'library' })}>
          Return to library
        </button>
      </main>
    );
  }

  const beatIndex = activeStory.beats.findIndex((beat) => beat.id === screen.beatId);
  const beat = activeStory.beats[beatIndex];

  if (!beat) {
    return (
      <main className="page">
        <p>Beat not found.</p>
        <button type="button" onClick={() => setScreen({ screen: 'story', storyId: activeStory.id })}>
          Back to story
        </button>
      </main>
    );
  }

  return (
    <main className="page">
      <StoryBeatDetailView
        storyTitle={activeStory.title}
        beat={beat}
        beatIndex={beatIndex}
        totalBeats={activeStory.beats.length}
        startEditing={screen.startEditing}
        onBack={() => setScreen({ screen: 'story', storyId: activeStory.id })}
        canGoPrev={beatIndex > 0}
        canGoNext={beatIndex < activeStory.beats.length - 1}
        onNavigate={(direction) => {
          const nextIndex = direction === 'next' ? beatIndex + 1 : beatIndex - 1;
          if (nextIndex >= 0 && nextIndex < activeStory.beats.length) {
            setScreen({ screen: 'editor', storyId: activeStory.id, beatId: activeStory.beats[nextIndex].id });
          }
        }}
        onSave={(draft) => {
          const saved = storyStore.saveBeat(activeStory.id, draft);
          setScreen({ screen: 'editor', storyId: activeStory.id, beatId: saved.id });
          return saved;
        }}
        onDelete={(beatId) => {
          storyStore.deleteStoryBeat(activeStory.id, beatId);
          const remaining = activeStory.beats.filter((b) => b.id !== beatId);
          if (remaining.length === 0) {
            setScreen({ screen: 'story', storyId: activeStory.id });
          } else {
            const nextIndex = Math.max(0, beatIndex - 1);
            setScreen({ screen: 'editor', storyId: activeStory.id, beatId: remaining[nextIndex].id });
          }
        }}
      />
    </main>
  );
}
