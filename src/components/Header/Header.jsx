import React from "react";
import { Link,NavLink } from "react-router-dom";

function Header() {
  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <ul style={styles.ul}>
          <li style={styles.li}>
            <Link to="/" style={styles.link}>Intro</Link>
          </li>
          <li style={styles.li}>
            <Link to="/graph1" style={styles.link}>Graph 1</Link>
          </li>
          <li style={styles.li}>
            <Link to="/graph2" style={styles.link}>Graph 2</Link>
          </li>
          <li style={styles.li}>
            <Link to="/graph3" style={styles.link}>Graph 3</Link>
          </li>
          <li style={styles.li}>
            <Link to="/customgraph" style={styles.link}>Custom Input Graph</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: "#333",
    color: "#fff",
    padding: "10px 0",
    textAlign: "center",
  },
  nav: {
    display: "flex",
    justifyContent: "center",
  },
  ul: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    gap: "20px",
  },
  li: {
    display: "inline",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "16px",
  },
};

export default Header;