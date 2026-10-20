import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../ds/tokens.css';
import './SubEvents.css';
import Button from '../ds/Button';
import Chip from '../ds/Chip';
import subEventsData from '../Events/subEventsData';

const ROW = 230;
const TOP = 150;

// Thread geometry for a journey box of width W: nodes zig-zag between 25% and 75%.
const geom = (W = 1000) => {
  const n = subEventsData.length, ys = [], xs = [];
  for (let i = 0; i < n; i++) {
    ys.push(TOP + i * ROW);
    xs.push(i % 2 ? W * 0.75 : W * 0.25);
  }
  const H = ys[n - 1] + 200;
  let d = `M ${W / 2} 0 C ${W / 2} ${TOP * 0.6} ${xs[0]} ${TOP * 0.4} ${xs[0]} ${ys[0]}`;
  for (let i = 0; i < n - 1; i++) {
    const m = (ys[i] + ys[i + 1]) / 2;
    d += ` C ${xs[i]} ${m + 40} ${xs[i + 1]} ${m - 40} ${xs[i + 1]} ${ys[i + 1]}`;
  }
  d += ` C ${xs[n - 1]} ${ys[n - 1] + 90} ${W / 2} ${H - 90} ${W / 2} ${H}`;
  return { ys, xs, H, d };
};

const SubEvents = () => {
  const [active, setActive] = useState(0);
  const boxRef = useRef(null);
  const svgRef = useRef(null);
  const trackRef = useRef(null);
  const shadowRef = useRef(null);
  const threadRef = useRef(null);
  const needleRef = useRef(null);

  useEffect(() => {
    // The thread draws down to 60% of the viewport; the needle rides its tip.
    const update = () => {
      const box = boxRef.current, p = threadRef.current;
      if (!box || !p) return;
      const r = box.getBoundingClientRect(), g = geom(r.width);
      svgRef.current.setAttribute('viewBox', `0 0 ${r.width} ${g.H}`);
      [trackRef, shadowRef, threadRef].forEach(ref => ref.current.setAttribute('d', g.d));
      const ty = Math.max(0, Math.min(g.H, window.innerHeight * 0.6 - r.top));
      const L = p.getTotalLength();
      let lo = 0, hi = L;
      for (let k = 0; k < 24; k++) {
        const mid = (lo + hi) / 2;
        if (p.getPointAtLength(mid).y < ty) lo = mid; else hi = mid;
      }
      const pt = p.getPointAtLength(lo), da = `${lo} 100000`;
      p.style.strokeDasharray = da;
      shadowRef.current.style.strokeDasharray = da;
      needleRef.current.style.transform = `translate(${pt.x}px,${pt.y}px)`;
      needleRef.current.style.opacity = ty <= 0 ? 0 : 1;
      setActive(g.ys.filter(y => y - 60 <= ty).length);
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    const t = setTimeout(update, 50);
    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const g = geom();

  return (
    <div className="cosq-ds subevents">
      <nav className="subevents-nav">
        <Link to="/" className="subevents-brand">
          <img src="/icon.png" alt="CosQ" />
          <span>COSQ</span>
        </Link>
        <Link to="/" className="subevents-back">&larr; Back to the event</Link>
      </nav>

      <header className="subevents-hero">
        <Chip color="var(--cosq-purple)">{subEventsData.length} stages · one ground</Chip>
        <h1>Sub-events</h1>
        <p>Follow the thread from 01 to {String(subEventsData.length).padStart(2, '0')}. Keep scrolling.</p>
      </header>

      <section className="subevents-section">
        <div ref={boxRef} className="journey" style={{ height: g.H }}>
          <svg ref={svgRef} viewBox={`0 0 1000 ${g.H}`}>
            <path ref={trackRef} d={g.d} fill="none" stroke="var(--cosq-pink-light)" strokeWidth="5" strokeDasharray="2 14" strokeLinecap="round" />
            <path ref={shadowRef} d={g.d} fill="none" stroke="var(--cosq-purple)" strokeWidth="14" strokeLinecap="round" style={{ strokeDasharray: '0 100000' }} />
            <path ref={threadRef} d={g.d} fill="none" stroke="var(--cosq-pink)" strokeWidth="7" strokeLinecap="round" style={{ strokeDasharray: '0 100000' }} />
          </svg>
          <div ref={needleRef} className="journey-needle" />
          {subEventsData.map((ev, i) => (
            <div
              key={ev.title}
              className={`journey-node${i < active ? ' is-active' : ''}`}
              style={{ left: `${g.xs[i] / 10}%`, top: g.ys[i] }}
            >
              <div className="journey-card" style={{ transform: `rotate(${i % 2 ? 1 : -1}deg)` }}>
                <span className="journey-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{ev.title}</h3>
                <p>{ev.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="subevents-footer">
        <h2>See you on the ground</h2>
        <Button variant="alt" to="/">Back to the event</Button>
        <Button href="https://forms.gle/eSjE4LS8Czn3pvay6">Volunteers Join Us</Button>
      </footer>
    </div>
  );
};

export default SubEvents;
