import type { CSSProperties } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { coverTemplates } from '../data/storyCoverLibrary';
import './CreateStorySpine.css';

const CYCLE_INTERVAL_MS = 2000;
const FADE_DURATION_MS = 1500;

interface CreateStorySpineProps {
  onCreate: () => void;
}

export function CreateStorySpine({ onCreate }: CreateStorySpineProps) {
  const coverImages = useMemo(() => coverTemplates.map((template) => template.imageUrl), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(coverImages.length > 1 ? 1 : 0);
  const [isTransitioning, setTransitioning] = useState(false);
  const nextImageRef = useRef<string | undefined>(coverImages[1]);

  useEffect(() => {
    if (coverImages.length < 2) {
      return;
    }

    let fadeTimeout: number | undefined;
    const intervalId = window.setInterval(() => {
      setTransitioning(true);
      nextImageRef.current = coverImages[nextIndex];
      fadeTimeout = window.setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % coverImages.length);
        setNextIndex((prev) => (prev + 1) % coverImages.length);
        setTransitioning(false);
      }, FADE_DURATION_MS);
    }, CYCLE_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
      if (fadeTimeout) {
        window.clearTimeout(fadeTimeout);
      }
    };
  }, [coverImages.length, nextIndex, coverImages]);

  const hasImages = coverImages.length > 0;
  const currentCover = hasImages ? coverImages[currentIndex] : undefined;
  const nextCover = hasImages ? nextImageRef.current ?? coverImages[nextIndex] : undefined;

  return (
    <button
      type="button"
      className="book-spine book-spine--create-only"
      onClick={onCreate}
      aria-label="Create a new story"
      style={{ '--create-fade-duration': `${FADE_DURATION_MS}ms` } as CSSProperties}
    >
      {hasImages && (
        <span className="book-spine__create-layers" aria-hidden>
          <span className="book-spine__create-image book-spine__create-image--current" style={{ backgroundImage: `url(${currentCover})` }} />
          <span
            className="book-spine__create-image book-spine__create-image--next"
            data-visible={isTransitioning}
            style={{ backgroundImage: `url(${nextCover})` }}
          />
        </span>
      )}
      <span className="book-spine__create-overlay" aria-hidden />
      <span className="book-spine__icon" aria-hidden>
        +
      </span>
    </button>
  );
}
