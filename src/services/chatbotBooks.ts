import {
  createBookId,
  readStoredBooks,
  writeStoredBooks,
} from '../data/books'
import type { Book, StoryBeatEntry } from '../data/books'
import { isBeatId } from '../data/storyCatalog'
import type { BeatRecommendation, BeatExtractionResponse } from '../types/chatbot'

type CreateBookParams = {
  title: string
  beatRecommendations: BeatRecommendation[]
}

export const createBookFromResponse = ({
  title,
  beatRecommendations,
}: CreateBookParams) => {
  const beats: StoryBeatEntry[] = beatRecommendations
    .map((beat) =>
      isBeatId(beat.beatId)
        ? {
            id: beat.beatId,
            note: beat.summary,
          }
        : null,
    )
    .filter((beat): beat is StoryBeatEntry => Boolean(beat))

  const newBook: Book = {
    id: createBookId(),
    title,
    beats,
  }

  const stored = readStoredBooks()
  const next = [newBook, ...stored]
  writeStoredBooks(next)

  return newBook
}

// Creates a book from the new beat extraction response format
export const createBookFromExtraction = (extraction: BeatExtractionResponse) => {
  const beats: StoryBeatEntry[] = extraction.beats
    .map((beat) =>
      isBeatId(beat.beatId)
        ? { id: beat.beatId, note: beat.summary, label: beat.label || undefined }
        : null,
    )
    .filter((beat): beat is StoryBeatEntry => Boolean(beat))

  const newBook: Book = {
    id: createBookId(),
    title: extraction.title,
    beats,
  }

  const stored = readStoredBooks()
  const next = [newBook, ...stored]
  writeStoredBooks(next)

  return newBook
}
