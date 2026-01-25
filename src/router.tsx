import { useEffect, useState } from 'react'
import LibraryPage from './pages/LibraryPage'
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
      <>
        <StoryBeatsCarousel
          bookId={storyBeatId}
          onClose={() => navigate('/')}
        />
        <ChatbotWidget
          onOpenStoryBeats={(bookId) =>
            navigate(`/story-beats/${encodeURIComponent(bookId)}`)
          }
        />
      </>
    )
  }

  return (
    <>
      <LibraryPage
        onOpenStoryBeats={(bookId) =>
          navigate(`/story-beats/${encodeURIComponent(bookId)}`)
        }
      />
      <ChatbotWidget
        onOpenStoryBeats={(bookId) =>
          navigate(`/story-beats/${encodeURIComponent(bookId)}`)
        }
      />
    </>
  )
}

export default AppRouter
