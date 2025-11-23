import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { beatTemplates } from '../data/beatLibrary';
import { coverTemplates, coverTemplateLookup } from '../data/storyCoverLibrary';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { BeatTemplate, Story, StoryBeat } from '../types/story';

interface StoriesContextValue {
  stories: Story[];
  createStory: (title: string, imageUrl: string) => Story;
  deleteStory: (storyId: string) => void;
  renameStory: (storyId: string, title: string) => void;
  addBeatToStory: (storyId: string, templateId?: string) => StoryBeat;
  updateBeatNotes: (storyId: string, beatId: string, notes: string) => void;
  replaceBeatTemplate: (storyId: string, beatId: string, templateId: string) => void;
  updateStoryCover: (storyId: string, templateId: string) => void;
  updateStoryNotes: (storyId: string, notes: string) => void;
  saveBeat: (storyId: string, beat: StoryBeat) => StoryBeat;
  deleteStoryBeat: (storyId: string, beatId: string) => void;
  finalizeStory: (storyId: string) => void;
}

const StoriesContext = createContext<StoriesContextValue | undefined>(undefined);

const templateLookup = new Map<string, BeatTemplate>(beatTemplates.map((template) => [template.id, template]));

const defaultCover = coverTemplates[0];

const initialStories: Story[] = [
  {
    id: createId(),
    title: 'The Leap to Florence',
    imageUrl: defaultCover.imageUrl,
    coverTemplateId: defaultCover.id,
    coverCategory: defaultCover.category,
    createdAt: new Date().toISOString(),
    notes: '',
    isDraft: false,
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
      coverTemplateId: undefined,
      coverCategory: undefined,
      notes: '',
      createdAt: new Date().toISOString(),
      beats: [],
      isDraft: true,
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

  const addBeatToStory = (storyId: string, templateId?: string) => {
    const beat = templateId ? buildBeatFromTemplate(templateId) : buildBlankBeat();
    persistStories((current) =>
      current.map((story) =>
        story.id === storyId ? { ...story, beats: [...story.beats, beat] } : story
      )
    );
    return beat;
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

  const saveBeat = (storyId: string, beat: StoryBeat) => {
    let savedBeat: StoryBeat | null = null;
    persistStories((current) =>
      current.map((story) => {
        if (story.id !== storyId) return story;
        const beats = story.beats.map((existing) => {
          if (existing.id !== beat.id) return existing;
          savedBeat = { ...existing, ...beat };
          return savedBeat;
        });
        return { ...story, beats };
      })
    );
    return savedBeat ?? beat;
  };

  const deleteStoryBeat = (storyId: string, beatId: string) => {
    persistStories((current) =>
      current.map((story) =>
        story.id === storyId
          ? { ...story, beats: story.beats.filter((beat) => beat.id !== beatId) }
          : story
      )
    );
  };

  const finalizeStory = (storyId: string) => {
    persistStories((current) =>
      current.map((story) => (story.id === storyId ? { ...story, isDraft: false } : story))
    );
  };

  const updateStoryCover = (storyId: string, templateId: string) => {
    const template = coverTemplateLookup.get(templateId);
    if (!template) return;
    persistStories((current) =>
      current.map((story) =>
        story.id === storyId
          ? { ...story, coverTemplateId: template.id, coverCategory: template.category, imageUrl: template.imageUrl }
          : story
      )
    );
  };

  const updateStoryNotes = (storyId: string, notes: string) => {
    persistStories((current) =>
      current.map((story) => (story.id === storyId ? { ...story, notes } : story))
    );
  };

  const value = useMemo(
    () => ({
      stories,
      createStory,
      deleteStory,
      renameStory,
      addBeatToStory,
      updateBeatNotes,
      replaceBeatTemplate,
      updateStoryCover,
      updateStoryNotes,
      saveBeat,
      deleteStoryBeat,
      finalizeStory,
    }),
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

function buildBlankBeat(): StoryBeat {
  return {
    id: createId(),
    templateId: undefined,
    title: '',
    imageUrl: '',
    category: undefined,
    notes: '',
  };
}

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 11);
}
