import logo from '../assets/logo.jpg'
import './Header.css'

type HeaderProps = {
  onChaptersClick?: () => void
}

function Header({ onChaptersClick }: HeaderProps) {
  return (
    <header className="site-header">
      <nav className="navbar">
        <a className="navbar__brand" href="/" aria-label="The Story Within">
          <img src={logo} alt="The Story Within logo" />
        </a>
        <div className="navbar__links">
          <a className="navbar__link" href="/">
            Home
          </a>
          {onChaptersClick && (
            <button
              className="navbar__link navbar__link--dropdown"
              type="button"
              onClick={onChaptersClick}
            >
              Chapters
              <span className="navbar__caret" aria-hidden="true">
                ▾
              </span>
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
