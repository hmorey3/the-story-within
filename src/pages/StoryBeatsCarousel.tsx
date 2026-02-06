import { useEffect, useMemo, useState } from 'react'
import {
  getStoredStory,
  updateStoredStories,
  type Story,
  type StoryBeatEntry,
} from '../data/stories'
import type { BeatId } from '../data/storyCatalog'
import { storyBeatMap, storyBeats } from '../data/storyBeats'
import CarouselIndicator from '../ui/CarouselIndicator'
import Modal from '../ui/Modal'
import './StoryBeatsCarousel.css'

type StoryBeatsCarouselProps = {
  storyId: string
  onClose: () => void
}

function StoryBeatsCarousel({ storyId, onClose }: StoryBeatsCarouselProps) {
  const [story, setStory] = useState<Story | null>(() => getStoredStory(storyId))
  const [index, setIndex] = useState(0)
  const [isPromptOpen, setIsPromptOpen] = useState(false)
  const [selectedBeat, setSelectedBeat] = useState(storyBeats[0]?.id ?? '')
  const [note, setNote] = useState('')
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [flashMessage, setFlashMessage] = useState<string | null>(null)

  useEffect(() => {
    setStory(getStoredStory(storyId))
    setIndex(0)
  }, [storyId])

  const slides = useMemo(() => {
    if (!story) return []

    return story.beats
      .map((entry) => {
        const beat = storyBeatMap.get(entry.id)
        if (!beat) return null
        return { ...beat, note: entry.note }
      })
      .filter((beat): beat is NonNullable<typeof beat> => Boolean(beat))
  }, [story])

  useEffect(() => {
    if (index >= slides.length) setIndex(0)
  }, [index, slides.length])

  const showFlash = (message: string) => {
    setFlashMessage(message)
    window.setTimeout(() => setFlashMessage(null), 1500)
  }

  const saveStory = (updated: Story) => {
    updateStoredStories((current) =>
      current.map((item) => (item.id === updated.id ? updated : item))
    )
    setStory(updated)
  }

  const openAddPrompt = () => {
    if (!story) return
    setSelectedBeat(storyBeats[0]?.id ?? '')
    setNote('')
    setEditIndex(null)
    setIsPromptOpen(true)
  }

  const openEditPrompt = (beatIndex: number) => {
    if (!story) return
    const entry = story.beats[beatIndex]
    if (!entry) return
    setSelectedBeat(entry.id)
    setNote(entry.note)
    setEditIndex(beatIndex)
    setIsPromptOpen(true)
  }

  const handleSaveBeat = () => {
    if (!story || !selectedBeat) {
      setIsPromptOpen(false)
      return
    }

    const entry: StoryBeatEntry = { id: selectedBeat as BeatId, note: note.trim() }
    const beats = [...story.beats]
    if (editIndex === null) beats.push(entry)
    else beats[editIndex] = entry

    saveStory({ ...story, beats })
    setIndex(beats.length - 1)
    setIsPromptOpen(false)
    showFlash(editIndex === null ? 'Beat added.' : 'Beat updated.')
  }

  const handleDeleteBeat = () => {
    if (!story || editIndex === null) {
      setIsPromptOpen(false)
      return
    }

    saveStory({
      ...story,
      beats: story.beats.filter((_, idx) => idx !== editIndex),
    })
    setIsPromptOpen(false)
    showFlash('Beat deleted.')
  }

  const currentSlide = slides[index] ?? null

  return (
    <div className="story-carousel">
      <button
        className="story-carousel__close"
        type="button"
        onClick={onClose}
        aria-label="Close story beats"
      >
        ×
      </button>

      <button
        className="story-carousel__add"
        type="button"
        onClick={openAddPrompt}
        disabled={!story}
        aria-label="Add a story beat"
      >
        +
      </button>

      <button
        className="story-carousel__edit-top"
        type="button"
        onClick={() => openEditPrompt(index)}
        disabled={!story || slides.length === 0}
        aria-label="Edit current story beat"
      >
        ✎
      </button>

      <button
        className="story-carousel__arrow story-carousel__arrow--left"
        type="button"
        onClick={() => setIndex((i) => (i - 1 + Math.max(slides.length, 1)) % Math.max(slides.length, 1))}
        disabled={slides.length < 2}
        aria-label="Previous story beat"
      >
        ‹
      </button>

      <div className="story-carousel__frame">
        {!story ? (
          <div className="story-carousel__empty">
            <p>This story could not be found.</p>
            <button type="button" onClick={onClose}>
              Return home
            </button>
          </div>
        ) : slides.length === 0 ? (
          <div className="story-carousel__empty">No story beats yet. Add one to begin.</div>
        ) : (
          <div
            className="story-carousel__track"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((slide) => (
              <div className="story-carousel__slide" key={slide.id}>
                <img src={slide.src} alt={slide.title} />
              </div>
            ))}
          </div>
        )}
      </div>

      {currentSlide && (
        <div className="story-carousel__meta">
          <div className="story-carousel__caption">
            <h3 className="story-title">{currentSlide.title}</h3>
            <p>{currentSlide.note || ''}</p>
          </div>
          <CarouselIndicator count={slides.length} index={index} />
        </div>
      )}

      <button
        className="story-carousel__arrow story-carousel__arrow--right"
        type="button"
        onClick={() => setIndex((i) => (i + 1) % Math.max(slides.length, 1))}
        disabled={slides.length < 2}
        aria-label="Next story beat"
      >
        ›
      </button>

      {flashMessage && (
        <div className="story-carousel__flash" role="status">
          {flashMessage}
        </div>
      )}

      {isPromptOpen && (
        <Modal
          title={editIndex === null ? 'Add a story beat' : 'Edit story beat'}
          actions={
            <>
              {editIndex !== null && (
                <button
                  type="button"
                  className="modal-delete-btn"
                  onClick={handleDeleteBeat}
                >
                  Delete
                </button>
              )}
              <button type="button" onClick={() => setIsPromptOpen(false)}>
                Cancel
              </button>
              <button type="button" onClick={handleSaveBeat}>
                Save
              </button>
            </>
          }
        >
          <label className="modal-field">
            Choose a beat
            <select value={selectedBeat} onChange={(e) => setSelectedBeat(e.target.value)}>
              {storyBeats.map((beat) => (
                <option value={beat.id} key={beat.id}>
                  {beat.title}
                </option>
              ))}
            </select>
          </label>
          <label className="modal-field">
            Description
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a short note..."
            />
          </label>
        </Modal>
      )}
    </div>
  )
}

export default StoryBeatsCarousel
