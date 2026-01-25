import type { BeatId } from './storyCatalog'

export type StoryBeatEntry = {
  id: BeatId
  note: string
}

export type Book = {
  id: string
  title: string
  beats: StoryBeatEntry[]
}

const STORAGE_KEY = 'story-within:books'

export const readStoredBooks = (): Book[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const writeStoredBooks = (books: Book[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
}

export const createBookId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `book-${Date.now()}-${Math.random().toString(16).slice(2)}`
}
