import type { StoryBeatCategory } from '../data/storyBeats'
import type { BeatId } from '../data/storyCatalog'

// --- Legacy types (still used by chatbotBooks.ts) ---

export type BeatRecommendation = {
  category: StoryBeatCategory
  beatId: BeatId
  rationale: string
  summary: string
}

// --- New types for beat extraction ---

export type ExtractedBeat = {
  beatId: string
  label: string
  summary: string
}

export type BeatExtractionResponse = {
  beats: ExtractedBeat[]
  title: string
}
