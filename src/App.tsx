import logo from './assets/logo.jpg'
import bookSpine from './assets/book_spine.jpg'
import './App.css'

function App() {
  const books = [
    'Courage',
    'Growth',
    'Awakening',
    'Rebirth',
    'Trials',
  ]

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
            <button className="navbar__link navbar__link--dropdown" type="button">
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
          {books.map((title) => (
            <div className="bookshelf__slot" key={title}>
              <img
                src={bookSpine}
                alt="Book spine"
                className="bookshelf__book"
              />
              <div className="bookshelf__label" aria-hidden="true">
                <span className="bookshelf__label-small">A story of</span>
                <span className="bookshelf__label-title">{title}</span>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}

export default App
