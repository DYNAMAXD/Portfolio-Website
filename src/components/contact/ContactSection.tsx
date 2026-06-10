import { useState, useEffect, useRef } from 'react'; 
import './ContactSection.css';

// ── EmailJS config — fill these in ────────────────────────────────────────── 
const WEB3FORMS_ACCESS_KEY = "43c99d4f-59e2-4518-a37b-fe4f3dd32036";
const MAX_CHARS = 500;

// Transmission states
const STATUS = { IDLE: 'idle', COMPOSING: 'composing', SENDING: 'sending', SENT: 'sent', ERROR: 'error' };

export default function ContactSection() {
  const formRef = useRef(null);

  const [name,       setName]       = useState('');
  const [email,      setEmail]      = useState('');
  const [message,    setMessage]    = useState('');
  const [redacted,   setRedacted]   = useState(false);
  const [tooltipVis, setTooltipVis] = useState(false);
  const [status,     setStatus]     = useState(STATUS.IDLE);
  const [scanActive, setScanActive] = useState(false);

  // Derive transmission status from field activity
  useEffect(() => {
    if (status === STATUS.SENDING || status === STATUS.SENT || status === STATUS.ERROR) return;
    const hasContent = name.trim() || email.trim() || message.trim();
    setStatus(hasContent ? STATUS.COMPOSING : STATUS.IDLE);
  }, [name, email, message, status]);

  const charPct = Math.min(1, message.length / MAX_CHARS);

  // Gauge needle angle: -130deg (empty) → +130deg (full)
  const needleDeg = -130 + charPct * 260;

  // Gauge color: green → yellow → red
  const gaugeColor = charPct < 0.6
    ? `hsl(${160 - charPct * 120}, 70%, 50%)`
    : `hsl(${160 - charPct * 120}, 80%, 50%)`;

  async function handleSubmit(e) {
  e.preventDefault();

  if (status === STATUS.SENDING || status === STATUS.SENT) return;

  setStatus(STATUS.SENDING);
  setScanActive(true);

  const formData = {
    access_key: WEB3FORMS_ACCESS_KEY,

    name: name,

    email: redacted
      ? 'redacted@anonymous.local'
      : email,

    message: message,

    subject: `Portfolio Message from ${name}`,

    time: new Date().toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'medium',
    }),
  };

  try {
    const response = await fetch(
      'https://api.web3forms.com/submit',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      }
    );

    const result = await response.json();

    console.log(result);

    if (result.success) {

      setTimeout(() => {
        setScanActive(false);
        setStatus(STATUS.SENT);

        // optional reset
        setName('');
        setEmail('');
        setMessage('');

      }, 1400);

    } else {
      console.log(result);

      setScanActive(false);
      setStatus(STATUS.ERROR);
    }

  } catch (err) {

    console.log(err);

    setScanActive(false);
    setStatus(STATUS.ERROR);
  }
}

  const statusLabel = {
    [STATUS.IDLE]:      '— awaiting transmission —',
    [STATUS.COMPOSING]: '● signal detected',
    [STATUS.SENDING]:   '↑ transmitting…',
    [STATUS.SENT]:      '✓ signal received',
    [STATUS.ERROR]:     '✕ transmission failed',
  }[status];

  return (
    <section id="contact" className="contact">

      {/* Subtle grid background */}
      <div className="contact__grid-bg" aria-hidden="true" />

      <div className="contact__inner">

        {/* Header */}
        <div className="contact__header">
          <span className="contact__eyebrow">Contact</span>
          <h2 className="contact__title">Send a <em>transmission</em></h2>
        </div>

        {/* Status bar */}
        <div className={`contact__status contact__status--${status}`}>
          <span className="contact__status-dot" />
          <span className="contact__status-text">{statusLabel}</span>
        </div>

        {/* Form */}
        <form ref={formRef} className="contact__form" onSubmit={handleSubmit} noValidate>

          {/* Scan overlay */}
          {scanActive && <div className="contact__scan" />}

          {/* Name */}
          <div className="contact__field">
            <label className="contact__label" htmlFor="c-name">Name</label>
            <input
              id="c-name" className="contact__input" type="text"
              placeholder="Your name" value={name} required
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* Email + redact checkbox */}
          <div className="contact__field">
            <label className="contact__label" htmlFor="c-email">Email</label>
            <input
              id="c-email"
              className={`contact__input contact__input--email${redacted ? ' contact__input--redacted' : ''}`}
              type="email" placeholder="your@email.com"
              value={redacted ? '' : email}
              onChange={e => !redacted && setEmail(e.target.value)}
              required={!redacted}
              disabled={redacted}
            />
            {/* Redact row */}
            <div className="contact__redact-row">
              <label
                className="contact__redact-label"
                onMouseEnter={() => setTooltipVis(true)}
                onMouseLeave={() => setTooltipVis(false)}
              >
                <span className={`contact__checkbox${redacted ? ' contact__checkbox--checked' : ''}`}
                  onClick={() => setRedacted(r => !r)}
                  role="checkbox" aria-checked={redacted} tabIndex={0}
                  onKeyDown={e => e.key === ' ' && setRedacted(r => !r)}
                >
                  {redacted && <span className="contact__checkmark">×</span>}
                </span>
                <span className="contact__redact-text">redact sender</span>
              </label>
              <span className={`contact__tooltip${tooltipVis ? ' contact__tooltip--visible' : ''}`}>
                i understand the need of this button :&gt;
              </span>
            </div>
          </div>

          {/* Message + gauge */}
          <div className="contact__field contact__field--msg">
            <div className="contact__label-row">
              <label className="contact__label" htmlFor="c-msg">Message</label>
              <span className={`contact__char-count${charPct > 0.9 ? ' contact__char-count--warn' : ''}`}>
                {message.length}/{MAX_CHARS}
              </span>
            </div>
            <textarea
              id="c-msg" className="contact__textarea"
              placeholder="Tell me about your project…"
              value={message} maxLength={MAX_CHARS} required rows={5}
              onChange={e => setMessage(e.target.value)}
            />

            {/* Fuel gauge */}
            <div className="contact__gauge" aria-hidden="true">
              <svg viewBox="0 0 120 70" className="contact__gauge-svg">
                {/* Arc track */}
                <path d="M10 65 A55 55 0 0 1 110 65" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" strokeLinecap="round"/>
                {/* Filled arc — use dasharray trick */}
                <path d="M10 65 A55 55 0 0 1 110 65" fill="none"
                  stroke={gaugeColor}
                  strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={`${charPct * 172} 172`}
                  style={{ transition: 'stroke-dasharray 0.3s ease, stroke 0.4s ease' }}
                />
                {/* Tick marks */}
                {[0,0.25,0.5,0.75,1].map((t,i) => {
                  const a = (-130 + t * 260) * (Math.PI / 180);
                  const r1 = 48, r2 = 54, cx = 60, cy = 65;
                  return (
                    <line key={i}
                      x1={cx + r1 * Math.cos(a)} y1={cy + r1 * Math.sin(a)}
                      x2={cx + r2 * Math.cos(a)} y2={cy + r2 * Math.sin(a)}
                      stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"
                    />
                  );
                })}
                {/* Needle */}
                
                <g style={{ transform: `rotate(${needleDeg}deg)`, transformOrigin: '60px 65px', transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}>
                  <line x1="60" y1="65" x2="60" y2="22" stroke={gaugeColor} strokeWidth="1.5" strokeLinecap="round"
                    style={{ transition: 'stroke 0.4s ease' }}
                  />
                  <circle cx="60" cy="65" r="4" fill="#0d0d18" stroke={gaugeColor} strokeWidth="1.5"/>
                </g>

                {/* Labels */}
                <text x="8"  y="72" fontSize="7" fill="rgba(255,255,255,0.25)" fontFamily="Courier New">E</text>
                <text x="107" y="72" fontSize="7" fill="rgba(255,255,255,0.25)" fontFamily="Courier New">F</text>
                <text x="53" y="14" fontSize="6.5" fill="rgba(255,255,255,0.18)" fontFamily="Courier New">MSG</text>
              </svg>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`contact__submit contact__submit--${status}`}
            disabled={status === STATUS.SENDING || status === STATUS.SENT}
          >
            {status === STATUS.SENDING ? 'Transmitting…'
            : status === STATUS.SENT    ? 'Signal received ✓'
            : status === STATUS.ERROR   ? 'Retry transmission'
            : 'Send transmission'}
          </button>
        </form>

      </div>
    </section>
  );
}