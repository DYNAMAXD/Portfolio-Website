import SkillsBackground from './SkillsBackground';
import './SkillsSection.css';

const DEBUG = false;

const SKILLS = [
  {
    label: 'AI / ML / DL',
    cat: 'ai',
    items: [
      'Machine Learning',
      'Deep Learning',
      'NLP',
      'PyTorch',
      'Speech Processing',
      'Computer Vision',
    ],
  },
  {
    label: 'Tools & Platforms',
    cat: 'tools',
    items: [
      'Git',
      'PuTTY',
      'VMware Workstation',
      'R Studio',
      'Arduino',
      'ESP32',
    ],
  },
  {
    label: 'Research & Interests',
    cat: 'research',
    items: [
      'Large Language Models',
      'Speech Synthesis',
      'Audio DSP',
      'Realtime Rendering',
      'Embedded AI',
    ],
  },
  {
    label: 'Currently Exploring',
    cat: 'exploring',
    items: [
      'HyperSpectral Imaging',
      'LLM Fine-Tuning',
      'Diffusion Models',
      'CUDA',
    ],
  },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="skills">
      <div className="skills__canvas">
        <SkillsBackground debugMode={DEBUG} />
      </div>

      <div className="skills__content">
        <div className="skills__header">
          <h2 className="skills__title">
            Technologies &amp; <em>Expertise</em>
          </h2>
          <p className="skills__subtitle">
            What I work with, what I&apos;m into, what I&apos;m learning
          </p>
        </div>

        <div className="skills__grid">
          {SKILLS.map(({ label, cat, items }, i) => (
            <div
              key={label}
              className={`skills__card skills__card--${cat}`}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="skills__card-header">
                <span className="skills__dot" aria-hidden="true" />
                <span className="skills__label">{label}</span>
              </div>
              <div className="skills__tags">
                {items.map(skill => (
                  <span key={skill} className="skills__tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}