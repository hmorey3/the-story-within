import type { StoryBeatCategory } from '../data/storyBeats'
import type { BeatId } from '../data/storyCatalog'

export type PromptSuggestion = {
  label: string
  mode: 'answer' | 'prefix'
}

export type BeatRecommendation = {
  category: StoryBeatCategory
  beatId: BeatId
  rationale: string
  summary: string
}

export type TitleRecommendation = {
  title: string
  rationale: string
}

export type ChatbotApiResponse = {
  fulfilledCategories: StoryBeatCategory[]
  missingCategories: StoryBeatCategory[]
  beatRecommendations: BeatRecommendation[]
  titleRecommendation: TitleRecommendation | null
  nextQuestionFromAI: string
  summary: string
  promptSuggestionsForUser: PromptSuggestion[]
  isComplete: boolean
}
