import { useEffect, useState } from 'react'
import Header from '../components/Header'
import { virtueGlyphs } from '../data/storyCatalog'
import type { TitleOption } from '../data/storyCatalog'
import { readStoredBooks, writeStoredBooks } from '../data/books'
import type { Book } from '../data/books'
import './LibraryPage.css'

type LibraryPageProps = {
  onOpenStoryBeats: (bookId: string) => void
  onOpenChatbot: () => void
  onOpenAbout: () => void
}

function LibraryPage({ onOpenStoryBeats, onOpenChatbot, onOpenAbout }: LibraryPageProps) {
  const [books, setBooks] = useState<Book[]>([])

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
    // No stories yet — open the chatbot automatically
    onOpenChatbot()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const deleteBook = (bookId: string) => {
    const next = books.filter((book) => book.id !== bookId)
    setBooks(next)
    writeStoredBooks(next)
    setConfirmDeleteId(null)
  }

  return (
    <div className="app">
      <Header onCreateStory={onOpenChatbot} onHome={() => {}} onAbout={onOpenAbout} />
      <main className="page">
        <section className="bookshelf" aria-label="Bookshelf">
          <div className="bookshelf__slot bookshelf__slot--new">
            <button
              className="bookshelf__new-button"
              type="button"
              onClick={onOpenChatbot}
              aria-label="Create a new story"
            >
              <span className="bookshelf__new-icon">+</span>
            </button>
          </div>

          {books.map((book) => (
            <div
              className="bookshelf__slot bookshelf__slot--book"
              key={book.id}
            >
              <button
                className="bookshelf__delete"
                type="button"
                onClick={() => setConfirmDeleteId(book.id)}
                aria-label={`Delete ${book.title}`}
              >
                ×
              </button>
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
      </main>

      {confirmDeleteId && (
        <div className="bookshelf__confirm-overlay" onClick={() => setConfirmDeleteId(null)}>
          <div className="bookshelf__confirm-card" onClick={(e) => e.stopPropagation()}>
            <p className="bookshelf__confirm-text">Delete this story? This cannot be undone.</p>
            <div className="bookshelf__confirm-actions">
              <button
                className="bookshelf__confirm-cancel"
                type="button"
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="bookshelf__confirm-delete"
                type="button"
                onClick={() => deleteBook(confirmDeleteId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LibraryPage
