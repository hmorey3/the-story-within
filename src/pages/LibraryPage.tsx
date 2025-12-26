import { useEffect, useMemo, useState } from 'react'
import logo from '../assets/logo.jpg'
import defaults from '../defaults.json'
import {
  createBookId,
  readStoredBooks,
  writeStoredBooks,
} from '../data/books'
import type { Book } from '../data/books'
import './LibraryPage.css'

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
  const [selectedVirtue, setSelectedVirtue] = useState(virtues[0] ?? '')

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

  const availableVirtues = useMemo(() => {
    return virtues.filter((virtue) => !books.some((book) => book.title === virtue))
  }, [books])

  const openPrompt = () => {
    if (availableVirtues.length === 0) {
      return
    }

    const defaultValue = availableVirtues[0] ?? virtues[0]
    setSelectedVirtue(defaultValue)
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
          <button
            className="bookshelf__slot bookshelf__slot--add"
            type="button"
            onClick={openPrompt}
            disabled={availableVirtues.length === 0}
            aria-label="Add a new book"
          >
            <span className="bookshelf__add-plus" aria-hidden="true">
              +
            </span>
          </button>
          {books.map((book) => (
            <button
              className="bookshelf__slot bookshelf__slot--book"
              key={book.id}
              type="button"
              onClick={() => onOpenStoryBeats(book.id)}
              aria-label={`Open ${book.title}`}
            >
              <span className="bookshelf__label-small">A story of</span>
              <span className="bookshelf__label-title">{book.title}</span>
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
                  {availableVirtues.length === 0 ? (
                    <option value={selectedVirtue}>{selectedVirtue}</option>
                  ) : (
                    availableVirtues.map((virtue) => (
                      <option value={virtue} key={virtue}>
                        {virtue}
                      </option>
                    ))
                  )}
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
