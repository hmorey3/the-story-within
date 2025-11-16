import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { beatTemplates } from '../data/beatLibrary';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { BeatTemplate, Story } from '../types/story';

interface StoriesContextValue {
  stories: Story[];
  createStory: (title: string, imageUrl: string) => Story;
  deleteStory: (storyId: string) => void;
  renameStory: (storyId: string, title: string) => void;
  addBeatToStory: (storyId: string, templateId: string) => void;
  updateBeatNotes: (storyId: string, beatId: string, notes: string) => void;
  replaceBeatTemplate: (storyId: string, beatId: string, templateId: string) => void;
}

const StoriesContext = createContext<StoriesContextValue | undefined>(undefined);

const templateLookup = new Map<string, BeatTemplate>(beatTemplates.map((template) => [template.id, template]));

const initialStories: Story[] = [
  {
    id: createId(),
    title: 'The Leap to Florence',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
    createdAt: new Date().toISOString(),
    beats: ['departure-1', 'descent-2', 'return-2'].map((templateId) => buildBeatFromTemplate(templateId)),
  },
];

export function StoriesProvider({ children }: { children: ReactNode }) {
  const [stories, setStories] = useLocalStorage<Story[]>('tsw-stories', initialStories);

  const persistStories = (updater: (current: Story[]) => Story[]) => {
    setStories((current) => updater(current));
  };

  const createStory = (title: string, imageUrl: string) => {
    const newStory: Story = {
      id: createId(),
      title,
      imageUrl,
      createdAt: new Date().toISOString(),
      beats: [],
    };
    persistStories((current) => [...current, newStory]);
    return newStory;
  };

  const deleteStory = (storyId: string) => {
    persistStories((current) => current.filter((story) => story.id !== storyId));
  };

  const renameStory = (storyId: string, title: string) => {
    persistStories((current) =>
      current.map((story) => (story.id === storyId ? { ...story, title } : story))
    );
  };

  const addBeatToStory = (storyId: string, templateId: string) => {
    const beat = buildBeatFromTemplate(templateId);
    persistStories((current) =>
      current.map((story) =>
        story.id === storyId ? { ...story, beats: [...story.beats, beat] } : story
      )
    );
  };

  const updateBeatNotes = (storyId: string, beatId: string, notes: string) => {
    persistStories((current) =>
      current.map((story) =>
        story.id === storyId
          ? {
              ...story,
              beats: story.beats.map((beat) => (beat.id === beatId ? { ...beat, notes } : beat)),
            }
          : story
      )
    );
  };

  const replaceBeatTemplate = (storyId: string, beatId: string, templateId: string) => {
    const template = templateLookup.get(templateId);
    if (!template) return;
    persistStories((current) =>
      current.map((story) =>
        story.id === storyId
          ? {
              ...story,
              beats: story.beats.map((beat) =>
                beat.id === beatId
                  ? {
                      ...beat,
                      templateId: template.id,
                      title: template.title,
                      imageUrl: template.imageUrl,
                      category: template.category,
                    }
                  : beat
              ),
            }
          : story
      )
    );
  };

  const value = useMemo(
    () => ({ stories, createStory, deleteStory, renameStory, addBeatToStory, updateBeatNotes, replaceBeatTemplate }),
    [stories]
  );

  return <StoriesContext.Provider value={value}>{children}</StoriesContext.Provider>;
}

export function useStories() {
  const context = useContext(StoriesContext);
  if (!context) {
    throw new Error('useStories must be used within a StoriesProvider');
  }
  return context;
}

function buildBeatFromTemplate(templateId: string) {
  const template = templateLookup.get(templateId);
  if (!template) {
    throw new Error(`Unknown beat template: ${templateId}`);
  }
  return {
    id: createId(),
    templateId: template.id,
    title: template.title,
    imageUrl: template.imageUrl,
    category: template.category,
    notes: '',
  };
}

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 11);
}
