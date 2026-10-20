import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import More from './pages/More.js';
import Contact from './pages/Contact.js';
import BackgroundComponent from './BackgroundComponent';
import EcosystemLanding from './pages/EcosystemLanding';
import Team from './pages/Team';
import SubEvents from './pages/SubEvents';

function App() {
  return (
    <Router>
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
