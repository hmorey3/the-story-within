import Header from '../components/Header'

type AboutPageProps = {
  onHome: () => void
  onCreateStory: () => void
}

function AboutPage({ onHome, onCreateStory }: AboutPageProps) {
  return (
    <div className="app">
      <Header onHome={onHome} onCreateStory={onCreateStory} onAbout={() => {}} />
      <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#7a6f63', letterSpacing: '0.05em' }}>
          Coming soon.
        </p>
      </main>
    </div>
  )
}

export default AboutPage
