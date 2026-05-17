import { useEffect, useMemo, useState } from 'react'
import { readStoredBooks } from '../data/books'
import type { Book } from '../data/books'
import { storyBeatMap } from '../data/storyBeats'
import CarouselIndicator from '../components/CarouselIndicator'
import TintMaskFilter from '../components/TintMaskFilter'
import { Meteors } from '../components/Meteors'
import './StoryBeatsCarousel.css'

type StoryBeatsCarouselProps = {
  bookId: string
  onClose: () => void
}

function StoryBeatsCarousel({ bookId, onClose }: StoryBeatsCarouselProps) {
  const [book, setBook] = useState<Book | null>(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const stored = readStoredBooks()
    const selected = stored.find((item) => item.id === bookId) ?? null
    setBook(selected)
    setIndex(0)
  }, [bookId])

  const slides = useMemo(() => {
    if (!book) return []

    return book.beats
      .map((entry) => {
        const beat = storyBeatMap.get(entry.id)
        if (!beat) return null
        return { ...beat, note: entry.note, label: entry.label }
      })
      .filter((beat): beat is NonNullable<typeof beat> => Boolean(beat))
  }, [book])

  useEffect(() => {
    if (index >= slides.length) setIndex(0)
  }, [index, slides.length])

  const totalSlides = slides.length + 1 // +1 for title slide at index 0
  const goNext = () => setIndex((i) => (i + 1) % totalSlides)
  const goPrev = () => setIndex((i) => (i - 1 + totalSlides) % totalSlides)

  return (
    <div className="story-carousel">
      <TintMaskFilter hexColor="#000000ff" />

      <button
        className="story-carousel__close"
        type="button"
        onClick={onClose}
        aria-label="Close story beats"
      >
        ×
      </button>

      <div className="story-carousel__book">
        <button
          className="story-carousel__arrow story-carousel__arrow--left"
          type="button"
          onClick={goPrev}
          disabled={totalSlides < 2}
          aria-label="Previous story beat"
        >
          ‹
        </button>

        <div className="story-carousel__viewport">
          {!book ? (
            <div className="story-carousel__empty">This story could not be found.</div>
          ) : (
            <div
              className="story-carousel__track"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {/* Title slide */}
              <div className="story-carousel__spread story-carousel__spread--title">
                <Meteors number={20} />
                <div className="story-carousel__title-content">
                  <p className="story-carousel__title-eyebrow">A story of</p>
                  <h1 className="story-carousel__title">{book.title}</h1>
                </div>
              </div>

              {/* Beat slides */}
              {slides.map((slide) => (
                <div className="story-carousel__spread" key={slide.id}>
                  <div className="story-carousel__image-side">
                    <img src={slide.src} alt={slide.title} />
                  </div>
                  <div className="story-carousel__spine" aria-hidden="true" />
                  <div className="story-carousel__text-side">
                    <div className="story-carousel__caption">
                      <h3 className="story-title">{slide.label || slide.title}</h3>
                      <p className="story-carousel__category">{slide.category}</p>
                      <p>{slide.note || ''}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          className="story-carousel__arrow story-carousel__arrow--right"
          type="button"
          onClick={goNext}
          disabled={totalSlides < 2}
          aria-label="Next story beat"
        >
          ›
        </button>
      </div>

      <CarouselIndicator count={totalSlides} index={index} />
    </div>
  )
}

export default StoryBeatsCarousel
