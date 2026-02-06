import { createStoryId, updateStoredStories } from '../data/stories'
import type { Story, StoryBeatEntry } from '../data/stories'
import { isBeatId } from '../data/storyCatalog'
import type { BeatRecommendation } from './types'

type CreateStoryParams = {
  title: string
  beatRecommendations: BeatRecommendation[]
}

export const createStoryFromResponse = ({
  title,
  beatRecommendations,
}: CreateStoryParams) => {
  const beats: StoryBeatEntry[] = beatRecommendations
    .map((beat) =>
      isBeatId(beat.beatId)
        ? {
            id: beat.beatId,
            note: beat.summary,
          }
        : null
    )
    .filter((beat): beat is StoryBeatEntry => Boolean(beat))

  const story: Story = { id: createStoryId(), title, beats }
  updateStoredStories((current) => [story, ...current])
  return story
}
