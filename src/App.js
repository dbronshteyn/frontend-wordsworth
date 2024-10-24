import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Settings from './components/Settings';
import FlashcardSetDetail from './components/FlashcardSetDetail';
import GrokMode from './components/GrokMode';
import CardsShow from './components/CardsShow';

/**
 * Main application component.
 * @returns {Element}
 * @constructor
 */

function App() {
  return (
      <Router>
        <div>
          {/* Navbar */}
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
              <Link className="navbar-brand" to="/">Wordsworth</Link>
              <div className="collapse navbar-collapse">
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to="/about">About</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/settings">Settings</Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          {/* Routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/set/:id" element={<FlashcardSetDetail />} />
            <Route path="/grok/:id" element={<GrokMode />} />
            <Route path="/cards/:id" element={<CardsShow />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;