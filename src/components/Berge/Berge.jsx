import React from "react";
import { Link } from "react-router-dom";
import "./Berge.css"; // Importing Berge-specific CSS
import graphImg from './graph.png';
import G1 from "./G1.png"
import G2 from "./G2.png"
import G3 from "./G3.png"
import G4 from "./G4.png"

function Berge() {
  return (
    <div className="berge-container">
      <h1 className="berge-title">Berge Algorithm Visualizer</h1>
      <p className="berge-subtitle">
        Select a graph to visualize the Berge Algorithm in action.
      </p>

      <div className="berge-graph-container">
        <div className="berge-non-custom-graphs">
          <div className="berge-graph-card">
            <img src={G1} alt="Graph 1" className="berge-graph-img" />
            <Link to="/graph1" className="berge-btn">Graph 1</Link>
          </div>
          <div className="berge-graph-card">
            <img src={G2} alt="Graph 2" className="berge-graph-img" />
            <Link to="/graph2" className="berge-btn">Graph 2</Link>
          </div>
          <div className="berge-graph-card">
            <img src={G3} alt="Graph 3" className="berge-graph-img" />
            <Link to="/graph3" className="berge-btn">Graph 3</Link>
          </div>
          <div className="berge-graph-card">
            <img src={G4} alt="Graph 4" className="berge-graph-img" />
            <Link to="/graph4" className="berge-btn">Graph 4</Link>
          </div>
        </div>
        <div className="berge-graph-card custom">
          <img src={graphImg} alt="Custom Graph" className="berge-graph-img" />
          <Link to="/custom" className="berge-btn berge-custom-btn">Custom Graph</Link>
        </div>
      </div>
    </div>
  );
}

export default Berge;
