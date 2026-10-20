import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import More from './pages/More.js';
import Contact from './pages/Contact.js';
import BackgroundComponent from './BackgroundComponent';
import EcosystemLanding from './pages/EcosystemLanding';
import Team from './pages/Team';
import SubEvents from './pages/SubEvents';

// Start each route at the top; in-page #anchors are left to the browser.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div>
        <Routes>
          <Route path="/" element={<EcosystemLanding />} />
          <Route path="/team" element={<Team />} />
          <Route path="/legacy" element={<BackgroundComponent />} />
          <Route path="/more" element={<More />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sub-events" element={<SubEvents />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
