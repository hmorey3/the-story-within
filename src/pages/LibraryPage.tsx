import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Modal from '../components/Modal'
import defaults from '../defaults.json'
import { titleOptions, virtueGlyphs, type DefaultsConfig } from '../data/storyCatalog'
import type { TitleOption } from '../data/storyCatalog'
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

const { books: defaultBooks } = defaults as DefaultsConfig

function LibraryPage({ onOpenStoryBeats }: LibraryPageProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [isPromptOpen, setIsPromptOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedVirtue, setSelectedVirtue] = useState<TitleOption>(titleOptions[0])

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
    const newBook: Book = {
      id: createBookId(),
      title: virtue,
      beats: [],
    }
    const next = [newBook, ...books]
    setBooks(next)
    writeStoredBooks(next)
  }

  const deleteBook = (bookId: string) => {
    const next = books.filter((book) => book.id !== bookId)
    setBooks(next)
    writeStoredBooks(next)
    if (next.length === 0) {
      setIsEditMode(false)
    }
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

  const openPrompt = () => {
    setSelectedVirtue(titleOptions[0])
    setIsPromptOpen(true)
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
                  onClick={openPrompt}
                  aria-label="Add a new book"
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

          {books.map((book) => (
            <div
              className="bookshelf__slot bookshelf__slot--book"
              key={book.id}
            >
              {isEditMode && (
                <button
                  className="bookshelf__delete"
                  type="button"
                  onClick={() => deleteBook(book.id)}
                  aria-label={`Delete ${book.title}`}
                >
                  ×
                </button>
              )}
              <button
                className="bookshelf__book-button"
                type="button"
                onClick={() => onOpenStoryBeats(book.id)}
                aria-label={`Open ${book.title}`}
              >
                <div className="bookshelf__text-block">
                  <span className="bookshelf__label-small">A story of</span>
                  <span className="bookshelf__label-title story-title">
                    {book.title}
                  </span>
                </div>
                <img
                  className="bookshelf__glyph"
                  src={virtueGlyphs[book.title as TitleOption] ?? virtueGlyphs.Courage}
                  alt={`${book.title} glyph`}
                />
                <span className="bookshelf__volume">
                  Vol {volumeCounts[book.title]}
                </span>
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
                <button type="button" onClick={handleAdd}>
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
