import './Header.css'

type HeaderProps = {
  onCreateStory?: () => void
  onAbout?: () => void
  onHome?: () => void
}

function Header({ onCreateStory, onAbout, onHome }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="h3-inner">
        <button className="h3-title" onClick={onHome} type="button">
          <svg width="26" height="18" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M13 4 C10 2, 4 2, 1 3.5 L1 15.5 C4 14, 10 14, 13 16" stroke="currentColor" strokeWidth="0.75" strokeLinejoin="round" strokeLinecap="round"/>
            <path d="M13 4 C16 2, 22 2, 25 3.5 L25 15.5 C22 14, 16 14, 13 16" stroke="currentColor" strokeWidth="0.75" strokeLinejoin="round" strokeLinecap="round"/>
            <path d="M13 4 C12.2 6, 12.2 12, 13 16" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round"/>
            <path d="M1 3.5 C4 2.2, 10 2, 13 3.8" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" opacity="0.5"/>
            <path d="M25 3.5 C22 2.2, 16 2, 13 3.8" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" opacity="0.5"/>
          </svg>
          The Story Within
        </button>
        <nav className="h3-nav">
          <button className="h3-nav-link" type="button" onClick={onHome}>Home</button>
          <button className="h3-nav-link" type="button" onClick={onAbout}>About</button>
          <button className="h3-nav-cta" type="button" onClick={onCreateStory}>Create Story</button>
        </nav>
      </div>
    </header>
  )
}

export default Header
