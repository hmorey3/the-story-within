export type StoryBeatEntry = {
  id: string
  note: string
}

export type Book = {
  id: string
  title: string
  beats: StoryBeatEntry[]
}

const storageKey = 'story-within:books'

const isBeatEntry = (value: unknown): value is StoryBeatEntry => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as StoryBeatEntry
  return typeof candidate.id === 'string' && typeof candidate.note === 'string'
}

const isBook = (value: unknown): value is Book => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Book
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    Array.isArray(candidate.beats)
  )
}

const normalizeBeats = (beats: unknown[]): StoryBeatEntry[] => {
  return beats
    .map((beat) => {
      if (typeof beat === 'string') {
        return { id: beat, note: '' }
      }

      if (isBeatEntry(beat)) {
        return beat
      }

      if (beat && typeof beat === 'object') {
        const candidate = beat as Partial<StoryBeatEntry>
        if (typeof candidate.id === 'string') {
          return { id: candidate.id, note: candidate.note ?? '' }
        }
      }

      return null
    })
    .filter((beat): beat is StoryBeatEntry => Boolean(beat))
}

export const readStoredBooks = (): Book[] => {
  const raw = localStorage.getItem(storageKey)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed
        .filter(isBook)
        .map((book) => ({
          ...book,
          beats: normalizeBeats(book.beats),
        }))
    }
  } catch {
    // Ignore invalid storage payloads.
  }

  return []
}

export const writeStoredBooks = (books: Book[]) => {
  localStorage.setItem(storageKey, JSON.stringify(books))
}

export const createBookId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `book-${Date.now()}-${Math.random().toString(16).slice(2)}`
}
