import React from "react";

function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>© 2025 Bipartite Matching Visualizer. All rights reserved.</p>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#333",
    color: "#fff",
    textAlign: "center",
    padding: "10px 0",
    position: "fixed",
    bottom: 0,
    width: "100%",
  },
  text: {
    margin: 0,
    fontSize: "14px",
  },
};

export default Footer;