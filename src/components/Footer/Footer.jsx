import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer-footer">
      <p className="footer-text">© 2025 AlgoPLAY. All rights reserved.</p>
      <ul className="footer-footer-links">
        <li>
          <a href="/privacy" className="footer-footer-link">
            Privacy Policy
          </a>
        </li>
        <li>
          <a href="/terms" className="footer-footer-link">
            Terms of Service
          </a>
        </li>
        <li>
          <a href="/contact" className="footer-footer-link">
            Contact Us
          </a>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
