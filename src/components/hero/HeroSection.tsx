import FractalBackground from './FractalBackground';
import './HeroSection.css';

export default function HeroSection() {
  return (
    <section className="hero">

      {/* ── Background ── */}
      <div className="hero__canvas">
        <FractalBackground />
      </div>

      {/* ── Vignette ── */}
      <div className="hero__vignette" />

      {/* ── Compact Portfolio Card (TOP LEFT) ── */}
      <div className="hero__card">

        <h1 className="hero__title">
          Hi,
          <br />
          I'm <em>Divyansh</em>
        </h1>

        <p className="hero__description">
          AI Developer • Researcher • Final Year Student
        </p>
        <p className="hero__bio">
          Developer focused on AI, machine learning, and immersive web experiences.
          I create projects that blend creativity, performance, and real-world problem solving.

        </p>

        {/* Socials */}
        <div className="hero__socials">

          <a
            href="mailto:dynamicdivyansh925@gmail.com"
            className="hero__icon"
          >
            ✉
          </a>

          <a
            href="https://www.linkedin.com/in/dynamaxd/"
            target="_blank"
            rel="noreferrer"
            className="hero__icon"
          >
            in
          </a>

          <a
          href="https://github.com/DYNAMAXD"
          target="_blank"
          rel="noreferrer"
          className="hero__icon"
        >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="24"
          height="24"
        >
          <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 008 10.94c.58.1.79-.25.79-.56v-2.02c-3.26.71-3.95-1.39-3.95-1.39-.53-1.34-1.3-1.7-1.3-1.7-1.06-.73.08-.72.08-.72 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.72 1.27 3.39.97.1-.75.41-1.27.74-1.56-2.6-.3-5.34-1.3-5.34-5.8 0-1.28.46-2.33 1.2-3.15-.12-.3-.52-1.52.12-3.17 0 0 .98-.31 3.2 1.2a11.1 11.1 0 015.82 0c2.22-1.51 3.2-1.2 3.2-1.2.64 1.65.24 2.87.12 3.17.75.82 1.2 1.87 1.2 3.15 0 4.51-2.74 5.5-5.35 5.79.42.36.79 1.08.79 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
        </svg>
        </a>

        <a
            href="https://leetcode.com/u/DYNAMAX_D/"
            target="_blank"
            rel="noreferrer"
            className="hero__icon"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png"
              alt="LeetCode"
            />
          </a>
          <a
            href="https://www.codechef.com/users/dynamax_d"
            target="_blank"
            rel="noreferrer"
            className="hero__icon"
          >
            <img
              src="https://cdn.codechef.com/images/cc-logo.svg"
              alt="CodeChef"
            />
          </a>

                  </div>
                </div>


    </section>
  );
}