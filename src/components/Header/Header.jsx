// Header.js
import React from "react";
import { Link } from "react-router-dom";
import logo from "./logo1.jpeg";
// import "./index.css"; // Import the CSS file
import "./Header.css";

function Header() {
  return (
    <header className="header-header">
      <nav className="header-nav">
        <ul className="header-ul">
          <div className="header-plate1">
            <li className="header-li header-logo">
              <Link to="/" className="header-logo-link">
                <span className="header-algo">Algo</span>
                <img
                  src={logo} // Add correct path for the logo
                  alt="logo"
                  className="header-logo-img"
                />
                <span className="header-saurus">PLAY</span>
              </Link>
            </li>
          </div>
          <div className="header-plate2">
            <li className="header-li">
              <Link to="/about" className="header-link">Learn</Link>
            </li>
            <li className="header-li">
              <Link to="/contact" className="header-link">Contact</Link>
            </li>
          </div>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
