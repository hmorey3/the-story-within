import { useMemo, useState } from 'react';
import './TriangleBeatPager.css';
import type { StoryBeat } from '../types/story';

interface TriangleBeatPagerProps {
  beats: StoryBeat[];
  renderBeat: (beat: StoryBeat) => React.ReactNode;
}

const PAGE_SIZE = 3;

export function TriangleBeatPager({ beats, renderBeat }: TriangleBeatPagerProps) {
  const pageCount = Math.max(1, Math.ceil(beats.length / PAGE_SIZE));
  const [pageIndex, setPageIndex] = useState(0);

  const pageBeats = useMemo(() => {
    const start = pageIndex * PAGE_SIZE;
    return beats.slice(start, start + PAGE_SIZE);
  }, [beats, pageIndex]);

  const setNext = () => setPageIndex((i) => Math.min(i + 1, pageCount - 1));
  const setPrev = () => setPageIndex((i) => Math.max(i - 1, 0));

  return (
    <div className="triangle-pager">
      <button
        type="button"
        className="triangle-pager__arrow triangle-pager__arrow--up"
        onClick={setPrev}
        disabled={pageIndex === 0}
        aria-label="Previous beats"
      >
        ↑
      </button>

      <div className="triangle-pager__grid">
        {pageBeats.map((beat, index) => {
          const total = pageBeats.length;
          const positionClass = getPositionClass(index, total);
          return (
            <div key={beat.id} className={`triangle-pager__cell ${positionClass}`}>
              {renderBeat(beat)}
            </div>
          );
        })}
      </div>

      <div className="triangle-pager__footer">
        <button
          type="button"
          className="triangle-pager__arrow triangle-pager__arrow--down"
          onClick={setNext}
          disabled={pageIndex >= pageCount - 1}
          aria-label="Next beats"
        >
          ↓
        </button>
        <span className="triangle-pager__page">
          {pageIndex + 1} / {pageCount}
        </span>
      </div>
    </div>
  );
}

function getPositionClass(index: number, total: number) {
  if (total === 1) return 'triangle-pos-center';
  if (total === 2) return index === 0 ? 'triangle-pos-left' : 'triangle-pos-right';
  return ['triangle-pos-top', 'triangle-pos-left', 'triangle-pos-right'][index] ?? 'triangle-pos-center';
}
