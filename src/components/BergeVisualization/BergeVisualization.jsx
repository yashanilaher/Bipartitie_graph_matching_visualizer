import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const BergeVisualization = ({ graph }) => {
  const svgRef = useRef();
  const [step, setStep] = useState(0);
  const [matching, setMatching] = useState([]); // Current matching
  const [augmentingPath, setAugmentingPath] = useState([]); // Current augmenting path
  const { nodes, links } = graph;

  // Function to find an augmenting path using BFS
  const findAugmentingPath = () => {
    const queue = [];
    const parent = {};
    const visited = new Set();

    // Start from all unmatched nodes in A
    for (const node of nodes) {
      if (
        node.group === "A" &&
        !matching.some((e) => e.source.id === node.id || e.target.id === node.id)
      ) {
        queue.push(node.id);
        parent[node.id] = null;
        visited.add(node.id);
      }
    }

    while (queue.length > 0) {
      const u = queue.shift();

      // Explore neighbors
      for (const edge of links) {
        if (edge.source.id === u) {
          const v = edge.target.id;

          if (!visited.has(v)) {
            visited.add(v);
            parent[v] = u;

            // Check if the neighbor is unmatched
            if (!matching.some((e) => e.source.id === v || e.target.id === v)) {
              // Found an augmenting path
              const path = [];
              let current = v;
              while (current !== null) {
                path.push(current);
                current = parent[current];
              }
              const pp=path.reverse();
              console.log("path",pp);
              return pp;
            }

            // If the neighbor is matched, follow the matching edge
            const matchedEdge = matching.find(
              (e) => e.source.id === v || e.target.id === v
            );
            if (matchedEdge) {
              const w = matchedEdge.source.id === v ? matchedEdge.target.id : matchedEdge.source.id;
              if (!visited.has(w)) {
                queue.push(w);
                parent[w] = v;
                visited.add(w);
              }
            }
          }
        }
      }
    }
    return null; // No augmenting path found
  };

  // Function to update the matching using the augmenting path
  const updateMatching = (path) => {
    const newMatching = [...matching];

    for (let i = 0; i < path.length - 1; i += 2) {
      const u = path[i];
      const v = path[i + 1];
      const edge = links.find(
        (e) => e.source.id === u && e.target.id === v
      );

      if (edge) {
        // Remove existing matching edges if any
        newMatching.splice(
          newMatching.findIndex(
            (e) => e.source.id === edge.source.id && e.target.id === edge.target.id
          ),
          1
        );
        // Add the new matching edge
        newMatching.push(edge);
      }
    }
    setMatching(newMatching);
    console.log("matching",matching);
  };

  // Handle next step of the algorithm
  const handleNextStep = () => {
    const path = findAugmentingPath();
    if (path) {
      setAugmentingPath(path);
      updateMatching(path);
    } else {
      alert("No more augmenting paths found. Maximum matching reached!");
    }
    setStep(step + 1);
  };

  // Handle reset
  const handleReset = () => {
    setStep(0);
    setMatching([]);
    setAugmentingPath([]);
  };

  // Render the graph using D3
  useEffect(() => {
    const width = 600,
      height = 400;
    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

    svg.selectAll("*").remove();

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).id((d) => d.id).distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "x",
        d3.forceX((d) => (d.group === "A" ? 200 : 400)).strength(1)
      )
      .force("y", d3.forceY(height / 2).strength(0.1));

    // Draw links
    const link = svg
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", (d) => {
        if (augmentingPath.includes(d.source.id) && augmentingPath.includes(d.target.id))
          return "green";
        if (matching.some((e) => e.source.id === d.source.id && e.target.id === d.target.id))
          return "red";
        return "#999";
      })
      .attr("stroke-width", 2);

    // Draw nodes
    const node = svg
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 15)
      .attr("fill", (d) => (d.group === "A" ? "#ff7f0e" : "#1f77b4"));

    // Add labels
    svg
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("dx", -5)
      .attr("dy", 5)
      .text((d) => d.id)
      .style("font-size", "14px");

    // Update positions during simulation
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      svg.selectAll("text").attr("x", (d) => d.x).attr("y", (d) => d.y);
    });
  }, [nodes, links, matching, augmentingPath]);

  return (
    <div>
      <svg ref={svgRef} style={{ border: "2px solid black" }}></svg>
      <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
        <button onClick={handleNextStep}>Next Step</button>
        <button onClick={handleReset}>Reset</button>
      </div>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <h3>Step {step + 1}</h3>
        <p>
          {augmentingPath.length > 0
            ? `Augmenting path found: ${augmentingPath.join(" -> ")}`
            : "No augmenting path found. Maximum matching reached!"}
        </p>
      </div>
    </div>
  );
};

export default BergeVisualization;