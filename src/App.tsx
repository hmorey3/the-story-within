import { useMemo, useState } from 'react';
import './App.css';
import { StoriesProvider, useStories } from './state/StoriesContext';
import { LibraryView } from './views/LibraryView';
import { StoryBeatsView } from './views/StoryBeatsView';
import { StoryEditorView } from './views/StoryEditorView';

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
  | { screen: 'editor'; storyId: string; beatId: string };

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
          onCreateStory={(title, imageUrl) => {
            const story = storyStore.createStory(title, imageUrl);
            setScreen({ screen: 'story', storyId: story.id });
          }}
          onDeleteStory={(storyId) => storyStore.deleteStory(storyId)}
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

  if (screen.screen === 'story') {
    return (
      <main className="page">
        <StoryBeatsView
          story={activeStory}
          onBack={() => setScreen({ screen: 'library' })}
          onOpenEditor={(beatId) => setScreen({ screen: 'editor', storyId: activeStory.id, beatId })}
          onAddBeat={(templateId) => storyStore.addBeatToStory(activeStory.id, templateId)}
        />
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
      <StoryEditorView
        storyTitle={activeStory.title}
        beat={beat}
        beatIndex={beatIndex}
        totalBeats={activeStory.beats.length}
        onBack={() => setScreen({ screen: 'story', storyId: activeStory.id })}
        canGoPrev={beatIndex > 0}
        canGoNext={beatIndex < activeStory.beats.length - 1}
        onNavigate={(direction) => {
          const nextIndex = direction === 'next' ? beatIndex + 1 : beatIndex - 1;
          if (nextIndex >= 0 && nextIndex < activeStory.beats.length) {
            setScreen({ screen: 'editor', storyId: activeStory.id, beatId: activeStory.beats[nextIndex].id });
          }
        }}
        onUpdateNotes={(notes) => storyStore.updateBeatNotes(activeStory.id, beat.id, notes)}
        onSelectTemplate={(templateId) => storyStore.replaceBeatTemplate(activeStory.id, beat.id, templateId)}
      />
    </main>
  );
}
