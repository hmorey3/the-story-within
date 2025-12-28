import { useEffect, useMemo, useState } from 'react'
import { readStoredBooks, writeStoredBooks } from '../data/books'
import type { Book, StoryBeatEntry } from '../data/books'
import { storyBeatMap, storyBeats } from '../data/storyBeats'
import CarouselIndicator from '../components/CarouselIndicator'
import './StoryBeatsCarousel.css'

type StoryBeatsCarouselProps = {
  bookId: string
  onClose: () => void
}

function StoryBeatsCarousel({ bookId, onClose }: StoryBeatsCarouselProps) {
  const [book, setBook] = useState<Book | null>(null)
  const [index, setIndex] = useState(0)
  const [isPromptOpen, setIsPromptOpen] = useState(false)
  const [selectedBeat, setSelectedBeat] = useState(storyBeats[0]?.id ?? '')
  const [note, setNote] = useState('')
  const [editIndex, setEditIndex] = useState<number | null>(null)

  useEffect(() => {
    const stored = readStoredBooks()
    const selected = stored.find((item) => item.id === bookId) ?? null
    setBook(selected)
    setIndex(0)
  }, [bookId])

  const slides = useMemo(() => {
    if (!book) {
      return []
    }

    return book.beats
      .map((entry) => {
        const beat = storyBeatMap.get(entry.id)
        if (!beat) {
          return null
        }

        return {
          ...beat,
          note: entry.note,
        }
      })
      .filter((beat): beat is NonNullable<typeof beat> => Boolean(beat))
  }, [book])

  useEffect(() => {
    if (index >= slides.length) {
      setIndex(0)
    }
  }, [index, slides.length])

  const goNext = () => {
    setIndex((current) => (current + 1) % Math.max(slides.length, 1))
  }

  const goPrev = () => {
    setIndex(
      (current) =>
        (current - 1 + Math.max(slides.length, 1)) %
        Math.max(slides.length, 1),
    )
  }

  const openPrompt = () => {
    if (!book) {
      return
    }

    const next = storyBeats[0]?.id ?? ''
    setSelectedBeat(next)
    setNote('')
    setEditIndex(null)
    setIsPromptOpen(true)
  }

  const openEditPrompt = (beatIndex: number) => {
    if (!book) {
      return
    }

    const entry = book.beats[beatIndex]
    if (!entry) {
      return
    }

    setSelectedBeat(entry.id)
    setNote(entry.note)
    setEditIndex(beatIndex)
    setIsPromptOpen(true)
  }

  const closePrompt = () => {
    setIsPromptOpen(false)
  }

  const handleSaveBeat = () => {
    if (!book || !selectedBeat) {
      setIsPromptOpen(false)
      return
    }

    const entry: StoryBeatEntry = {
      id: selectedBeat,
      note: note.trim(),
    }

    const updatedBeats = [...book.beats]
    if (editIndex === null) {
      updatedBeats.push(entry)
    } else {
      updatedBeats[editIndex] = entry
    }

    const updated: Book = {
      ...book,
      beats: updatedBeats,
    }
    const stored = readStoredBooks()
    const next = stored.map((item) =>
      item.id === book.id ? updated : item,
    )
    writeStoredBooks(next)
    setBook(updated)
    setIsPromptOpen(false)
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
        onClick={openPrompt}
        disabled={!book}
        aria-label="Add a story beat"
      >
        +
      </button>
      <button
        className="story-carousel__edit-top"
        type="button"
        onClick={() => openEditPrompt(index)}
        disabled={!book || slides.length === 0}
        aria-label="Edit current story beat"
      >
        ✎
      </button>
      <button
        className="story-carousel__arrow story-carousel__arrow--left"
        type="button"
        onClick={goPrev}
        disabled={slides.length < 2}
        aria-label="Previous story beat"
      >
        ‹
      </button>
      <div className="story-carousel__frame">
        {!book ? (
          <div className="story-carousel__empty">
            This story could not be found.
          </div>
        ) : slides.length === 0 ? (
          <div className="story-carousel__empty">
            No story beats yet. Add one to begin.
          </div>
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
            <h3>{currentSlide.title}</h3>
            <p>{currentSlide.note || ''}</p>
          </div>
          <CarouselIndicator count={slides.length} index={index} />
        </div>
      )}
      <button
        className="story-carousel__arrow story-carousel__arrow--right"
        type="button"
        onClick={goNext}
        disabled={slides.length < 2}
        aria-label="Next story beat"
      >
        ›
      </button>
      {isPromptOpen && (
        <div className="story-carousel__prompt" role="dialog" aria-modal="true">
          <div className="story-carousel__prompt-card">
            <h2>{editIndex === null ? 'Add a story beat' : 'Edit story beat'}</h2>
            <label className="story-carousel__prompt-field">
              Choose a beat
              <select
                value={selectedBeat}
                onChange={(event) => setSelectedBeat(event.target.value)}
              >
                {storyBeats.map((beat) => (
                  <option value={beat.id} key={beat.id}>
                    {beat.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="story-carousel__prompt-field">
              Description
              <textarea
                rows={3}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Add a short note..."
              />
            </label>
            <div className="story-carousel__prompt-actions">
              <button type="button" onClick={closePrompt}>
                Cancel
              </button>
              <button type="button" onClick={handleSaveBeat}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StoryBeatsCarousel
