import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../ds/tokens.css';
import './SubEvents.css';
import './EcosystemLanding.css';
import Button from '../ds/Button';
import Chip from '../ds/Chip';

const ventures = [
  {
    title: 'WHAM!',
    domain: 'wham.cosq.in',
    tag: 'OTT Platform',
    description: 'Hybrid playback, comic-paneled immersive "Living Comic Book" design.',
  },
  {
    title: 'PreviouslyOn',
    domain: 'previouslyon.cosq.in',
    tag: 'Letterboxd for TV',
    description: 'Social TV tracking, real-time feeds, and AI recommendations.',
  },
  // Research & IT (research.cosq.in, "Innovation Wing") is hidden for now.
  {
    title: 'CosQ Labs',
    domain: 'labs.cosq.in',
    tag: 'Creative & Talent',
    description: 'Digital Labs (Graphics) & Creators Labs (Talent Agency).',
  },
];

const team = [
  { name: 'Snehasis Ghosh', role: 'CEO · Chief Executive Officer', description: 'Visionary leadership driving the CosQ ecosystem forward.' },
  { name: 'Harshit Agarwal', role: 'CTO · Chief Technology Officer', description: 'Architecting the technological infrastructure of our future.' },
  { name: 'Soham Patel', role: 'CMO · Chief Marketing Officer', description: 'Crafting the narrative and connecting with our community.' },
  { name: 'Randeep Singh', role: 'CDO · Chief Design Officer', description: 'Shaping the visual identity and user experience.' },
  { name: 'Pritam Das', role: 'Chief Content Head', description: '' },
];

const VOLUNTEER_FORM = 'https://forms.gle/eSjE4LS8Czn3pvay6';

const EcosystemLanding = () => {
  const [showNote, setShowNote] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Smooth scrolling for the in-page nav anchors, only while this page is mounted.
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = 'smooth';
    return () => { html.style.scrollBehavior = prev; };
  }, []);

  return (
    <div className="cosq-ds home">
      {/* NAV */}
      <nav className="home-nav">
        <a href="#top" className="subevents-brand">
          <img src="/icon.png" alt="CosQ" />
          <span>COSQ</span>
        </a>
        {/* Only shown on phones, where the links collapse into a menu */}
        <button
          type="button"
          className="home-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="home-links"
          onClick={() => setMenuOpen(o => !o)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
        <div id="home-links" className={`home-links${menuOpen ? ' is-open' : ''}`} onClick={() => setMenuOpen(false)}>
          <a href="#event">Event</a>
          <Link to="/sub-events">Sub-events</Link>
          <a href="#ecosystem">Ecosystem</a>
          <a href="#team">Team</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* HERO / EVENT */}
      <section id="event" className="home-hero">
        <picture>
          <source media="(max-width:767px)" srcSet="/mobile-background.png" />
          <img src="/desktop-background.png" alt="" className="home-hero-bg" />
        </picture>
        <picture>
          <source media="(max-width:767px)" srcSet="/mobile-front.png" />
          <img src="/desktop-front.png" alt="" className="home-hero-front" />
        </picture>
        <div className="home-hero-inner">
          <div className="home-hero-top">
            <Chip color="var(--cosq-purple)">The CosQ Event</Chip>
            <h1>Odisha's First Open Ground Pop Culture Event</h1>
          </div>
          <div className="home-hero-bottom">
            <div className="home-when">
              <span className="home-when-date">Soon!!</span>
              <span className="home-when-place">Bhubaneswar, Odisha</span>
            </div>
            <div className="home-hero-ctas">
              <Button variant="alt" onClick={() => setShowNote(true)}>Prebooking Open Soon</Button>
              <Button href={VOLUNTEER_FORM}>Volunteers Join Us</Button>
            </div>
          </div>
          {showNote && (
            <div className="home-note">Prebooking opens soon. Follow @the.cosq for updates.</div>
          )}
        </div>
      </section>

      {/* SUB-EVENTS TEASER */}
      <section id="sub-events" className="home-teaser">
        <div>
          <h2 className="home-h2">Sub-events</h2>
          <p>Thirteen stages, one ground. Follow the thread from 01 to 13.</p>
        </div>
        <Button to="/sub-events">Follow the thread &rarr;</Button>
      </section>

      {/* ECOSYSTEM */}
      <section id="ecosystem" className="home-ecosystem">
        <div className="home-wrap">
          <h2 className="home-h2 on-color">The CosQ Ecosystem</h2>
          <p className="home-ecosystem-lead">
            A collection of ventures, projects, and personal passions. Everything under cosq.in, in one place.
          </p>
          <div className="home-ventures">
            {ventures.map(v => (
              <a key={v.domain} href={`https://${v.domain}`} className="venture">
                <span className="venture-tag">{v.tag}</span>
                <h3>{v.title}</h3>
                <span className="venture-domain">{v.domain}</span>
                <p>{v.description}</p>
                <span className="venture-visit">Visit &rarr;</span>
              </a>
            ))}
          </div>
          <div className="home-brands">
            <a href="https://kurukuru.cosq.in" className="kurukuru">
              <div className="kurukuru-cloud a" />
              <div className="kurukuru-cloud b" />
              <span className="kurukuru-pill gold">for kiit students only</span>
              <h3>kurukuru</h3>
              <span className="kurukuru-pill cream">RIDE. EXPLORE. CLAIM.</span>
              <p>the hyper-local peer-to-peer campus mobility engine. join the exclusive .edu walled garden.</p>
              <span className="kurukuru-cta">join the vanguard &rarr;</span>
            </a>
            <a href="https://teantab.cosq.in" className="teantab">
              <div className="teantab-head">
                <div className="teantab-title">
                  <span>tea &amp; tab</span>
                  <span>0 flags so far</span>
                </div>
                <div className="teantab-mark">t</div>
              </div>
              <div className="teantab-search">check a client by name or phone number</div>
              <div className="teantab-row">
                <span>the tea</span>
                <span className="teantab-tabs">
                  <span className="on">hot</span>
                  <span>new</span>
                  <span>top</span>
                </span>
              </div>
              <div className="teantab-cta">flag a client</div>
            </a>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="home-team">
        <h2 className="home-h2">The Minds Behind CosQ</h2>
        <p className="home-team-lead">Meet the team building the future of digital experiences.</p>
        <div className="home-team-grid">
          {team.map(m => (
            <div key={m.name} className="member">
              <div className="member-initial">{m.name[0]}</div>
              <h3>{m.name}</h3>
              <div className="member-role">{m.role}</div>
              <p>{m.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <footer id="contact" className="home-contact">
        <div className="home-contact-row">
          <div>
            <h2 className="home-h2 on-color">Contact us</h2>
            <p>If you have any questions, feel free to reach out.</p>
          </div>
          <div className="home-contact-ctas">
            <Button variant="alt" href="mailto:info@cosq.in">info@cosq.in</Button>
            <Button href="https://instagram.com/the.cosq">@the.cosq</Button>
          </div>
        </div>
        <div className="home-copy">&copy; 2026 CosQ. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default EcosystemLanding;
