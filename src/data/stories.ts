import type { BeatId } from './storyCatalog'

export type StoryBeatEntry = {
  id: BeatId
  note: string
}

export type Story = {
  id: string
  title: string
  beats: StoryBeatEntry[]
}

const STORAGE_KEY = 'story-within:books'

export const readStoredStories = (): Story[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Story[]) : []
  } catch {
    return []
  }
}

export const writeStoredStories = (stories: Story[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stories))
}

export const updateStoredStories = (updater: (current: Story[]) => Story[]) => {
  const next = updater(readStoredStories())
  writeStoredStories(next)
  return next
}

export const loadOrSeedStories = (defaults: Story[], count = 3) => {
  const stored = readStoredStories()
  if (stored.length > 0) return stored

  const seeded = defaults.slice(0, count)
  writeStoredStories(seeded)
  return seeded
}

export const getStoredStory = (storyId: string) =>
  readStoredStories().find((story) => story.id === storyId) ?? null

export const createStoryId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `story-${Date.now()}-${Math.random().toString(16).slice(2)}`
}
