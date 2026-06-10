import { useState, useEffect } from 'react';
import './Navbar.css';

const LINKS = ['About', 'Skills', 'Work', 'Contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setOpen(false);
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <a className="nav__logo" href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
        &lt;DynamaxD /&gt;
      </a>

      {/* Desktop links */}
      <ul className="nav__links">
        {LINKS.map(l => (

                <li key={l}>
          <button
            className="nav__link"
            onClick={() => {
              if (l === 'About') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                scrollTo(l);
              }
            }}
          >
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
            onClick={() => {
              if (l === 'About') {
                setOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                scrollTo(l);
              }
            }}
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
