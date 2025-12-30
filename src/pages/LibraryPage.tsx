import { useEffect, useState } from 'react'
import logo from '../assets/logo.jpg'
import birdGlyph from '../assets/glyphs/archive/bird.jpg'
import moonGlyph from '../assets/glyphs/archive/moon.jpg'
import sproutGlyph from '../assets/glyphs/archive/sprout.jpg'
import sunGlyph from '../assets/glyphs/archive/sun.jpg'
import defaults from '../defaults.json'
import {
  createBookId,
  readStoredBooks,
  writeStoredBooks,
} from '../data/books'
import type { Book } from '../data/books'
import './LibraryPage.css'

const virtueToGlyph: Record<string, string> = {
  Courage: sunGlyph,
  Growth: sproutGlyph,
  Awakening: moonGlyph,
  Rebirth: birdGlyph,
  Trials: sunGlyph,
}

type LibraryPageProps = {
  onOpenStoryBeats: (bookId: string) => void
}

type DefaultsConfig = {
  virtues: string[]
  books: Book[]
}

const { virtues, books: defaultBooks } = defaults as DefaultsConfig

function LibraryPage({ onOpenStoryBeats }: LibraryPageProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [isPromptOpen, setIsPromptOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedVirtue, setSelectedVirtue] = useState(virtues[0] ?? '')
  const volumeCounts = books.reduce<Record<string, number>>((acc, book) => {
    acc[book.title] = (acc[book.title] ?? 0) + 1
    return acc
  }, {})

  useEffect(() => {
    const stored = readStoredBooks()
    if (stored.length > 0) {
      setBooks(stored)
      return
    }

    const seeded = [...defaultBooks]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
    writeStoredBooks(seeded)
    setBooks(seeded)
  }, [])

  const addBook = (virtue: string) => {
    const next: Book[] = [
      {
        id: createBookId(),
        title: virtue,
        beats: [],
      },
      ...books,
    ]
    setBooks(next)
    writeStoredBooks(next)
  }

  const openPrompt = () => {
    setSelectedVirtue(virtues[0] ?? '')
    setIsPromptOpen(true)
  }

  const closePrompt = () => {
    setIsPromptOpen(false)
  }

  const handleAdd = () => {
    if (!selectedVirtue) {
      setIsPromptOpen(false)
      return
    }

    addBook(selectedVirtue)
    setIsPromptOpen(false)
    setIsEditMode(false)
  }

  const toggleEditMode = () => {
    setIsEditMode((current) => !current)
  }

  const cancelEditMode = () => {
    setIsEditMode(false)
  }

  const handleDeleteBook = (bookId: string) => {
    const next = books.filter((book) => book.id !== bookId)
    setBooks(next)
    writeStoredBooks(next)
    if (next.length === 0) {
      setIsEditMode(false)
    }
  }

  return (
    <div className="app">
      <header className="site-header">
        <nav className="navbar">
          <a className="navbar__brand" href="/" aria-label="The Story Within">
            <img src={logo} alt="The Story Within logo" />
          </a>
          <div className="navbar__links">
            <a className="navbar__link" href="/">
              Home
            </a>
            <button
              className="navbar__link navbar__link--dropdown"
              type="button"
              onClick={() => {
                if (books[0]) {
                  onOpenStoryBeats(books[0].id)
                }
              }}
            >
              Chapters
              <span className="navbar__caret" aria-hidden="true">
                ▾
              </span>
            </button>
          </div>
        </nav>
      </header>
      <main className="page">
        <section className="bookshelf" aria-label="Bookshelf">
          <div className="bookshelf__slot bookshelf__slot--add">
            {!isEditMode && (
              <button
                className="bookshelf__edit-toggle"
                type="button"
                onClick={toggleEditMode}
                aria-label="Enter edit mode"
              >
                ◎
              </button>
            )}
            {isEditMode && (
              <>
                <button
                  className="bookshelf__add-button"
                  type="button"
                  onClick={openPrompt}
                  aria-label="Add a new book"
                >
                  +
                </button>
                <button
                  className="bookshelf__cancel-edit"
                  type="button"
                  onClick={cancelEditMode}
                  aria-label="Exit edit mode"
                >
                  ×
                </button>
              </>
            )}
          </div>
          {books.map((book) => (
            <button
              className="bookshelf__slot bookshelf__slot--book"
              key={book.id}
              type="button"
              onClick={() => onOpenStoryBeats(book.id)}
              aria-label={`Open ${book.title}`}
            >
              {isEditMode && (
                <button
                  className="bookshelf__delete"
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    handleDeleteBook(book.id)
                  }}
                  aria-label={`Delete ${book.title}`}
                >
                  ×
                </button>
              )}
              <div className="bookshelf__text-block">
                <span className="bookshelf__label-small">A story of</span>
                <span className="bookshelf__label-title story-title">
                  {book.title}
                </span>
              </div>
              <img
                className="bookshelf__glyph"
                src={virtueToGlyph[book.title]}
                alt={`${book.title} glyph`}
              />
              <span className="bookshelf__volume">
                Vol {volumeCounts[book.title]}
              </span>
            </button>
          ))}
        </section>
        {isPromptOpen && (
          <div className="bookshelf__prompt" role="dialog" aria-modal="true">
            <div className="bookshelf__prompt-card">
              <h2>Add a virtue</h2>
              <label className="bookshelf__prompt-field">
                Choose a title
                <select
                  value={selectedVirtue}
                  onChange={(event) => setSelectedVirtue(event.target.value)}
                >
                  {virtues.map((virtue) => (
                    <option value={virtue} key={virtue}>
                      {virtue}
                    </option>
                  ))}
                </select>
              </label>
              <div className="bookshelf__prompt-actions">
                <button type="button" onClick={closePrompt}>
                  Cancel
                </button>
                <button type="button" onClick={handleAdd}>
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default LibraryPage
