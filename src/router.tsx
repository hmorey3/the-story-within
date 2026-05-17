import { useEffect, useState } from 'react'
import LibraryPage from './pages/LibraryPage'
import AboutPage from './pages/AboutPage'
import StoryBeatsCarousel from './pages/StoryBeatsCarousel'
import ChatbotWidget from './components/ChatbotWidget'

const getStoryBeatId = (path: string) => {
  if (!path.startsWith('/story-beats/')) {
    return null
  }

  const id = path.replace('/story-beats/', '')
  return id ? decodeURIComponent(id) : null
}

function AppRouter() {
  const [pathname, setPathname] = useState(
    window.location.pathname || '/',
  )
  const [chatbotOpen, setChatbotOpen] = useState(false)

  const navigate = (path: string) => {
    if (path === pathname) {
      return
    }

    window.history.pushState({}, '', path)
    setPathname(path)
  }

  useEffect(() => {
    const handlePopState = () =>
      setPathname(window.location.pathname || '/')
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const storyBeatId = getStoryBeatId(pathname)
  if (storyBeatId) {
    return (
      <StoryBeatsCarousel
        bookId={storyBeatId}
        onClose={() => navigate('/')}
      />
    )
  }

  if (pathname === '/about') {
    return (
      <AboutPage
        onHome={() => navigate('/')}
        onCreateStory={() => { navigate('/'); setChatbotOpen(true) }}
      />
    )
  }

  return (
    <>
      <LibraryPage
        onOpenStoryBeats={(bookId) =>
          navigate(`/story-beats/${encodeURIComponent(bookId)}`)
        }
        onOpenChatbot={() => setChatbotOpen(true)}
        onOpenAbout={() => navigate('/about')}
      />
      <ChatbotWidget
        isOpen={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
        onOpenStoryBeats={(bookId) =>
          navigate(`/story-beats/${encodeURIComponent(bookId)}`)
        }
      />
    </>
  )
}

export default AppRouter
