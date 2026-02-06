import { useMemo, useState } from 'react'
import Header from '../ui/Header'
import Modal from '../ui/Modal'
import defaults from '../defaults.json'
import {
  titleOptions,
  virtueGlyphs,
  type DefaultsConfig,
  type TitleOption,
} from '../data/storyCatalog'
import {
  createStoryId,
  loadOrSeedStories,
  updateStoredStories,
  type Story,
} from '../data/stories'
import './LibraryPage.css'

type LibraryPageProps = {
  onOpenStoryBeats: (storyId: string) => void
}

const { stories: defaultStories } = defaults as DefaultsConfig

function LibraryPage({ onOpenStoryBeats }: LibraryPageProps) {
  const [stories, setStories] = useState<Story[]>(() =>
    loadOrSeedStories(defaultStories, 3)
  )
  const [isPromptOpen, setIsPromptOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedVirtue, setSelectedVirtue] = useState<TitleOption>(titleOptions[0])

  const volumeCounts = useMemo(
    () =>
      stories.reduce<Record<string, number>>((acc, story) => {
        acc[story.title] = (acc[story.title] ?? 0) + 1
        return acc
      }, {}),
    [stories]
  )

  const addStory = (title: string) => {
    const story: Story = { id: createStoryId(), title, beats: [] }
    const next = updateStoredStories((current) => [story, ...current])
    setStories(next)
  }

  const deleteStory = (storyId: string) => {
    const next = updateStoredStories((current) =>
      current.filter((story) => story.id !== storyId)
    )
    setStories(next)
    if (next.length === 0) setIsEditMode(false)
  }

  return (
    <div className="app">
      <Header />
      <main className="page">
        <section className="bookshelf" aria-label="Bookshelf">
          <div className="bookshelf__slot bookshelf__slot--add">
            {!isEditMode ? (
              <button
                className="bookshelf__edit-toggle"
                type="button"
                onClick={() => setIsEditMode(true)}
                aria-label="Enter edit mode"
              >
                ◎
              </button>
            ) : (
              <>
                <button
                  className="bookshelf__add-button"
                  type="button"
                  onClick={() => setIsPromptOpen(true)}
                  aria-label="Add a new story"
                >
                  +
                </button>
                <button
                  className="bookshelf__cancel-edit"
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  aria-label="Exit edit mode"
                >
                  ×
                </button>
              </>
            )}
          </div>

          {stories.map((story) => (
            <div
              className="bookshelf__slot bookshelf__slot--book"
              key={story.id}
            >
              {isEditMode && (
                <button
                  className="bookshelf__delete"
                  type="button"
                  onClick={() => deleteStory(story.id)}
                  aria-label={`Delete ${story.title}`}
                >
                  ×
                </button>
              )}
              <button
                className="bookshelf__book-button"
                type="button"
                onClick={() => onOpenStoryBeats(story.id)}
                aria-label={`Open ${story.title}`}
              >
                <div className="bookshelf__text-block">
                  <span className="bookshelf__label-small">A story of</span>
                  <span className="bookshelf__label-title story-title">
                    {story.title}
                  </span>
                </div>
                <img
                  className="bookshelf__glyph"
                  src={
                    virtueGlyphs[story.title as TitleOption] ?? virtueGlyphs.Courage
                  }
                  alt={`${story.title} glyph`}
                />
                <span className="bookshelf__volume">Vol {volumeCounts[story.title]}</span>
              </button>
            </div>
          ))}
        </section>

        {isPromptOpen && (
          <Modal
            title="Add a virtue"
            actions={
              <>
                <button type="button" onClick={() => setIsPromptOpen(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addStory(selectedVirtue)
                    setIsPromptOpen(false)
                    setIsEditMode(false)
                  }}
                >
                  Add
                </button>
              </>
            }
          >
            <label className="modal-field">
              Choose a title
              <select
                value={selectedVirtue}
                onChange={(e) => setSelectedVirtue(e.target.value as TitleOption)}
              >
                {titleOptions.map((virtue) => (
                  <option value={virtue} key={virtue}>
                    {virtue}
                  </option>
                ))}
              </select>
            </label>
          </Modal>
        )}
      </main>
    </div>
  )
}

export default LibraryPage
