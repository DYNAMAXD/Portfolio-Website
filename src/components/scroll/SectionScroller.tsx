import { createContext, useContext, useEffect, useRef, useState ,type ReactNode } from 'react';

import './SectionScroller.css';

type SectionContextValue = {
  activeIndex: number;
  isSettled: boolean;
};

const SectionContext = createContext<SectionContextValue>({
  activeIndex: 0,
  isSettled: true,
});

/**
 * Returns true only when `index` is the active section AND the
 * 0.4s settle delay has passed. Use this inside heavy
 * Three.js components to start/stop their animation loop.
 */
export function useSectionActive(index: number) {
  const { activeIndex, isSettled } = useContext(SectionContext);
  return activeIndex === index && isSettled;
}

const SETTLE_DELAY = 400; // ms

type SectionDef = {
  id: string;
  element: ReactNode;
};

export default function SectionScroller({ sections }: { sections: SectionDef[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isSettled, setIsSettled] = useState(true);
  const isFirstRun = useRef(true);

  // Track which section is currently in view
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            setActiveIndex((prev) => (prev !== idx ? idx : prev));
          }
        });
      },
      { root: container, threshold: [0.6] }
    );

    sectionRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, [sections.length]);

  // 0.4s delay before "settled" — gives the snap animation time to finish
  // before the new section's heavy animation kicks in.

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return; // skip on initial mount, Hero should animate immediately
    }

    // Hero (index 0) always animates immediately — no settle delay,
    // whether you're scrolling down into it or back up to it.
    if (activeIndex === 0) {
      setIsSettled(true);
      return;
    }

    setIsSettled(false);
    const t = setTimeout(() => setIsSettled(true), SETTLE_DELAY);
    return () => clearTimeout(t);
  }, [activeIndex]);


  const goTo = (idx: number) => {
    const clamped = Math.max(0, Math.min(sections.length - 1, idx));
    sectionRefs.current[clamped]?.scrollIntoView({ behavior: 'smooth' });
  };

  // Arrow-key / page-key navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        goTo(activeIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goTo(activeIndex - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex, sections.length]);

  return (
    <SectionContext.Provider value={{ activeIndex, isSettled }}>
      <div className="snap-container" ref={containerRef}>
        {sections.map((sec, i) => (
          <div
            key={sec.id}
            id={`section-${sec.id}`}
            className="snap-section"
            data-index={i}
            ref={(el) => { sectionRefs.current[i] = el; }}
          >
            {sec.element}
          </div>
        ))}
      </div>

      <nav className="section-nav" aria-label="Section navigation">
        <button
          className="section-nav__btn"
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Previous section"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>

        <div className="section-nav__dots">
          {sections.map((sec, i) => (
            <button
              key={sec.id}
              className={`section-nav__dot ${i === activeIndex ? 'section-nav__dot--active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to ${sec.id}`}
            />
          ))}
        </div>

        <button
          className="section-nav__btn"
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex === sections.length - 1}
          aria-label="Next section"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </nav>
    </SectionContext.Provider>
  );
}