import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-main-title">Algorithm Visualizer!</h1>
      <p className="home-subtitle" style={{width:"43%",textAlign:"center"}}>
        A tool for explaining the concept of graph algorithms in computing, including maximal matching, minimal vertex cover, and stable matching.
      </p>
      <div className="home-button-container">
        <Link to="/berge" className="home-btn">Berge Algorithm</Link>
        <Link to="/gale" className="home-btn">Gale-Shapley Algorithm</Link>
      </div>
    </div>
  );
}

export default Home;


