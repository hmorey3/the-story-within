import {
  createBookId,
  readStoredBooks,
  writeStoredBooks,
} from '../data/books'
import type { Book, StoryBeatEntry } from '../data/books'
import { isBeatId } from '../data/storyCatalog'
import type { BeatRecommendation } from './types'

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
