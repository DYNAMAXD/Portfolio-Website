import { useState, useEffect } from 'react';
import './Navbar.css';

const LINKS = ['About', 'Skills', 'Work', 'Contact'];

// Maps nav labels to the section ids used in SectionScroller
const SECTION_IDS: Record<string, string> = {
  About: 'hero',
  Skills: 'skills',
  Work: 'work',
  Contact: 'contact',
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    // The page no longer scrolls on <body> — .snap-container does.
    const container = document.querySelector('.snap-container');
    if (!container) return;

    const onScroll = () => setScrolled(container.scrollTop > 40);
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (label: string) => {
    setOpen(false);
    const id = SECTION_IDS[label];
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <a className="nav__logo" href="#" onClick={e => { e.preventDefault(); scrollTo('About'); }}>
        &lt;DynamaxD /&gt;
      </a>

      {/* Desktop links */}
      <ul className="nav__links">
        {LINKS.map(l => (
          <li key={l}>
            <button className="nav__link" onClick={() => scrollTo(l)}>
              {l}
            </button>
          </li>
        ))}
      </ul>

      {/* Mobile hamburger */}
      <button className={`nav__burger ${open ? 'nav__burger--open' : ''}`}
        onClick={() => setOpen(o => !o)} aria-label="Menu">
        <span /><span /><span />
      </button>

      {/* Mobile drawer */}
      <div className={`nav__drawer ${open ? 'nav__drawer--open' : ''}`}>
        {LINKS.map(l => (
          <button
            key={l}
            className="nav__drawer-link"
            onClick={() => scrollTo(l)}
          >
            {l}
          </button>
        ))}

        <a className="nav__cta nav__cta--drawer" href="mailto:dynamicdivyansh925@gmail.com">
          Hire me
        </a>
      </div>
    </nav>
  );
}