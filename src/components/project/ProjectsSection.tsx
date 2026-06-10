import { useState } from 'react';
import './ProjectsSection.css'; 
const PROJECTS = [
  {
    title: 'Text To Speech: Tacotron2 ',
    skills: ['Torch', 'Log Mel Spectrogram', 'Neural Vocoder'],
    month: 'JAN', year: '25',
    link: 'https://github.com/spsaswat/3d_hyperspec_ai',
    front: 'Development of a Text to Speech model --> get things on  readme file .',
    back: '--> do this <-- ',
    progress_text: 'Currently Ongoing',
    progress_percent: '10%',
    
  },
  {
    title: 'PhenoFusion 3D',
    skills: ['Python', 'HyperSpectral Imaging', 'PyQt5' , "austrailian national university"],
    month: 'JAN', year: '25',
    link: 'https://github.com/spsaswat/3d_hyperspec_ai',
    front: 'PhenoFusion 3D is an integrated 3D–hyperspectral analytics tool that extracts structural and spectral traits from plant scans.',
    back: 'We are a team of 4 from VIT and we have collaborated with Austrailian National University , under guidance of Syed Ibrahim S P sir ',
    progress_text: 'Currently Ongoing',
    progress_percent: '72%',
    
  },
  {
    title: 'ExplainabilityOnBrainTumorDataset',
    skills: ['Python', 'TensorFlow','ResNet50', 'GradCam'],
    month: 'APR', year: '26',
    link: 'https://github.com/DYNAMAXD/ExplainabilityOnBrainTumorDataset',
    front: 'A Deep Learning project focused on detecting brain tumors from MRI scans and improving model transparency using Explainable AI techniques like Grad-CAM ',
    back: 'We had build this project for our Explainable AI course , was supposed to be on a ipynb file ,but then i deployed the model on hugging face , website on vercel :p.',
    progress_text: 'Completed',
    progress_percent: '100%',
  },
  {
    title: 'AI-Powered Crop Recommendation System',
    skills: ['XGBoost', 'Google Firebase' , 'React'],
    month: 'SEP', year: '25',
    link: 'https://github.com/BeeBasic/AI-Crop-Planner',
    front: 'Built a  personalized crop recommendations on the current soil, weather, and real-time market data, for profitability and resource efficiency.',
    back: 'sujal bhai bata do isme kya likhu',
    progress_text: 'Completed',
    progress_percent: '100%',
  },   
  {
    title: 'Food for Everyone',
    skills: ['Torch', ' FastAPI', 'SDG'],
    month: 'OCT', year: '25',
    link: 'https://github.com/BeeBasic/food_for_everyone',
    front: 'A hackathon project dedicated to fighting food waste. Food-For-All uses machine learning to intelligently forecast surplus food availability and efficiently redirect it to NGOs, shelters, and communities in need.',
    back: 'We had picked the second goal "Zero Hunger" as a part of Sustainable Development Goals given by UN , We had went for a more Grounded Approach to this problem as we tried to be the bridge between the food surplus and food demands in a city.',
    progress_text: 'Completed',
    progress_percent: '100%',
  },   
];

/* ── Animated link button ─────────────────────────────────── */
function ProjectLink({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="pc__link"
      onClick={e => e.stopPropagation()} /* prevent card flip on click */
    >
      <span className="pc__link-text">View Project</span>
      <span className="pc__link-icon" aria-hidden="true">
        {/* Arrow SVG */}
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 8h10M9 4l4 4-4 4"/>
        </svg>
      </span>
      {/* animated underline + glow line */}
      <span className="pc__link-bar" />
    </a>
  );
}

/* ── Card ─────────────────────────────────────────────────── */
function ProjectCard({ project }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className={`pc-wrapper${flipped ? ' pc-wrapper--flipped' : ''}`}>
      <div className="pc">

        {/* FRONT */}
        <div className="pc__face pc__face--front">
          <div className="pc__card">

            <div className="pc__date-box">
              <span className="pc__month">{project.month}</span>
              <span className="pc__year">{project.year}</span>
            </div>
            <div className="pc__content-box">

              
              <div className="pc__progress-wrap">

              <div className="pc__progress-header">
                <span className="pc__progress-label">
                {project.progress_text}
              </span>

              <span className="pc__progress-percent">
                {project.progress_percent}
              </span>
              </div>
              <div className="pc__xpbar">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={
                     i < Math.floor(parseInt(project.progress_percent) / 10)
                        ? 'pc__xpbox pc__xpbox--active'
                        : 'pc__xpbox'
                    }
                  />
                ))}
              </div>
            </div>
                
              <span className="pc__title">  {project.title}  </span>

              <p className="pc__desc">{project.front}</p>
              <div className="pc__skills">
                {project.skills.map(s => <span key={s} className="pc__tag">{s}</span>)}
              </div>
              {project.link && <ProjectLink href={project.link} />}
            </div> 

          <span className="pc__more-label">
            MORE
          </span>
          </div>
          <button
          className="pc__flip-btn"
          onClick={() => setFlipped(true)}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 0 L24 0 L24 24 Z"/>
          </svg>
        </button>
        </div>

        {/* BACK */}
        <div className="pc__face pc__face--back">
          <div className="pc__back-inner">
            <span className="pc__back-label">Behind the build</span>
            <h3 className="pc__back-title">{project.title}</h3>
            <p className="pc__back-text">{project.back}</p>
            {project.link && <ProjectLink href={project.link} />}
          </div>
          <button
            className="pc__flip-btn pc__flip-btn--back"
            onClick={() => setFlipped(false)}
            title="Flip back"
          >
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 0 L24 0 L24 24 Z"/></svg>
          </button>
        </div>

      </div>
    </div>
  );
}

/* ── Section ──────────────────────────────────────────────── */
export default function ProjectsSection() {
  return (
    <section id="work" className="projects">
      <div className="projects__header">
        <span className="projects__eyebrow">Selected Work</span>
        <h2 className="projects__title">Projects I'm <em>working on</em></h2>
      </div>
      <div className="projects__grid">
        {PROJECTS.map(p => <ProjectCard key={p.title} project={p} />)}
      </div>
    </section>
  );
}
