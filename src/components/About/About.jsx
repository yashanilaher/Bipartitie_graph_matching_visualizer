import React from 'react'

function About() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to the Bipartite Matching Visualizer</h1>
      <p style={styles.paragraph}>
        This tool is designed to help you understand and visualize the concept of
        <strong> Bipartite Graph Matching</strong> and the
        <strong> Berge's Algorithm</strong> used to find the maximum matching in
        a bipartite graph.
      </p>

      <h2 style={styles.subHeading}>What is a Bipartite Graph?</h2>
      <p style={styles.paragraph}>
        A <strong>bipartite graph</strong> is a type of graph whose vertices can
        be divided into two disjoint and independent sets, <strong>U</strong> and
        <strong> V</strong>, such that every edge connects a vertex in
        <strong> U</strong> to one in <strong>V</strong>. In simpler terms, it's
        a graph where you can split the nodes into two groups, and no edges exist
        between nodes within the same group.
      </p>

      <h2 style={styles.subHeading}>What is Bipartite Matching?</h2>
      <p style={styles.paragraph}>
        <strong>Bipartite Matching</strong> is a set of edges chosen in such a
        way that no two edges share a common vertex. In other words, it's a way to
        pair nodes from set <strong>U</strong> to set <strong>V</strong> without
        any overlaps. The goal is to find the
        <strong> maximum matching</strong>, which is the largest possible set of
        such edges.
      </p>

      <h2 style={styles.subHeading}>What is Berge's Algorithm?</h2>
      <p style={styles.paragraph}>
        <strong>Berge's Algorithm</strong> is a method used to find the maximum
        matching in a bipartite graph. It works by iteratively improving the
        matching using augmenting paths. An <strong>augmenting path</strong> is a
        path that starts and ends at unmatched vertices and alternates between
        matched and unmatched edges. By flipping the edges along this path, the
        algorithm increases the size of the matching.
      </p>

      <h2 style={styles.subHeading}>How to Use This Tool</h2>
      <div style={styles.paragraph}>
        <ul style={styles.list}>
          <li>
            <strong>Input Graph:</strong> Use the "Custom Input Graph" section to
            input your own bipartite graph by specifying edges between nodes in
            set <strong>A</strong> and set <strong>B</strong>.
          </li>
          <li>
            <strong>Visualize:</strong> The tool will automatically visualize
            the graph and highlight the maximum matching using Berge's Algorithm.
          </li>
          <li>
            <strong>Learn:</strong> Explore the step-by-step visualization to
            understand how the algorithm works.
          </li>
        </ul>
      </div>

      <p style={styles.paragraph}>
        Ready to get started? Navigate to the <strong>Custom Input Graph</strong>{" "}
        section to create your own bipartite graph and see the algorithm in
        action!
      </p>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    lineHeight: "1.6",
  },
  heading: {
    fontSize: "2.5rem",
    color: "#333",
    textAlign: "center",
    marginBottom: "20px",
  },
  subHeading: {
    fontSize: "1.8rem",
    color: "#444",
    marginTop: "30px",
    marginBottom: "10px",
  },
  paragraph: {
    fontSize: "1.1rem",
    color: "#555",
    marginBottom: "20px",
  },
  list: {
    marginLeft: "20px",
    listStyleType: "disc",
  },
};

export default About
