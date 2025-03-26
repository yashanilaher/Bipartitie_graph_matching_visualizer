import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-main-title">Algorithm Visualizer!</h1>
      <p className="home-subtitle">
        A tool for explaining the concept of sorting algorithms in computing.
      </p>
      <div className="home-button-container">
        <Link to="/berge" className="home-btn">Berge Algorithm</Link>
        <Link to="/algorithm-b" className="home-btn">Algorithm B</Link>
      </div>
    </div>
  );
}

export default Home;
