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
        <div className="gale-card">
          <img src={stepImg} alt="Input Case 1" className="gale-card-img" />
          <Link to="/sgraph1" className="gale-btn">Scenario 1</Link>
        </div>
        {/* add more scenarios later */}
      </div>
    </div>
  );
}
