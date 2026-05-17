import { useEffect, useState } from 'react'
import './Meteors.css'

type MeteorStyle = {
  top: number
  left: string
  animationDelay: string
  animationDuration: string
}

export function Meteors({ number = 18 }: { number?: number }) {
  const [styles, setStyles] = useState<MeteorStyle[]>([])

  useEffect(() => {
    setStyles(
      Array.from({ length: number }, () => ({
        top: -5,
        left: `${Math.floor(Math.random() * window.innerWidth)}px`,
        animationDelay: `${(Math.random() * 4).toFixed(2)}s`,
        animationDuration: `${(Math.random() * 6 + 4).toFixed(2)}s`,
      }))
    )
  }, [number])

  return (
    <>
      {styles.map((style, i) => (
        <span key={i} className="meteor" style={style}>
          <span className="meteor__tail" />
        </span>
      ))}
    </>
  )
}
