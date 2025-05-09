// src/components/Gale/Gale.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Gale.css';
import stepImg from './step.png'; // a placeholder thumbnail

export default function Gale() {
  return (
    <div className="gale-container">
      <h1 className="gale-title">Gale–Shapley Visualizer</h1>
      <p className="gale-subtitle">
        Select an input case to step through the Gale–Shapley algorithm.
      </p>

      <div className="gale-card-container">
        <div className="gale-non-custom-cards">
          <div className="gale-card">
            <img src={stepImg} alt="Scenario 1" className="gale-card-img" />
            <Link to="/sgraph1" className="gale-btn">Scenario 1</Link>
          </div>
          <div className="gale-card">
            <img src={stepImg} alt="Scenario 2" className="gale-card-img" />
            <Link to="/sgraph2" className="gale-btn">Scenario 2</Link>
          </div>
          <div className="gale-card">
            <img src={stepImg} alt="Scenario 3" className="gale-card-img" />
            <Link to="/sgraph3" className="gale-btn">Scenario 3</Link>
          </div>
          <div className="gale-card">
            <img src={stepImg} alt="Scenario 4" className="gale-card-img" />
            <Link to="/sgraph4" className="gale-btn">Scenario 4</Link>
          </div>
        </div>
        <div>
          <div className="gale-card custom">
            <img src={stepImg} alt="Custom Scenario" className="gale-card-img" />
            <Link to="/scustom" className="gale-btn gale-custom-btn">Custom Scenario</Link>
          </div>
        </div>
      </div>
    </div>
  );
}