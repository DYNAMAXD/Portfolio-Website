import { useState, useEffect } from 'react';
import './Navbar.css';

const LINKS = ['About', 'Skills', 'Work', 'Contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

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
    <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <button className="nav__logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        YN<span>.</span>
      </button>

      {/* Desktop links */}
      <ul className="nav__links">
        {LINKS.map(l => (
          <li key={l}><button onClick={() => scrollTo(l)}>{l}</button></li>
        ))}
        <li><button className="nav__cta" onClick={() => scrollTo('Contact')}>Hire me</button></li>
      </ul>

      {/* Mobile burger */}
      <button className={`nav__burger${open ? ' open' : ''}`} onClick={() => setOpen(o => !o)} aria-label="Menu">
        <span /><span /><span />
      </button>

      {/* Mobile drawer */}
      <div className={`nav__drawer${open ? ' open' : ''}`}>
        {LINKS.map(l => (
          <button key={l} onClick={() => scrollTo(l)}>{l}</button>
        ))}
        <button className="nav__cta" onClick={() => scrollTo('Contact')}>Hire me</button>
      </div>
    </nav>
  );
}
